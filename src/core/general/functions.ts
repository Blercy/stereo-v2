import { Message, MessageEmbed } from "discord.js";
import { AkairoClient } from "discord-akairo";

export const paginate = (arr: any[], itemsPerPage = 10, page = 1) => {
  const max = Math.ceil(arr.length / itemsPerPage);
  if (page > max || page < 1) page = 1;

  return {
    page,
    max,
    items: arr.slice((page - 1) * itemsPerPage, page * itemsPerPage),
  };
};

export function querystring(query: Record<string, any>, sep = "&", eq = "=") {
  return Object.keys(query)
    .map(
      (key) =>
        `${encodeURI(key)}${eq}${
          Array.isArray(query[key])
            ? (query[key] as string[]).join(sep)
            : query[key]
        }`
    )
    .join(sep);
}

export const prompt = async (message: Message, content: string) => {
  return new Promise(async (res, rej) => {
    try {
      const responses = ["yes", "no"];
      const msg = await message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription([
            content,
            `\nRespond with ${responses
              .map((key) => `\`${key}\``)
              .join(", ")} to confirm/deny.`,
          ])
      );

      const filter = (m: Message) => m.author.id === message.author.id;

      message.channel
        .awaitMessages(filter, { max: 1, errors: ["time"], time: 15e3 })
        .then((collected) => {
          const first = collected.first();

          if (!responses.includes(first!.content.toLowerCase()))
            return rej(false);

          return res(first!.content.toLowerCase() === responses[0]);
        })
        .catch(() => {
          return rej(false);
        });
    } catch (error) {
      (message.client as AkairoClient).logger.error(error);
      return rej(error);
    }
  });
};

export const ms = (time: number) => {
  const calculations = {
    week: Math.floor(time / (1000 * 60 * 60 * 24 * 7)),
    day: Math.floor(time / (1000 * 60 * 60 * 24)),
    hour: Math.floor((time / (1000 * 60 * 60)) % 24),
    minute: Math.floor((time / (1000 * 60)) % 60),
    second: Math.floor((time / 1000) % 60),
  };

  let arr = [];

  for (const [key, val] of Object.entries(calculations)) {
    if (val > 0) arr.push(`${val} ${key}${val > 1 ? "s" : ""}`);
  }

  return `*${arr.join(" ")}*`;
};

export const formatSize = (bytes: number) => {
  const kilo = bytes / 1024;
  const mega = kilo / 1024;
  const giga = mega / 1024;

  if (kilo < 1024) return `${kilo.toFixed(1)}KB`;
  else if (kilo > 1024 && mega < 1024) return `${mega.toFixed(1)}MB`;
  else return `${giga.toFixed(1)}GB`;
};

export const cuuid = () => {
  const str = (
    Date.now().toString(16) +
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2)
  ).slice(0, 32);

  return (
    str.slice(0, 8) +
    "-" +
    str.slice(8, 12) +
    "-" +
    str.slice(12, 16) +
    "-" +
    str.slice(16, 20) +
    "-" +
    str.slice(20)
  );
};

export function trimArray(arr: any[], size = 10) {
  if (arr.length > size) {
    let length = arr.length - size;
    arr = arr.slice(0, size);
    arr.push(`and ${length} more...`);
  }

  return arr;
}
