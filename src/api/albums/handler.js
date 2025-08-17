const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  postAlbumHandler() {}

  getAlbumHandler() {}

  putAlbumHandler() {}

  deleteAlbumHandler() {}
}

module.exports = AlbumHandler;
