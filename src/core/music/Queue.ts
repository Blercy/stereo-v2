import { AkairoClient } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { decode } from "@lavalink/encoding";
import { Player } from "lavaclient";

interface Track {
  requester: string;
  song: string;
}

interface Filters {
  type: string;
  filters: Record<string, any>;
}

export class Queue {
  private message!: Message;

  public tracks: Track[] = [];
  public current!: Track;

  public loop = "none";
  public bass = 0;
  public filter: Filters = {
    type: "none",
    filters: {},
  };

  public constructor(public player: Player) {
    player
      .on("end", async (evt) => {
        if (evt && ["REPLACED"].includes(evt.reason)) return;

        switch (this.loop) {
          case "song":
            this.tracks.unshift(this.current);
            break;

          case "queue":
            this.tracks.unshift(this.current);
            break;
        }

        this.next();

        if (!this.current) return this._finish("empty");

        if (!this.message.client.guilds.cache.get(this.message.guild!.id))
          return this._finish("guildLeft");

        const { channel } = this.message.guild?.me?.voice!;

        if (channel && channel.members.size === 1) return this._finish("alone");

        await player.play(this.current.song);
      })
      .on("start", async ({ track }) => {
        if (
          !(this.message.client as AkairoClient).settings.get(
            this.message.guild,
            "announceNext",
            true
          )
        )
          return;

        const { title, author, identifier, uri } = decode(track);

        const user = await this.message.client.users.fetch(
          this.current.requester
        );

        this.message.util?.sendNew(
          new MessageEmbed()
            .setColor("#7289DA")
            .setThumbnail(`https://i.ytimg.com/vi/${identifier}/hqdefault.jpg`)
            .setTitle(author ?? "Unknown Artist")
            .setDescription([`[${title.shorten()}](${uri})`])
            .setFooter(`Requester ${user ? user.tag : `Unknown Requester`}`)
        );
      });
  }

  public _finish(
    reason: "empty" | "alone" | "guildLeft" | "disconnected" | "aloneWithBots"
  ) {
    switch (reason) {
      case "empty":
        this.message.util
          ?.sendNew(
            new MessageEmbed()
              .setColor("#f55e53")
              .setDescription(
                `The queue has finished! To resume the queue, play a new song in the next **20s**.`
              )
          )
          .then((msg) => {
            setTimeout(async () => {
              if (!msg) return this.disconnect();
              await msg.delete();

              if (!this.current) {
                this.disconnect();

                return this.message.util?.sendNew(
                  new MessageEmbed()
                    .setColor("#f55e53")
                    .setDescription(`Okay, I've left your voice channel now.`)
                );
              }
            }, 20000);
          });
        break;

      case "alone":
        this.message.util
          ?.sendNew(
            new MessageEmbed()
              .setColor("#f55e53")
              .setDescription(
                `It seems that I've been left alone. If someone joins within **20s** and plays a song, I won't leave.`
              )
          )
          .then((msg) => {
            setTimeout(async () => {
              if (!msg) return this.disconnect();
              await msg.delete();

              if (!this.current) {
                this.disconnect();

                return this.message.util?.sendNew(
                  new MessageEmbed()
                    .setColor("#f55e53")
                    .setDescription(`Okay, I've left your voice channel now.`)
                );
              }
            }, 20000);
          });
        break;

      case "guildLeft":
        this.disconnect();
        break;

      case "disconnected":
        this.message.util?.sendNew(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `I have been disconnected from the voice channel. I will be clearing the queue now.`
            )
        );

        this.disconnect();
        break;

      case "aloneWithBots":
        this.message.util?.sendNew(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `I've been left alone in a voice channel with a bunch of bots, so I'll be clearing the queue now.`
            )
        );

        this.disconnect();
        break;
    }
  }

  public disconnect() {
    (this.message.client as AkairoClient).lavalink.destroy(
      this.message.guild!.id
    );
  }

  public next() {
    //@ts-expect-error
    return (this.current = this.tracks.shift());
  }

  public add(requester: string, ...tracks: string[]) {
    for (const track of tracks)
      this.tracks.push({
        song: track,
        requester,
      });

    return this.tracks;
  }

  public async start(message: Message) {
    this.message = message;
    if (!this.current) this.next();
    return await this.player.play(this.current.song);
  }
}
