module.exports = {
    name: 'server',
    description: `Show server's informations.`,
    execute(message, args) {
        message.channel.send(`This server's name is: **${message.guild.name}**\nThere is a total of **${message.guild.memberCount} peons** here.`);
    },
};