const routes = (handler) => ([
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postCollaborationHandler,
  },
]);

module.exports = routes;
