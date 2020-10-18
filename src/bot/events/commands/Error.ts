import { Listener, Command } from "discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { addBreadcrumb, captureException, Severity } from "@sentry/node";
import { Event } from "@core";

@Event("commandError", { emitter: "commands", event: "error" })
export default class ErrorEvent extends Listener {
  public async exec(error: Error, message: Message, command?: Command) {
    this.client.logger.error(error);

    const channel = this.client.channels.cache.get(
      config.get("channels.errors") as string
    );
    if (!channel || channel.type !== "text") return;

    addBreadcrumb({
      message: "Command Error",
      category: "errors",
      level: Severity.Error,
      data: {
        command: {
          id: command ? command.id : "Unknown",
          raw: message.content,
        },
      },
    });
    captureException(error);

    message.channel.send(
      new MessageEmbed()
        .setColor("#f55e53")
        .setDescription(
          `Something went wrong. Please report this to ${
            (await this.client.users.fetch("535585397435006987")).tag
          } or join [make an issue](https://github.com/Stereo-Developers/issues/issues)\`\`\`js\n${error}\`\`\``
        )
    );

    const webhook = await (channel as TextChannel).createWebhook(
      "Stereo Errors",
      { avatar: this.client.user?.displayAvatarURL() }
    );

    webhook
      .send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription([
            `Yikes, we ran into an unexpected command error.`,
            `\n**Command**: ${command ? command.id : "Unknown"}`,
            `\`\`\`js\n${error.toString().substring(0, 1900)}\`\`\``,
          ])
      )
      .then(() => webhook.delete());
  }
}
