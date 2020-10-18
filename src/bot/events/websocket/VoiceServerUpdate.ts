import { Listener } from "discord-akairo";
import { VoiceServer } from "lavaclient";
import { Event } from "@core";

@Event("voiceServerUpdate", {
  emitter: "websocket",
  event: "VOICE_SERVER_UPDATE",
})
export default class VoiceServerUpdateEvent extends Listener {
  public exec(packet: VoiceServer) {
    // when the region changes, we just reconnect the player.
    const player = this.client.lavalink.players.get(packet.guild_id);
    if (player && player.channel)
      player.connect(player.channel, { selfDeaf: true });

    this.client.lavalink.serverUpdate(packet);
  }
}
