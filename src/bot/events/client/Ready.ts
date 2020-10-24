import { Listener } from "discord-akairo";
import { Event } from "@core";

@Event("clientReady", { emitter: "client", event: "ready" })
export default class ReadyEvent extends Listener {
  public exec() {
    this.client.lavalink.init(this.client.user?.id);

    if (this.client.shard!.ids[0] === 0)
      this.client.logger.info(
        `Logged into ${this.client.user?.tag} successfuly.`
      );

    for (const shard of this.client.shard!.ids)
      this.client.user!.setPresence({
        shardID: shard,
        status: "dnd",
        activity: {
          name: `s!help | Shard ${shard}/${this.client.shard!.count}`,
          type: "LISTENING",
        },
      });
  }
}
