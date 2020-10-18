import { Command } from "discord-akairo";
import { MessageEmbed, Message, User } from "discord.js";

import { Sub } from "@core";

@Sub("blacklist-delete-user", [
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
      start: "Please provide a user to remove from the blacklist.",
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
    if (!blacklist.some((usr) => usr.id === user.id))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`\`${user.tag}\` isn't even blacklisted.`)
      );

    blacklist.splice(blacklist.findIndex((usr) => usr.id === user.id));

    this.client.settings.set(null, "blacklist.users", blacklist);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Unblacklisted \`${user.tag}\` successfully.`)
    );
  }
}
