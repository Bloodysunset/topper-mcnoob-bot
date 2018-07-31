const Tags = require('../models/Tags');

module.exports = {
  name: 'addtag',
  description: 'Add a tag with the specified name.',
  async execute(message, args) {

    try {
      // equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
      const tag = await Tags.create({
        name: args[0],
        description: args.slice(1).join(' '),
        username: message.author.username,
      });
      return message.reply(`Tag \`${tag.name}\` added with the description: \`${tag.description}\`.`);
    }
    catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return message.reply('That tag already exists.');
      }
      console.error(e);
      return message.reply('Something went wrong with adding a tag.');
    }
  },
};