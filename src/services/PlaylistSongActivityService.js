const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');

class PlaylistSongActivityService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivity({
    playlistId, songId, userId, action,
  }) {
    const id = `playlist_activity-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, new Date().toISOString()],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Terjadi kesalahan pada saat menambahkan aktivitas playlist');
    }
  }

  async getPlaylistSongActivities(playlistId) {
    const queryPlaylistSongActivities = {
      text: `SELECT u.username, s.title, psa.action, psa.time FROM playlist_song_activities psa 
              INNER JOIN users u ON psa.user_id = u.id
              INNER JOIN songs s ON psa.song_id = s.id
              WHERE psa.playlist_id = $1`,
      values: [playlistId],
    };

    const resultPlaylistSongActivities = await this._pool.query(queryPlaylistSongActivities);
    const playlistSongActivities = resultPlaylistSongActivities.rows;

    return playlistSongActivities;
  }
}

module.exports = new PlaylistSongActivityService();
