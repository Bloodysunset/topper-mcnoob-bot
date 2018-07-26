const fs = require('fs');
const {prefix, token} = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const botAvatar = 'https://cdn.discordapp.com/avatars/471635315166150666/ca14cf85c3f1673f38f7c8acd382b251.png';

const botInfos = new Discord.RichEmbed()
    .setAuthor(`Informations générales`, botAvatar)
    .setColor(0x21ACF7)
    .setFooter(`Pour plus d'informations...`, botAvatar)
    .setThumbnail(botAvatar + '?size=1024')
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
    .setThumbnail(botAvatar + '?size=1024')
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
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

    /* To port later!
    else if (command === 'info') {
        if (args[0] === 'bot') {
            message.channel.send(botInfos, '', {disableEveryone: true});
        }
        else if (args[0] === 'commands' || args[0] === 'help') {
            message.channel.send(botCommands, '', {disableEveryone: true});
        }
    }*/
});

client.login(token).catch(err => {
    console.error(err);
});