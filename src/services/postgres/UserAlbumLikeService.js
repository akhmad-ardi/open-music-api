const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');

class UserAlbumLikeService {
  constructor() {
    this._pool = new Pool();
  }

  async addUserAlbumLike(albumId, userId) {
    const id = `user_album_like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menyukai album ini');
    }
  }

  async getUserAlbumLike(albumId) {
    const query = {
      text: `SELECT COUNT(album_id) AS total_likes 
              FROM user_album_likes 
              WHERE album_id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return +result.rows[0].total_likes;
  }

  async deleteUserAlbumLikes(albumId, userId) {
    const query = {
      text: `DELETE FROM user_album_likes 
              WHERE album_id = $1 AND user_id = $2 RETURNING id`,
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal batalkan menyukai album ini. Id tidak ditemukan');
    }
  }

  async verifyUserAlbumLike(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new ClientError('Anda sudah menyukai album ini');
    }
  }
}

module.exports = UserAlbumLikeService;
