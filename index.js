// import { VoiceConnection } from "@discordjs/voice";
// import DiscordJS, { Intents, Interaction } from "discord.js";
// import dotenv from "dotenv";
// import run from "nodemon/lib/monitor/run";
//import command from "./commands.js"
//=====================================================
const DiscordJS = require("discord.js");
const { Intents, Interaction } = require("discord.js");
const dotenv = require("dotenv");
const command = require("./commands");
const {
  AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  getVoiceConnection,
} = require("@discordjs/voice");

const ytdl = require("ytdl-core-discord");
const ytSearch = require("yt-search");
//const { Player } = require("discord-player");
//const playaudio = require('./play')
//const play = require('./play')
//=====================================================
//  "type": "module",

//To configure the dotenv, or our bots token!
//Important: Never share the token or push it to versionControl!
dotenv.config();

//To declare the intents of the bot, and what it listens to in a server
const myIntents = new Intents();
myIntents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_MESSAGES
);
const cisumClient = new DiscordJS.Client({ intents: myIntents });

// Bot that join VC and plays a voiceclip every 30 minutes!

//This is to turn the bot on, initializing the bot
cisumClient.on("ready", () => {
  console.log("Bot is ready to run!");

  cisumClient.user.setPresence({
    activities: [
      {
        name: "use !help",
      },
    ],
  });

  //playaudio(cisumClient)

  //Testing new way
  command(cisumClient, ["ping", "test"], (message) => {
    message.channel.send("Pong!");
  });

  command(cisumClient, ["cc", "clearchannel"], (message) => {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results, 30, true);
      });
    }
  });

  command(cisumClient, "status", (message) => {
    const content = message.content.replace("!status ", "");

    cisumClient.user.setPresence({
      activities: [
        {
          name: content,
          type: 0,
        },
      ],
    });

    message.channel.send("Status changed!");
  });

  command(cisumClient, "help", (message) => {
    message.channel.send(`
      These are my supported commands:
      **!cc/clearchannel** - To clear the current server text!
      **!status** - To change the status of the bot! (!status **text**)
      **!ping/test** - Responds with pong!
      **/play **url - Can play a video given the youtube url!
      `);
  });

  // When doing slash commands, there are guilds and global!
  // - Global is for every server, so we should first test with guilds before global!
  const guildTestServerID = 971913578229678130;
  const guildTestServer = cisumClient.guilds.cache.get(guildTestServerID);
  let commands;

  if (guildTestServer) {
    commands = guildTestServer.commands;
  } else {
    commands = cisumClient.application.commands;
  }

  //This is how we create a slash command!
  commands.create({
    name: "dn",
    description: "Replies with dn",
  });

  commands.create({
    name: "emn",
    description: "Replies with eat my nuts (emn)",
  });

  commands.create({
    name: "multiply",
    description: "Multiplies two numbers!",
    options: [
      {
        name: "num1",
        description: "The first number",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
      },
      {
        name: "num2",
        description: "The second number",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
      },
    ],
  });

  commands.create({
    name: "combine",
    description: "Combines two strings!",
    options: [
      {
        name: "str1",
        description: "The first string",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
      },
      {
        name: "str2",
        description: "The second string",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
      },
    ],
  });

  //Make a slash command that plays a meow clip later!
  commands.create({
    name: "meow",
    description: 'Plays a clip of Pokimane saying "meow"',
  });

  //Make a slash command that plays a meow clip later!
  commands.create({
    name: "die",
    description: "Makes the bot leave the voice channel!",
  });

  commands.create({
    name: "play",
    description: "Plays the song you requested",
    options: [
      {
        name: "url",
        description: "The url of the song",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
      },
    ],
  });

  commands.create({
    name: "playsearch",
    description: "Plays the song you requested without needing the url",
    options: [
      {
        name: "song",
        description: "The name of the song",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
      },
    ],
  });
});

//=====================================================

//Listener for our dn slash command!
cisumClient.on("interactionCreate", async (dnInteraction) => {
  if (!dnInteraction.isCommand()) {
    return;
  }

  const { commandName, options } = dnInteraction;
  if (commandName === "dn") {
    dnInteraction.reply({
      content: "dn!",
      ephemeral: false,
    });
  }
});

//Listener for our emn slash command!
cisumClient.on("interactionCreate", async (emnInteraction) => {
  if (!emnInteraction.isCommand()) {
    return;
  }

  const { commandName, options } = emnInteraction;
  if (commandName === "emn") {
    emnInteraction.reply({
      content: "eat my nuts!",
      ephemeral: false,
    });
  }
});

//Listener for our multiply slash command!
cisumClient.on("interactionCreate", async (multiplyIntreaction) => {
  if (!multiplyIntreaction.isCommand()) {
    return;
  }

  // Command name refers to the name of the slash commands, and options
  // represents the parameters that we call the command with in our slash!
  const { commandName, options } = multiplyIntreaction;

  if (commandName === "multiply") {
    const resultNum1 = options.getNumber("num1") || 0;
    const resultNum2 = options.getNumber("num2") || 0;
    //console.log(resultNum1)
    //console.log(resultNum2)
    const resultOfNum1Num2 = resultNum1 * resultNum2;
    //console.log(resultOfNum1Num2)
    multiplyIntreaction.reply({
      content: "The result is: " + resultOfNum1Num2.toString(),
      ephemeral: false,
    });
  }
});

//Listener for our combine slash command!
cisumClient.on("interactionCreate", async (combineInteraction) => {
  if (!combineInteraction.isCommand()) {
    return;
  }

  // Command name refers to the name of the slash commands, and options
  // represents the parameters that we call the command with in our slash!
  const { commandName, options } = combineInteraction;

  if (commandName === "combine") {
    const resultSTR1 = options.getString("str1") || 0;
    const resultSTR2 = options.getString("str2") || 0;
    //console.log(resultSTR1)
    //console.log(resultSTR2)
    const resultOfSTR1N2 = resultSTR1 + resultSTR2;
    //console.log(resultOfSTR1N2)
    combineInteraction.reply({
      content: "The result is: " + resultOfSTR1N2,
      ephemeral: false,
    });
  }
});

//Listener for our meow command!
cisumClient.on("interactionCreate", async (meowInteraction) => {
  if (!meowInteraction.isCommand()) {
    return;
  }

  const { commandName, options } = meowInteraction;

  //Created an audio player!
  const audioPlayer = createAudioPlayer();

  const resource = createAudioResource("yimit.mp3");
  //resource.volume.setVolume(0.2)
  //const subscription = connection.subscribe(audioPlayer);

  //const modChannel = meowInteraction.guild.channels.cache.get(guildDB.modChannel);
  if (commandName === "meow") {
    if (meowInteraction.member.voice.channel) {
      const connection = joinVoiceChannel({
        channelId: meowInteraction.member.voice.channel.id,
        guildId: meowInteraction.guild.id,
        adapterCreator: meowInteraction.guild.voiceAdapterCreator,
      });
      connection.subscribe(audioPlayer);
      audioPlayer.play(resource);
      meowInteraction.reply({
        content: "Playing the clip!",
      });
    } else {
      meowInteraction.reply({
        content: "Get in a voice channel first!",
      });
    }
  }
});

//Listener for our die command!
cisumClient.on("interactionCreate", async (dieInteraction) => {
  if (!dieInteraction.isCommand()) {
    return;
  }

  const { commandName, options } = dieInteraction;

  if (commandName === "die") {
    const connection = joinVoiceChannel({
      channelId: dieInteraction.member.voice.channel.id,
      guildId: dieInteraction.guild.id,
      adapterCreator: dieInteraction.guild.voiceAdapterCreator,
    });
    dieInteraction.reply({
      content: "Left the channel!",
    });
    connection.destroy(true);
  }
});

//Listener for our play command!
cisumClient.on("interactionCreate", async (playInteraction) => {
  if (!playInteraction.isCommand()) {
    return;
  }

  const { commandName, options } = playInteraction;

  if (commandName === "play") {
    if (!playInteraction.member.voice.channel) {
      playInteraction.reply({
        content: "You must be in a voice channel first",
      });
    } else {
      const connection = joinVoiceChannel({
        channelId: playInteraction.member.voice.channel.id,
        guildId: playInteraction.guild.id,
        adapterCreator: playInteraction.guild.voiceAdapterCreator,
      });

      const currURL = options.getString("url");
      console.log(currURL);
      var stream = await ytdl(currURL, {
        highWaterMark: 1 << 25,
        filter: "audioonly",
      });

      //Make sure to add something that makes the bot not join if the url is bad!

      const player = createAudioPlayer();
      const resource = createAudioResource(stream, {
        inputType: StreamType.Opus,
      });
      await player.play(resource);
      connection.subscribe(player);

      playInteraction.reply({
        content: `🎶 Now Playing ${currURL}`,
      });
    }
  }
});

//Listener for our playsearch command!
cisumClient.on("interactionCreate", async (playsearchInteraction) => {
  if (!playsearchInteraction.isCommand()) {
    return;
  }

  const { commandName, options } = playsearchInteraction;

  if (commandName === "playsearch") {
    if (!playsearchInteraction.member.voice.channel) {
      playsearchInteraction.reply({
        content: "You must be in a voice channel first",
      });
    } else {
      const connection = joinVoiceChannel({
        channelId: playsearchInteraction.member.voice.channel.id,
        guildId: playsearchInteraction.guild.id,
        adapterCreator: playsearchInteraction.guild.voiceAdapterCreator,
      });

      const requestedSong = playsearchInteraction.options.getString("song");
      //console.log(requestedSong)
      const requestedURL = await ytSearch(requestedSong);

      if (requestedURL.videos.length == 0) {
        playsearchInteraction.reply({
          content: `Cant find this video, leaving!`,
        });
        connection.destroy(true);
        return;
      }

      var chosenURL =
        requestedURL.videos.length > 1 ? requestedURL.videos[0] : null;
      //console.log(chosenURL)
      var stream = await ytdl(chosenURL.url, {
        highWaterMark: 1 << 25,
        filter: "audioonly",
      });

      const player = createAudioPlayer();
      const resource = createAudioResource(stream, {
        inputType: StreamType.Opus,
      });
      await player.play(resource);
      connection.subscribe(player);

      playsearchInteraction.reply({
        content: `🎶 Now Playing ${chosenURL.url}`,
      });
    }
  }
});

//Add pause button later, no need for stop as we already have a die button!
//=====================================================

//Listen For Typing Event (in this case its ping)
cisumClient.on("messageCreate", (messagePing) => {
  if (messagePing.content === "ping") {
    messagePing.reply({
      content: "jason likes nuts",
    });
  }
});

//Listen For Typing Event (in this case its mad?)
cisumClient.on("messageCreate", (messageMad) => {
  if (messageMad.content === "mad?") {
    messageMad.reply({
      content: "how bout you get some bitches!",
    });
  }
});

//To login into the bot
cisumClient.login(process.env.TOKEN);

//=====================================================
