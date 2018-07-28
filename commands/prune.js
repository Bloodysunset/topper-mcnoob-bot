module.exports = {
  name: 'prune',
  description: 'Prune X amount of messages, where X is between 1 and 100.',
  aliases: ['delete', 'dd'],
  usage: '10',
  guildOnly: true,
  execute(message, args) {
    // amount + 1, because when you ask for a prune... Well, that's a +1.
    let amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.reply(`that doesn't seem to be a valid number.`);
    }
    else if (amount < 1 || amount > 100) {
      return message.reply('you need to input a number between 1 and 100.');
    }

    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      message.channel.send(`there was an error trying to prune messages in this channel!`);
    });
  },
};