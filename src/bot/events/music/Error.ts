import { Listener } from "discord-akairo";
import { Socket } from "lavaclient";
import { Event } from "@core";

@Event("musicError", { emitter: "lavalink", event: "socketError" })
export default class ReadyEvent extends Listener {
  public exec({ id, host, port }: Socket, error: Error) {
    this.client.logger.error(
      `Socket ${id} has errored at ${host}:${port}\n\n${error}`
    );
  }
}
