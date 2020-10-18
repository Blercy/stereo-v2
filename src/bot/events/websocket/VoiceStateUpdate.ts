import { Listener } from "discord-akairo";
import { VoiceState } from "lavaclient";
import { Event } from "@core";

@Event("voiceStateUpdate", {
  emitter: "websocket",
  event: "VOICE_STATE_UPDATE",
})
export default class VoiceStateUpdateEvent extends Listener {
  public exec(packet: VoiceState) {
    const player = this.client.lavalink.players.get(packet.guild_id);

    // check if the bot has been disconnected from the vc
    if (!packet.channel_id && packet.user_id === this.client.user!.id) {
      if ("queue"! in player!) this.client.lavalink.destroy(player!.guild);

      player?.queue._finish("disconnected");
    }

    this.client.lavalink.stateUpdate(packet);
  }
}
