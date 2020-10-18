import { API, Api, querystring } from "@core";

@Api({ name: "vps", baseUrl: "https://node2.hostingbot.net:4083/index.php" })
export default class VPS extends API {
  public stats() {
    this.logger.warn(`VPS /stats API used.`);

    return this.get(
      `?${querystring({
        act: "vpsmanage",
        svs: config.get("apis.vps.svs"),
        api: "json",
        apikey: config.get("apis.vps.key"),
        apipass: config.get("apis.vps.password"),
      })}`
    );
  }
}
