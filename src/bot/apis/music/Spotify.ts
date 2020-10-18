import { API, Api, querystring } from "@core";
import fetch from "node-fetch";

@Api({ name: "spotify", baseUrl: "https://api.spotify.com" })
export default class Spotify extends API {
  public authorization: any;

  public async track(id: string) {
    return this.get(`/v1/tracks/${id}`);
  }

  public async album(id: string) {
    return this.get(`/v1/albums/${id}`);
  }

  public async search(q: string) {
    return this.get(
      `/v1/search?${querystring({ q: encodeURIComponent(q), type: "track," })}`
    );
  }

  public async init() {
    if (!this.authorization) {
      this.authorization = await this.auth();

      this.options.headers = {
        authorization: `${this.authorization.tokenType} ${this.authorization.accessToken}`,
        "Content-Type": "application/json",
        "User-Agent": "Stereo Discord Bot (NodeJS, v3.0.0)",
      };
    }

    if (Date.now() >= this.authorization.expiresAt) {
      this.authorization = await this.auth();

      this.options.headers = {
        authorization: `${this.authorization.tokenType} ${this.authorization.accessToken}`,
        "Content-Type": "application/json",
        "User-Agent": "Stereo Discord Bot (NodeJS, v3.0.0)",
      };
    } else return;

    setInterval(() => this.auth(), 20000);
  }

  private auth() {
    return fetch(
      `https://accounts.spotify.com/api/token?grant_type=client_credentials`,
      {
        method: "POST",
        headers: {
          authorization: `Basic ${Buffer.from(
            `${config.get("apis.spotify.id")}:${config.get(
              "apis.spotify.secret"
            )}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((r) => r.json())
      .then((data) => {
        const { access_token, expires_in, token_type } = data;

        return {
          accessToken: access_token,
          expiresIn: expires_in,
          tokenType: token_type,
          expiresAt: new Date(
            new Date().getTime() + (expires_in - 2000) * 1000
          ),
        };
      });
  }
}
