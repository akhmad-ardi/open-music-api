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
]);

module.exports = routes;
