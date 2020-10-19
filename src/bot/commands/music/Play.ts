import { Command, Argument } from "discord-akairo";
import { Message, MessageEmbed, VoiceChannel } from "discord.js";

import { PublicCommand } from "@core";
import { parse } from "url";

@PublicCommand("play", {
  aliases: ["p"],
  description: {
    content: "Plays music in your voice channel",
    usage: "[song] [?type]",
    examples: [
      "login - behind",
      "https://youtube.com/some_url",
      "https://open.spotify.com/album/5UHC2JN3ck4XPYPjngia2G",
      "spotify:album:5UHC2JN3ck4XPYPjngia2G",
      "https://open.spotify.com/track/2alc8VZAzDgdAsL2QMk3hu",
      "spotify:track:2alc8VZAzDgdAsL2QMk3hu",
      "Used To - Josh A -type soundcloud",
    ],
  },
  args: [
    {
      id: "song",
      match: "rest",
      prompt: {
        start: "Please provide a song name or url",
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
export default class PlayCommand extends Command {
  public async exec(
    message: Message,
    { song, type }: { song: string; type: string }
  ) {
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

    // all of this hurts my fucking soul because its so shit and i know it
    const data = await this.parseSpotify(song);
    if (data) {
      if ("error" in data) {
        if (!player || !player.queue || !player.queue.current)
          await this.client.lavalink.destroy(message.guild!.id);

        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `Couldn't fetch spotify track:\n\n\`${data.error.message}\``
            )
        );
      }

      let successful = 0;

      if (Array.isArray(data)) {
        if (!player) player = this.client.lavalink.create(message.guild!.id);

        for (const { name } of data) {
          const track = await this.client.lavalink.search(
            `ytsearch:${encodeURIComponent(name)}`
          );

          player.queue.add(message.author.id, track.tracks[0].track);
          successful += 1;
        }

        message.util?.send(
          new MessageEmbed()
            .setColor("#42f57e")
            .setThumbnail(data[0].data.image)
            .setTitle(data[0].data.name)
            .setDescription([
              `[${data[0].data.name}](${data[0].data.url})`,
              `Loaded Spotify Tracks. (${successful}/${data.length})`,
            ])
        );

        if (!player.connected) player.connect(channel!.id, { selfDeaf: true });
        if (!player.playing && !player.paused)
          await player.queue.start(message);

        return;
      }

      const track = await this.client.lavalink.search(
        `ytsearch:${encodeURIComponent(data.name)}`
      );
      if (["NO_MATCHES", "LOAD_FAILED"].includes(track.loadType)) {
        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(`Could not successfully get spotify track.`)
        );
      }

      if (!player) player = this.client.lavalink.create(message.guild!.id);

      player.queue.add(message.author.id, track.tracks[0].track);

      message.util?.send(
        new MessageEmbed()
          .setColor("#42f57e")
          .setThumbnail(data.data.image)
          .setTitle(data.data.artists)
          .setDescription(`[${data.data.name}](${data.data.url})`)
      );

      if (!player.connected) player.connect(channel!.id, { selfDeaf: true });
      if (!player.playing && !player.paused) await player.queue.start(message);

      return;
    }

    const {
      tracks,
      playlistInfo,
      exception,
      loadType,
    } = await this.client.lavalink.search(
      ["http:", "https:"].includes(parse(song).protocol!)
        ? song
        : `${type === "youtube" ? "yt" : "sc"}search:${encodeURIComponent(
            song
          )}`
    );

    if (exception)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `There was an exception on the track:\n\n\`${exception.message}\``
          )
      );

    if (["NO_MATCHES", "LOAD_FAILED"].includes(loadType))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I couldn't find anything for your query. Try again?`)
      );

    if (!player) player = this.client.lavalink.create(message.guild!.id);

    switch (loadType) {
      case "TRACK_LOADED":
        player.queue.add(message.author.id, tracks[0].track);

        message.util?.send(
          new MessageEmbed()
            .setColor("#7289DA")
            .setTitle(tracks[0].info.author)
            .setDescription(
              `\n[${tracks[0].info.title.shorten()}](${tracks[0].info.uri})`
            )
            .setThumbnail(
              `https://i.ytimg.com/vi/${tracks[0].info.identifier}/maxresdefault.jpg`
            )
            .setFooter(`Enqueued Track`)
        );

        if (!player.connected) player.connect(channel!.id, { selfDeaf: true });
        if (!player.playing && !player.paused)
          await player.queue.start(message);

        if (!message.guild?.me?.voice.deaf)
          message.guild?.me?.voice.setDeaf(true);

        break;

      case "SEARCH_RESULT":
        const selected = tracks.slice(0, 10);

        const msg = await message.channel.send(
          new MessageEmbed()
            .setColor("#7289DA")
            .setDescription(
              selected
                .map(
                  (track, index) =>
                    `\`${Number(index + 1)
                      .toString()
                      .padStart(2, "0")}\` | [${track.info.title.shorten()}](${
                      track.info.uri
                    })`
                )
                .join("\n")
            )
            .setFooter(`Chooise between 1-${selected.length}`)
        );

        const filter = (m: Message) => m.author.id === message.author.id;

        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 3e4,
            errors: ["time"],
          })
          .then(async (data) => {
            const first = data.first();

            const MATCH_REGEX = new RegExp(
              selected.length === 10 ? `[1-9]|10` : `[1-${selected.length}]`,
              "i"
            );

            if (first?.content.toLowerCase() === "cancel") {
              await msg.delete();

              if (!player?.queue.current)
                this.client.lavalink.destroy(message.guild!.id);

              return message.channel.send(
                new MessageEmbed()
                  .setColor("#f55e53")
                  .setDescription(`Okay, I've cancelled the song selection.`)
              );
            }

            if (
              !this.handler.resolver.type("number")(message, first!.content) ||
              !MATCH_REGEX.test(first!.content)
            ) {
              await msg.delete();

              if (!player?.queue.current)
                this.client.lavalink.destroy(message.guild!.id);

              return message.channel.send(
                new MessageEmbed()
                  .setColor("#f55e53")
                  .setDescription(
                    `Invalid number, I'll cancel the song selection now.`
                  )
              );
            }

            const song = selected[Number(first!.content) - 1];

            player?.queue.add(message.author.id, song.track);

            await msg.delete();

            message.util?.send(
              new MessageEmbed()
                .setColor("#7289DA")
                .setTitle(song.info.author)
                .setDescription(
                  `\n[${song.info.title.shorten()}](${song.info.uri})`
                )
                .setThumbnail(
                  `https://i.ytimg.com/vi/${song.info.identifier}/maxresdefault.jpg`
                )
                .setFooter(`Enqueued Track`)
            );

            if (!player?.connected)
              player?.connect(channel!.id, { selfDeaf: true });
            if (!player?.playing && !player?.paused)
              await player?.queue.start(message);

            if (!message.guild?.me?.voice.deaf)
              message.guild?.me?.voice.setDeaf(true);
          })
          .catch(() => {
            return message.channel.send(
              new MessageEmbed()
                .setColor("#f55e53")
                .setDescription(
                  `I've cancelled the song selection due to inactivity.`
                )
            );
          });

        break;

      case "PLAYLIST_LOADED":
        player.queue.add(
          message.author.id,
          ...tracks.map((song) => song.track)
        );

        message.util?.send(
          new MessageEmbed()
            .setColor("#7289DA")
            .setDescription(`\n${playlistInfo?.name.shorten()}`)
            .setThumbnail(
              `https://i.ytimg.com/vi/${tracks[0].info.identifier}/maxresdefault.jpg`
            )
            .setFooter(`Enqueued Playlist (${tracks.length})`)
        );

        if (!player.connected) player.connect(channel!.id, { selfDeaf: true });
        if (!player.playing && !player.paused)
          await player.queue.start(message);

        if (!message.guild?.me?.voice.deaf)
          message.guild?.me?.voice.setDeaf(true);

        break;
    }
  }

  // now this needs to be improved like oh my god it looks like shit
  public async parseSpotify(url: string) {
    if (url.match(/spotify:(track|album):([a-z\d-_]+)$/i)) {
      const [, type, id]: any = /spotify:(track|album):([a-z\d-_]+)$/i.exec(
        url
      );

      const data = await this.client.apis
        .get("spotify")
        [type.toLowerCase()](id);

      if (data.error) return data;

      if ("tracks" in data)
        return data.tracks.items.map((track: any) => ({
          name: `Topic ${data.artists[0].name} - ${track.name}`,
          data: {
            image: data.images[0].url,
            url: data.external_urls.spotify,
            name: data.name,
            artists: data.artists
              .map((key: any) => key.name)
              .join(", ")
              .shorten(100),
          },
        }));

      return {
        name: `Topic ${data.artists[0].name} - ${data.name}`,
        data: {
          image: data.album.images[0].url,
          url: data.external_urls.spotify,
          name: data.name,
          artists: data.artists
            .map((key: any) => key.name)
            .join(", ")
            .shorten(100),
        },
      };
    }

    if (
      url.match(
        /^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com\/(track|album)\/([a-z\d-_]+)/i
      )
    ) {
      const [
        ,
        type,
        id,
      ]: any = /^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com\/(track|album)\/([a-z\d-_]+)/i.exec(
        url
      );

      const data = await this.client.apis
        .get("spotify")
        [type.toLowerCase()](id);

      if (data.error) return data;

      if ("tracks" in data)
        return data.tracks.items.map((track: any) => ({
          id,
          name: `Topic ${data.artists[0].name} - ${track.name}`,
          data: {
            image: data.images[0].url,
            url: data.external_urls.spotify,
            name: data.name,
            artists: data.artists
              .map((key: any) => key.name)
              .join(", ")
              .shorten(100),
          },
        }));

      return {
        name: `Topic ${data.artists[0].name} - ${data.name}`,
        data: {
          image: data.album.images[0].url,
          url: data.external_urls.spotify,
          name: data.name,
          artists: data.artists
            .map((key: any) => key.name)
            .join(", ")
            .shorten(100),
        },
      };
    }

    return;
  }
}
