const fs              = require('fs'),
      {prefix, token} = require('./config.json'),
      Discord         = require('discord.js'),
      client          = new Discord.Client(),
      cooldowns       = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands')
                       .filter(file => file.endsWith('.js'))

client.commands = new Discord.Collection()

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity('his farm burn', {type: 'WATCHING'}).catch(err => {
    console.error(err)
  })
})

client.on('message', message => {
  // Return if not a command issued by a human-user
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return
  }

  const args        = message.content.slice(prefix.length).split(/ +/),
        commandName = args.shift().toLowerCase()

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) return

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
    }

    return message.channel.send(reply)
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (!timestamps.has(message.author.id)) {
    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
  }
  else {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(`please wait ${timeLeft.toFixed(
        1)} more second(s) before reusing the \`${command.name}\` command.`)
    }

    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
  }

  try {
    command.execute(message, args)
  }
  catch (error) {
    console.error(error)
    message.reply('there was an error trying to execute that command!')
  }

})

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', 'general')
  // Do nothing if the channel wasn't found on this server
  if (!channel) return
  // Send the message, mentioning the member
  channel.send(`Welcome to the guild, ${member}`)
})

client.login(token).catch(err => {
  console.error(err)
})