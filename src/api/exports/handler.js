const autoBind = require('auto-bind');

class ExportHandler {
  constructor(producerService, playlistService, validator) {
    this._producerService = producerService;
    this._playlistService = playlistService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validatePostExportPayload(request.payload);
    const { targetEmail } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const message = { playlistId, targetEmail };

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._producerService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);

    return response;
  }
}

module.exports = ExportHandler;
