import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from "discord-akairo";
import {
  Logger,
  ConsoleTransport,
  PrettyFormatter,
  LogLevel,
} from "@melike2d/logger";
import { StereoOptions, GuildProvider, ApiHandler } from ".";
import { MessageEmbed } from "discord.js";
import { Manager } from "lavaclient";
import { join } from "path";

export class Stereo extends AkairoClient {
  public logger = new Logger("client.stereo", {
    transports: [
      new ConsoleTransport({
        formatter: new PrettyFormatter({
          dateFormat: "HH:mm:ss YYYY/MM/DD",
        }),
        level: LogLevel.TRACE,
      }),
    ],
  });

  public settings = new GuildProvider();

  public apis = new ApiHandler(join("build", "bot", "apis"));

  public lavalink = new Manager(config.get("nodes") as any[], {
    shards: this.shard ? this.shard.count : 1,
    send: (id, packet) => {
      const guild = this.guilds.cache.get(id);
      if (guild) guild.shard.send(packet);
      return;
    },
  });

  public constructor(public cfg: StereoOptions) {
    super({
      ownerID: cfg.owners,
      disableMentions: "everyone",
      messageCacheMaxSize: 50,
      messageCacheLifetime: 60,
      messageSweepInterval: 100,
      ws: {
        intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
      },
    });
  }

  public commands: CommandHandler = new CommandHandler(this, {
    directory: join(__dirname, "..", "bot", "commands"),
    prefix: (msg) =>
      msg.guild
        ? this.settings.get(msg.guild, "prefix.prefixes", this.cfg.prefixes)
        : this.cfg.prefixes,
    allowMention: (msg) =>
      msg.guild ? this.settings.get(msg.guild, "prefix.mention", true) : true,
    aliasReplacement: /-/g,
    argumentDefaults: {
      prompt: {
        modifyStart: (_, str) =>
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(str)
            .setFooter(`You can type "cancel" to cancel this prompt.`),
        modifyRetry: (_, str) =>
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(str)
            .setFooter(`You can type "cancel" to cancel this prompt.`),
        cancel: new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Command has been cancelled.`),
        ended: new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `You have reached the maximum amount of retries. I am now cancelling this prompt.`
          ),
        timeout: new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `You didn't respond in time. I am now cancelling this prompt.`
          ),
        retries: 2,
        time: 3e4,
      },
      otherwise: "",
    },
    ignoreCooldown: this.ownerID,
    blockBots: true,
    blockClient: true,
    automateCategories: true,
    commandUtil: true,
    handleEdits: true,
    defaultCooldown: 5000,
  });

  public events: ListenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, "..", "bot", "events"),
  });

  public inhibitors: InhibitorHandler = new InhibitorHandler(this, {
    directory: join(__dirname, "..", "bot", "inhibitors"),
  });

  public async run() {
    this.commands.useListenerHandler(this.events);
    this.commands.useInhibitorHandler(this.inhibitors);

    this.events.setEmitters({
      commands: this.commands,
      process,
      lavalink: this.lavalink,
      websocket: this.ws,
    });

    [this.commands, this.events, this.apis, this.inhibitors].map((handler) =>
      handler.loadAll()
    );

    await this.settings.init();

    return super.login(this.cfg.token);
  }
}
