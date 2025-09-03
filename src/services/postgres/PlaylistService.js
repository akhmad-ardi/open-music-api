const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapSongDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT DISTINCT p.id, p.name, u.username
              FROM playlists p
              INNER JOIN users u ON p.owner = u.id
              LEFT JOIN collaborations c ON p.id = c.playlist_id
              WHERE p.owner = $1 OR c.user_id = $1;
            `,
      values: [owner],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist_song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan di dalam playlist');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongs(playlistId) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name, users.username
              FROM playlists 
              INNER JOIN users ON playlists.owner = users.id
              WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);
    const playlist = resultPlaylist.rows[0];

    const queryPlaylistSong = {
      text: `SELECT * FROM playlist_songs ps 
              INNER JOIN songs ON ps.song_id = songs.id 
              WHERE ps.playlist_id = $1`,
      values: [playlist.id],
    };

    const resultPlaylistSong = await this._pool.query(queryPlaylistSong);

    return { ...playlist, songs: resultPlaylistSong.rows.map(mapSongDBToModel) };
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus');
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    const checkPlaylist = {
      text: 'SELECT 1 FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(checkPlaylist);

    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const query = {
      text: `SELECT 1
              FROM playlists p
              WHERE p.id = $1
              AND (
                p.owner = $2
                OR EXISTS (
                  SELECT 1 FROM collaborations c
                  WHERE c.playlist_id = p.id AND c.user_id = $2
                )
              )
            `,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistService;
