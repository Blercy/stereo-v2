import { API, Api, querystring } from "@core";

@Api({
  name: "dbl",
  baseUrl: "https://top.gg/api",
  headers: { authorization: config.get("apis.dbl") },
})
export default class DBL extends API {
  public voted(id: string) {
    const { voted } = this.get(
      `/bots/725808086933176410/check?${querystring({ userId: id })}`
    );

    return voted === 0 ? true : false;
  }

  public async voters() {
    return [
      ...new Set(
        (await this.get(`/bots/725808086933176410/votes`)).map(
          (data: any) => data.id
        )
      ),
    ];
  }

  public async postStats(
    servers: number,
    guildsInShards: number[],
    shard: number,
    shards: number
  ) {
    return this.post(`/bots/725808086933176410/stats`, {
      server_count: servers,
      shards: guildsInShards,
      shard_id: shard,
      shard_count: shards,
    });
  }
}
