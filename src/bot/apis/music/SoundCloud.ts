import { API, Api, querystring } from "@core";

@Api({ name: "soundcloud", baseUrl: "https://api-v2.soundcloud.com" })
export default class SoundCloud extends API {
  public track(q: string) {
    return this.get(
      `/search/tracks?${querystring({
        q,
        client_id: config.get("apis.soundcloud"),
      })}`
    );
  }
}
