class File {
  constructor(path, name) {
    if(!path.endsWith('/')) {
      path += '/';
    }

    this.path = path;
    this.name = name;
  }

  getName() {
    return this.name;
  }

  getContent() {
    return require(`${this.path}${this.name}`);
  }
}

module.exports = File;