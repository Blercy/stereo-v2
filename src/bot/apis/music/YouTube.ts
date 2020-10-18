import { API, Api, querystring } from "@core";

@Api({ name: "youtube", baseUrl: "https://www.googleapis.com/youtube/v3" })
export default class YouTube extends API {
  public video(q: string) {
    return this.get(
      `/search?${querystring({
        q,
        maxResults: 1,
        part: "snippet",
        key: config.get("apis.youtube"),
      })}`
    );
  }
}
