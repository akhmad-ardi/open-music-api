const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    albumService, uploadService, userAlbumLikeService, cacheService, validator,
  }) => {
    const albumHandler = new AlbumHandler(
      albumService,
      uploadService,
      userAlbumLikeService,
      cacheService,
      validator,
    );
    server.route(routes(albumHandler));
  },
};
