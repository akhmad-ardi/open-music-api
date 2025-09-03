require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const collaborations = require('./api/collaborations');
const Exports = require('./api/exports');

// Services
const AlbumService = require('./services/postgres/AlbumService');
const SongService = require('./services/postgres/SongService');
const UserService = require('./services/postgres/UserService');
const AuthenticationService = require('./services/postgres/AuthenticationService');
const PlaylistService = require('./services/postgres/PlaylistService');
const PlaylistSongService = require('./services/postgres/PlaylistSongActivityService');
const CollaborationService = require('./services/postgres/CollaborationService');
const UserAlbumLikeService = require('./services/postgres/UserAlbumLikeService');
const CacheService = require('./services/redis/CacheService');
const producerService = require('./services/rabbitmq/ProducerService');
const UploadService = require('./services/storage/UploadService');

const tokenManager = require('./tokenize/TokenManager');

const Validator = require('./validations');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authenticationService = new AuthenticationService();
  const playlistService = new PlaylistService();
  const playlistSongService = new PlaylistSongService();
  const userAlbumLikeService = new UserAlbumLikeService();
  const collaborationService = new CollaborationService();
  const cacheService = new CacheService();
  const uploadService = new UploadService(path.resolve(__dirname, '../public/cover/'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    // debug: {
    //   request: ['error'],
    // },
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('open_music_api_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  server.auth.default('open_music_api_jwt');

  // public files
  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../public'),
      },
    },
    options: {
      auth: false,
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumService,
        uploadService,
        userAlbumLikeService,
        cacheService,
        validator: Validator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: Validator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: Validator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationService,
        userService,
        tokenManager,
        validator: Validator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistService,
        playlistSongService,
        songService,
        validator: Validator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationService,
        playlistService,
        userService,
        validator: Validator,
      },
    },
    {
      plugin: Exports,
      options: {
        producerService,
        playlistService,
        validator: Validator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
