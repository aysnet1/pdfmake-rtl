"use strict";

exports.__esModule = true;
exports.default = void 0;
var _OutputDocument = _interopRequireDefault(require("./OutputDocument"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class OutputDocumentServer extends _OutputDocument.default {
  /**
   * @param {string} filename
   * @returns {Promise}
   */
  async write(filename) {
    const stream = await this.getStream();
    const writeStream = _fs.default.createWriteStream(filename);
    const streamEnded = new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });
    const writeClosed = new Promise((resolve, reject) => {
      writeStream.on('close', resolve);
      writeStream.on('error', reject);
    });
    stream.pipe(writeStream);
    stream.end();
    await Promise.all([streamEnded, writeClosed]);
  }
}
var _default = exports.default = OutputDocumentServer;