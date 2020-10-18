import { Listener } from "discord-akairo";
import { Socket } from "lavaclient";
import { Event } from "@core";

@Event("musicReady", { emitter: "lavalink", event: "socketReady" })
export default class ReadyEvent extends Listener {
  public exec({ id, host, port }: Socket) {
    if (this.client.shard!.ids[0] === 0)
      this.client.logger.info(`Socket ${id} is ready at ${host}:${port}`);
  }
}
