const {prefix, default_cooldown, botAvatar, quotes} = require('../../config.json'),
      Discord                    = require('discord.js');

module.exports = {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 5,
  execute(message, args) {
    const botCommands = new Discord.RichEmbed().setColor(0x2196F3)
        .setThumbnail(botAvatar + '?size=1024');
    const data = [];
    const {commands} = message.client;

    if (!args.length) {
      botCommands.setAuthor(`Here's a list of all my skills:`, botAvatar)
          .setTimestamp();

      // Adding a field for each command
      commands.map(function(command) {
            botCommands.addField(prefix + command.name, command.description);
          },
      );

      botCommands.addField('More about a command',
          `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`)
          .setFooter(
              '“' + quotes[Math.floor(Math.random() * quotes.length)] + '”',
              botAvatar);

      return message.author.send(botCommands)
          .then(() => {
            if (message.channel.type === 'dm') return;
            message.reply(`I've sent you a DM with all my commands!`);
          })
          .catch(error => {
            console.error(`Could not send help DM to ${message.author.tag}.\n`,
                error);
            message.reply(`it seems like I can't DM you! Do you have DMs disabled?`);
          });
    }

    const name = args[0].toLowerCase();
    const specificCommand = commands.get(name) ||
        commands.find(c => c.aliases && c.aliases.includes(name));

    if (!specificCommand) {
      return message.reply(`that's not a valid command!`);
    }

    data.push(`**Name:** ${specificCommand.name}`);

    if (specificCommand.aliases) {
      data.push(
          `**Aliases:** ${specificCommand.aliases.join(', ')}`);
    }
    if (specificCommand.description) {
      data.push(
          `**Description:** ${specificCommand.description}`);
    }
    if (specificCommand.usage) {
      data.push(
          `**Usage:** \`${prefix}${specificCommand.name} ${specificCommand.usage}\``);
    }

    data.push(`**Cooldown:** ${specificCommand.cooldown || default_cooldown} second(s)`);

    message.channel.send(data, {split: true});
  },
};