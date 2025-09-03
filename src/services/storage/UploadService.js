const fs = require('fs');

class UploadService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeCover(file, meta) {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${meta.filename}`;
      const pathFile = `${this._folder}/${filename}`;
      const fileStream = fs.createWriteStream(pathFile);

      fileStream.on('error', (error) => reject(error));

      fileStream.on('finish', () => resolve(filename));

      file.pipe(fileStream);
    });
  }
}

module.exports = UploadService;
