const FileSystem   = require('../files/FileSystem'),
      Discord      = require('discord.js'),
      {components} = require('./../routing/Routes');

class CommandLoader {
  constructor(client) {
    client.commands = new Discord.Collection();

    const commandsFiles = new FileSystem().findFilesByExtension(
        components + 'commands/',
        '.js',
    );

    for (const file of commandsFiles) {
      const command = file.getContent();
      client.commands.set(command.name, command);
    }
  }
}

module.exports = CommandLoader;