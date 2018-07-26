const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token} = require('./config.json');

const botAvatar = 'https://cdn.discordapp.com/avatars/471635315166150666/ca14cf85c3f1673f38f7c8acd382b251.png';

const botInfos = new Discord.RichEmbed()
    .setAuthor(`Informations générales`, botAvatar)
    .setColor(0x21ACF7)
    .setFooter(`Pour plus d'informations...`, botAvatar)
    .setThumbnail(botAvatar+'?size=1024')
    .setTimestamp()
    .addField(`Qui est-tu ?`, `Je me nomme Jeeves. J'ai été créé par Bloodysunset afin de faciliter la vie des modos et de vous apporter quelques commandes et fonctionnalités.`)
    .addField(`Des commandes ? Des fonctionnalités ? 😱`, `En effet.
-Pour une liste de commandes: \`?cmds\`.
-Pour une liste des fonctionnalités: \`?features\`.
-Pour plus d'informations: \`?help\``, true);

const botCommands = new Discord.RichEmbed()
    .setAuthor(`Commandes disponibles`, botAvatar)
    .setColor(0xCA0C08)
    .setFooter(`Pour plus d'informations...`, botAvatar)
    .setThumbnail(botAvatar+'?size=1024')
    .setTimestamp()
    .addField(`?cmds or ?help`, `Display this box.`)
    .addField(`?info bot`, `Display more informations about Jeeves.`)
    //.addField('?ping', ping.help)
    .addField(`?secondChannel`, `Write a message in another channel. Don't ask why.`)
    .addField(`!setGame`, `Set the game to which Jeeves should 'play'.`)
    .addField(`!file [url]`, `Jeeves will display the file for you.`)
    .addField(`!delete x`, `Delete X messages, starting by the last one.`)
    .addField(`What is my avatar?`, `This one is particular. You need to ask Jeeves first. To do so, just call him : \`Jeeves\`, \`Jeeves?\` or \`Jeeves!\`, then ask him the command.`);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    // Return if not a command issued by a human-user
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.reply('Pong!');
    }
    else if (command === 'server') {
        message.channel.send(`This server's name is: **${message.guild.name}**\nThere is a total of **${message.guild.memberCount} peons** here.`);
    }
    else if (command === 'kick') {
        if (!message.mentions.users.size) {
            return message.reply(`you need to tag a user in order to kick them!`);
        }
        // grab the "first" mentioned user from the message
        // this will return a `User` object, just like `message.author`
        const taggedUser = message.mentions.users.first();

        message.channel.send(`You wanted to kick: @${taggedUser.username}#${taggedUser.discriminator}`);
    }
    else if (command === 'avatar') {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
        }

        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: ${user.displayAvatarURL}`;
        });

        // send the entire array of strings as a message
        // by default, discord.js will `.join()` the array with `\n`
        message.channel.send(avatarList);
    }
    else if (command === 'info') {
        if (args[0] === 'bot') {
            message.channel.send(botInfos, '', {disableEveryone: true});
        }
        else if (args[0] === 'commands' || args[0] === 'help') {
            message.channel.send(botCommands, '', {disableEveryone: true});
        }
    }
});

client.login(token);