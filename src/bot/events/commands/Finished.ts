import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";
import { Event } from "@core";

@Event("finished", { emitter: "commands", event: "commandFinished" })
export default class FinishedEvent extends Listener {
  public exec(message: Message, command: Command) {
    this.client.logger.info(
      `Command ${command.id} was ran by ${message.author.tag} (${message.author.id}).`
    );
  }
}
