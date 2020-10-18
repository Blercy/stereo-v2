import { Listener } from "discord-akairo";
import { MessageEmbed, TextChannel } from "discord.js";
import { addBreadcrumb, captureException, Severity } from "@sentry/node";
import { Event } from "@core";

@Event("clientError", { emitter: "client", event: "error" })
export default class ErrorEvent extends Listener {
  public async exec(error: Error) {
    this.client.logger.error(error);

    const channel = this.client.channels.cache.get(
      config.get("channels.errors") as string
    );
    if (!channel || channel.type !== "text") return;

    addBreadcrumb({
      message: "Client Error",
      category: "errors",
      level: Severity.Error,
    });
    captureException(error);

    const webhook = await (channel as TextChannel).createWebhook(
      "Stereo Errors",
      { avatar: this.client.user?.displayAvatarURL() }
    );

    webhook
      .send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription([
            `Yikes, we ran into an unexpected client error.`,
            `\`\`\`js\n${error.toString().substring(0, 1900)}\`\`\``,
          ])
      )
      .then(() => webhook.delete());
  }
}
