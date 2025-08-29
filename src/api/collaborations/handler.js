const autoBind = require('auto-bind');

class CollaborationHandler {
  constructor(collaborationService, playlistService, userService, validator) {
    this._collaborationService = collaborationService;
    this._playlistService = playlistService;
    this._userService = userService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._userService.verifyUserById(userId);
    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const collaborationId = await this._collaborationService.addCollaboration(
      { playlistId, userId },
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);

    return response;
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateDeleteCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Berhasil menghapus kolaborasi',
    };
  }
}

module.exports = CollaborationHandler;
