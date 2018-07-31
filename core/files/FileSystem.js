const fs   = require('fs'),
      File = require('./File');

class FileSystem {
  findFile(directory, name) {
    //
  }

  /**
   *
   * @param directory
   * @returns {File[]}
   */
  findFiles(directory) {
    return fs.readdirSync(directory).map(fileName => new File(directory, fileName));
  }

  /**
   * Get files in specified directory with extension
   *
   * @param directory
   * @param extension
   * @returns {File[]}
   */
  findFilesByExtension(directory, extension) {
    return this.findFiles(directory).filter(file => file.getName().endsWith(extension));
  }
}

module.exports = FileSystem;