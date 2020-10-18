import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("ping", {
  aliases: ["latency"],
  description: {
    content: "Displays the client latency",
  },
})
export default class PingCommmand extends Command {
  public async exec(message: Message) {
    let date = Date.now();

    return new Promise((res) => {
      (this.client["api"] as any).channels[message.channel.id].typing
        .post()
        .then(() => {
          res(
            message.util!.send(
              new MessageEmbed()
                .setColor("#7289DA")
                .setDescription([
                  `📡 **Roundtrip**: ${Date.now() - date}ms`,
                  `💓 **Heartbeat**: ${this.client.ws.ping}ms`,
                ])
            )
          );
        });
    });
  }
}
