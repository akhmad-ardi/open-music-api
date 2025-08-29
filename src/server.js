require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const collaborations = require('./api/collaborations');

// Services
const AlbumService = require('./services/AlbumService');
const SongService = require('./services/SongService');
const UserService = require('./services/UserService');
const AuthenticationService = require('./services/AuthenticationService');
const PlaylistService = require('./services/PlaylistService');
const PlaylistSongService = require('./services/PlaylistSongActivityService');
const CollaborationService = require('./services/CollaborationService');

const TokenManager = require('./tokenize/TokenManager');

const Validator = require('./validations');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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

  await server.register([
    {
      plugin: albums,
      options: {
        service: AlbumService,
        validator: Validator,
      },
    },
    {
      plugin: songs,
      options: {
        service: SongService,
        validator: Validator,
      },
    },
    {
      plugin: users,
      options: {
        service: UserService,
        validator: Validator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationService: AuthenticationService,
        userService: UserService,
        tokenManager: TokenManager,
        validator: Validator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistService: PlaylistService,
        playlistSongService: PlaylistSongService,
        songService: SongService,
        validator: Validator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationService: CollaborationService,
        playlistService: PlaylistService,
        userService: UserService,
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
        // console.log('1 ', response);
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        // console.log('2 ', response);
        return h.continue;
      }

      // console.log('3 ', response);
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
