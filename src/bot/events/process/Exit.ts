import { Listener } from "discord-akairo";
import { Event } from "@core";

@Event("processExit", { emitter: "process", event: "exit" })
export default class ExitEvent extends Listener {
  public exec(code: number) {
    this.client.lavalink.destroy([this.client.lavalink.players.keys()]);

    this.client.logger.debug(`Process exited with code ${code}`);
  }
}
