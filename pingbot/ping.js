const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = 'YOUR_BOT_TOKEN_HERE';
const LOG_CHANNEL_ID = 'CHANNEL_ID_LOGS_HERE'; 

const ROLE_IDS = ['ROLE_ID_1', 'ROLE_ID_2', 'ROLE_ID_3']; // you can add as many as you want, leave it blank when you dont want to use it
const USER_IDS = ['USER_ID_1', 'USER_ID_2', 'USER_ID_3']; // you can add as many as you want, leave it blank when you dont want to use it
const ALLOWED_PING_ROLES = ['ALLOWED_PING_ROLE_ID_1', 'ALLOWED_PING_ROLE_ID_2']; // you can add as many as you want leave it blank when you dont want to use it
const ALLOWED_CHANNELS = ['CHANNEL_ID_1', 'CHANNEL_ID_2']; // you can add as many as you want, leave it blank when you dont want to use it

client.once('ready', () => {
  console.log(`Eingeloggt als ${client.user.tag}`);
  
  client.user.setPresence({
    status: 'dnd',
    afk: false,
    activity: null
  });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    return;
  }

  const mentionedRoles = message.mentions.roles;
  const mentionedUsers = message.mentions.users;

  if (ALLOWED_CHANNELS.includes(message.channel.id)) {
    return;
  }
  
  if (mentionedRoles.some((role) => ROLE_IDS.includes(role.id))) {
    const authorMember = message.guild.members.cache.get(message.author.id);
    const allowedRoles = authorMember.roles.cache.filter((role) =>
      ALLOWED_PING_ROLES.includes(role.id)
    );

    if (allowedRoles.size === 0) {
      await handleMentionedRole(message, mentionedUsers);
      logUnallowedPing(message);
    }
  }

  if (mentionedUsers.some((user) => USER_IDS.includes(user.id))) {
    const authorMember = message.guild.members.cache.get(message.author.id);
    const allowedRoles = authorMember.roles.cache.filter((role) =>
      ALLOWED_PING_ROLES.includes(role.id)
    );

    if (allowedRoles.size === 0) {
      await handleMentionedUser(message);
      logUnallowedPing(message);
    }
  }
});

async function handleMentionedRole(message, mentionedUsers) {
  if (message.guild) {
    const user = message.author;

    try {
      const dmChannel = await user.createDM();
      await dmChannel.send({
        embeds: [
          {
            title: 'Anti Ping System',
            description: `You have pinged a secured Role in ${message.guild.name} That is not allowed! Please dont do this anymore. \n \n **__Message:__** \n \n ${message.content}`,
            color: 0xFF8800, 
          },
        ],
      });
      console.log(`DM send to ${user.tag} .`);

      message.delete().catch(console.error);
    } catch (error) {
      console.error(`Failed to send DM to ${user.tag}: ${error}`);
      
      const replyMessage = `${user}`;
      const sentMessage = await message.channel.send(replyMessage);
      

      setTimeout(() => {
        message.delete().catch(console.error);
      }, 2000);

      await message.channel.send({
        embeds: [
          {
            title: 'Anti Ping System',
            description: `${user} You pinged a secured Role! That is not allowed! Please dont do this anymore. \n \n **__Message:__** \n \n ${message.content}`,
            color: 0xFF8800, 
          },
        ],
      });
    }
  }
}

async function handleMentionedUser(message) {
  if (message.guild) {
    const user = message.author;

    try {
      const dmChannel = await user.createDM();
      await dmChannel.send({
        embeds: [
          {
            title: 'Anti Ping System',
            description: `You have pinged a secured Role in ${message.guild.name} That is not allowed! Please dont do this anymore. \n \n **__Message:__** \n \n ${message.content}`,
            color: 0xFF8800, 
          },
        ],
      });
      console.log(`DM sended to ${user.tag}`);

      message.delete().catch(console.error);
    } catch (error) {
      console.error(`Failed to send a DM to ${user.tag}: ${error}`);
      
      const replyMessage = `${user}`;
      const sentMessage = await message.channel.send(replyMessage);
      

      setTimeout(() => {
        message.delete().catch(console.error);
      }, 2000);

      await message.channel.send({
        embeds: [
          {
            title: 'Anti Ping System',
            description: `${user} You pinged a secured Role! That is not allowed! Please dont do this anymore. \n \n **__Message:__** \n \n ${message.content}`,
            color: 0xFF8800, 
          },
        ],
      });
    }
  }
}

function logUnallowedPing(message) {
  const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
  if (logChannel) {
    const embed = {
      title: 'Unerlaubter Ping',
      description: `Unallowed ping from ${message.author.tag} in channel ${message.channel.toString()}: \n \n **__Message:__** \n \n ${message.content}`,
      color: 0xFF0000,
      timestamp: new Date(),
    };
    logChannel.send({ embeds: [embed] });
  }
}

client.login(TOKEN);
