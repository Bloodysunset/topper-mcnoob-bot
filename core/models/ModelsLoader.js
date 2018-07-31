class ModelsLoader {
  constructor() {
    // Syncing DB with models
    const Tags = require('./components/models/Tags');
    Tags.sync({ force: true });
  }
}

module.exports = ModelsLoader;