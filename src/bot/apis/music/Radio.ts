import { API, Api } from "@core";

@Api({ name: "radio", baseUrl: "https://de1.api.radio-browser.info" })
export default class RadioCommand extends API {
  public radio(name: string) {
    return this.get(`/json/stations/byname/${encodeURIComponent(name)}`);
  }
}
