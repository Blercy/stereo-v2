import { API, Api, querystring } from "@core";

@Api({ name: "itunes", baseUrl: "https://itunes.apple.com" })
export default class iTunes extends API {
  public song(term: string, explicit = false) {
    return this.get(
      `/search?${querystring({
        term,
        media: "music",
        entity: "song",
        limit: 1,
        explicit,
      })}`
    );
  }

  public album(term: string, explicit = false) {
    return this.get(
      `/search?${querystring({
        term,
        media: "music",
        entity: "album",
        limit: 1,
        explicit,
      })}`
    );
  }
}
