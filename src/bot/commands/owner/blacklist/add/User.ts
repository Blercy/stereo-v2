import { Command } from "discord-akairo";
import { MessageEmbed, Message, User } from "discord.js";

import { Sub } from "@core";

@Sub("blacklist-add-user", [
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
      start: "Please provide a user to blacklist.",
      retry: "I don't think thats a valid user. Want to try again?",
    },
  },

  {
    id: "reason",
    match: "rest",
    default: "No reason provided.",
  },
])
export default class BlacklistCommand extends Command {
  public exec(
    message: Message,
    { user, reason }: { user: User; reason: string }
  ) {
    if (this.client.ownerID.includes(user.id))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Why are you trying to blacklist an owner?`)
      );

    if (user.bot)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Why are you trying to blacklist my fellow people?`)
      );

    const blacklist: any[] = this.client.settings.get(
      null,
      "blacklist.users",
      []
    );
    if (blacklist.some((usr) => usr.id === user.id))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`\`${user.tag}\` is already blacklisted.`)
      );

    blacklist.push({
      id: user.id,
      reason,
      date: Date.now(),
    });

    this.client.settings.set(null, "blacklist.users", blacklist);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Blacklisted \`${user.tag}\` successfully.`)
    );
  }
}
