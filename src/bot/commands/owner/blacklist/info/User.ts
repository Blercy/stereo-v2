import { Command } from "discord-akairo";
import { MessageEmbed, Message, User } from "discord.js";

import { Sub } from "@core";
import ms from "ms";

@Sub("blacklist-view-user", [
  {
    id: "user",
    type: async (msg, str) => {
      if (!str) return;

      return (
        (msg.mentions.users.last() ||
          (await msg.client.users.fetch(str)) ||
          msg.client.users.cache.find(
            (user) =>
              user.username.toLowerCase().includes(str.toLowerCase()) ||
              user.tag.toLowerCase().includes(str.toLowerCase())
          )) ??
        null
      );
    },
    prompt: {
      start: "Please provide a user to view information on.",
      retry: "I don't think thats a valid user. Want to try again?",
    },
  },
])
export default class BlacklistCommand extends Command {
  public exec(message: Message, { user }: { user: User }) {
    const blacklist: any[] = this.client.settings.get(
      null,
      "blacklist.users",
      []
    );
    const found = blacklist.find((usr) => usr.id === user.id);
    if (!found)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `I dunno what you're thinking, but that user isn't blacklisted.`
          )
      );

    return message.util?.send(
      new MessageEmbed()
        .setAuthor(
          `Blacklist information: ${user.username}`,
          user.displayAvatarURL({ dynamic: true })
        )
        .setColor("#7289DA")
        .setDescription(found.reason)
        .addField(`› User`, [user.toString(), `(\`${user.id}\`)`], true)
        .addField(
          `› Date`,
          `${new Date(found.date).toLocaleString()} (${ms(
            Date.now() - found.date
          )} ago)`,
          true
        )
    );
  }
}
