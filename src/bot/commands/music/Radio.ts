import { Command, Argument } from "discord-akairo";
import { Message, MessageEmbed, VoiceChannel } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("radio", {
  aliases: ["r"],
  description: {
    content: "Plays a radio station",
    usage: "[station]",
    examples: ["Kiss FM", "Kiss UK"],
  },
  args: [
    {
      id: "station",
      match: "rest",
      prompt: {
        start: "Please provide a station name",
      },
      type: Argument.compose("string", (_, str) =>
        str.replace(/<(.+)>/g, "$1")
      ),
    },

    {
      id: "type",
      type: (_, str) =>
        str
          ? ["youtube", "soundcloud"].includes(str.toLowerCase())
            ? str.toLowerCase()
            : null
          : null,
      match: "option",
      flag: ["-t ", "-type "],
      default: "youtube",
    },
  ],
  channel: "guild",
})
export default class RadioCommand extends Command {
  public async exec(message: Message, { station }: { station: string }) {
    const vclock: string = this.client.settings.get(message.guild, "vclock");

    let { channel } = message.member?.voice!;

    if (vclock)
      channel = message.guild?.channels.cache.get(vclock) as VoiceChannel;
    if ((vclock && !channel?.members.has(message.author.id)) || !channel)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            vclock
              ? `Please join \`${
                  message.guild!.channels.cache.get(vclock)!.name
                }\``
              : `Please join a voice channel.`
          )
      );

    if (
      !channel!.joinable ||
      !channel!.permissionsFor(this.client.user!)?.has(["SPEAK", "CONNECT"])
    )
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            vclock
              ? `Seems that the voice channel set for Voice Channel lock is inaccessable.`
              : `Please join a voice channel I can join.`
          )
      );

    let player = this.client.lavalink.players.get(message.guild!.id);
    if (player && player.channel !== channel!.id)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Please join my voice channel.`)
      );

    const radio = await this.client.apis.get("radio").radio(station);
    if (!radio || (Array.isArray(radio) && !radio.length))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Couldn't find anything for your query.`)
      );

    const { favicon, name, url_resolved, homepage } = radio[0];

    const { tracks, loadType, exception } = await this.client.lavalink.search(
      url_resolved
    );

    if (exception)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `There was an exception on the track:\n\n\`${exception.message}\``
          )
      );

    if (loadType !== "TRACK_LOADED")
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I couldn't get the station data, sorry!`)
      );

    if (!player) player = this.client.lavalink.create(message.guild!.id);

    const { track } = tracks[0];

    player.queue.add(message.author.id, track);

    message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setTitle(name)
        .setDescription(`[Stations Homepage](${homepage})`)
    );

    if (!player.connected) player.connect(channel!.id, { selfDeaf: true });

    if (!player.playing && !player.paused) await player.queue.start(message);

    if (!message.guild?.me?.voice.deaf) message.guild?.me?.voice.setDeaf(true);
  }

  public extension(attachment: string) {
    const typeOfImage = attachment.split(".")[attachment.split(".").length - 1];
    const image = /(jpe?g|png|gif)/gi.test(typeOfImage);

    return image ? attachment : undefined;
  }
}
