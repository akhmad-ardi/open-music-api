const routes = (handler) => ([
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongByIdHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongHandler,
    options: {
      auth: false,
    },
  },
]);

module.exports = routes;
