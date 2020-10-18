import { Listener } from "discord-akairo";
import { MessageEmbed, TextChannel, Guild } from "discord.js";
import { Event } from "@core";

@Event("guildAdd", { emitter: "client", event: "guildCreate" })
export default class GuildAddEvent extends Listener {
  public exec(guild: Guild) {
    const channel = this.client.channels.cache.get(
      config.get("channels.guild") as string
    ) as TextChannel;
    if (!channel) return;

    channel.send(
      new MessageEmbed()
        .setColor("#42f590")
        .setThumbnail(guild.iconURL({ dynamic: true })!)
        .setDescription([
          `${guild.name.shorten(45)} (\`${guild.id}\`).`,
          `\n\nWe are now in **${this.client.guilds.cache.size}** guilds`,
        ])
        .setFooter(`New Guild`)
        .setTimestamp(Date.now())
    );
  }
}
