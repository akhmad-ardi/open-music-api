const InvariantError = require('../exceptions/InvariantError');
const {
  AlbumPayloadSchema,
  SongPayloadSchema,
  UserPayloadSchema,
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
  PostPlaylistPayloadSchema,
  PostPlaylistSongPayloadSchema,
  DeletePlaylistSongPayloadSchema,
  PostCollaborationPayloadSchema,
  DeleteCollaborationPayloadSchema,
  PostExportPayloadSchema,
  PostAlbumCoverHeaderSchema,
} = require('./schema');

const Validator = {
  validateAlbumPayload(payload) {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongPaylod(payload) {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateUserPayload(payload) {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostPlaylistSongPayload: (payload) => {
    const validationResult = PostPlaylistSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeletePlaylistSongpayload: (payload) => {
    const validationResult = DeletePlaylistSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostCollaborationPayload: (payload) => {
    const validationResult = PostCollaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteCollaborationPayload: (payload) => {
    const validationResult = DeleteCollaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostExportPayload: (payload) => {
    const validationResult = PostExportPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostAlbumCoverHeader: (payload) => {
    const validationResult = PostAlbumCoverHeaderSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = Validator;
