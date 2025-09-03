const routes = (handler) => ([
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postAlbumCoverHandler,
    options: {
      auth: false,
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
        parse: true,
      },
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postAlbumLikesHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getAlbumLikesHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: handler.deleteAlbumLikesHandler,
  },
]);

module.exports = routes;
