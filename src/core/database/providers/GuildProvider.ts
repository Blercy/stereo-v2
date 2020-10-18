import { get, set, delete as del } from "dot-prop";
import { Guild, Collection } from "discord.js";
import { Settings } from "../models";

interface iSettings {
  prefix: {
    prefixes: string[];
    mention: boolean;
  };
  dj: string | null;
}

const defaults: iSettings = {
  prefix: {
    prefixes: ["sc!", "stereoc "],
    mention: true,
  },
  dj: null,
};

export class GuildProvider {
  public items = new Collection<string, any>();

  public async init() {
    for (const { id, data } of await Settings.all())
      this.items.set(id, JSON.parse(data));
  }

  public get<T>(
    guild: string | null | Guild,
    path: string,
    defaultValue?: any
  ): T {
    const item = this.items.get(GuildProvider.id(guild)) ?? defaults;

    return get<T>(item, path) ?? defaultValue;
  }

  public raw(guild: string | null | Guild) {
    return this.items.get(GuildProvider.id(guild)) ?? defaults;
  }

  public async set(guild: string | null | Guild, path: string, value: any) {
    const item =
      this.items.get(GuildProvider.id(guild)) ?? (await this.ensure(guild));

    set(item, path, value);
    this.items.set(GuildProvider.id(guild), item);

    const server = await Settings.find({ id: GuildProvider.id(guild) });
    server.data = JSON.stringify(item);

    return await server.save();
  }

  public async delete(guild: string | null | Guild, path: string) {
    const item =
      this.items.get(GuildProvider.id(guild)) ?? (await this.ensure(guild));

    del(item, path);
    this.items.set(GuildProvider.id(guild), item);

    const server = await Settings.find({ id: GuildProvider.id(guild) });
    server.data = JSON.stringify(item);

    return await server.save();
  }

  public async clear(guild: string | null | Guild) {
    const item = this.items.get(GuildProvider.id(guild));
    if (!item) return;

    this.items.delete(GuildProvider.id(guild));

    const server = await Settings.find({ id: GuildProvider.id(guild) });
    return await server.delete();
  }

  private async ensure(guild: string | null | Guild) {
    let item = this.items.get(GuildProvider.id(guild));

    if (!item) {
      const server = new Settings();
      server.id = GuildProvider.id(guild);
      server.data = JSON.stringify(defaults);

      await server.save();

      this.items.set(GuildProvider.id(guild), defaults);

      item = defaults;
    }

    return item;
  }

  private static id(guild: string | null | Guild) {
    if (guild instanceof Guild) return guild.id;
    if (guild === "global" || guild === null) return "0";
    if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;

    throw new TypeError(
      'Guild instance is undefined. Valid instances: guildID, "global" or null.'
    );
  }
}
