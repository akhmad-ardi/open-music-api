const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(albumService, uploadService, userAlbumLikeService, cacheService, validator) {
    this._albumService = albumService;
    this._uploadService = uploadService;
    this._userAlbumLikeService = userAlbumLikeService;
    this._cacheService = cacheService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._albumService.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);

    return response;
  }

  async getAlbumHandler(request) {
    const { id } = request.params;

    const album = await this._albumService.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._albumService.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumHandler(request) {
    const { id } = request.params;

    await this._albumService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validatePostAlbumCoverHeader(cover.hapi.headers);
    const { id } = request.params;

    const filename = await this._uploadService.writeCover(cover, cover.hapi);
    await this._albumService.addAlbumCover(id, filename);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);

    return response;
  }

  async postAlbumLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumService.getAlbumById(albumId);
    await this._userAlbumLikeService.verifyUserAlbumLike(albumId, credentialId);
    await this._userAlbumLikeService.addUserAlbumLike(albumId, credentialId);
    await this._cacheService.delete(albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);

    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const cacheLikes = await this._cacheService.get(albumId);
    if (cacheLikes) {
      const response = h.response({
        status: 'success',
        data: {
          likes: +cacheLikes,
        },
      });
      response.header('X-Data-Source', 'cache');

      return response;
    }

    const likes = await this._userAlbumLikeService.getUserAlbumLike(albumId);
    await this._cacheService.set(albumId, likes, 1800);

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }

  async deleteAlbumLikesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._userAlbumLikeService.deleteUserAlbumLikes(albumId, credentialId);
    await this._cacheService.delete(albumId);

    return {
      status: 'success',
      message: 'Berhasil membatalkan menyukai album',
    };
  }
}

module.exports = AlbumHandler;
