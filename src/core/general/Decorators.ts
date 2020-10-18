import {
  Command,
  CommandOptions,
  Listener,
  ListenerOptions,
  ArgumentGenerator,
  ArgumentOptions,
  Inhibitor,
  InhibitorOptions,
} from "discord-akairo";
import { API, APIOptions } from "../apis";

/* Module Related */

// Credit to https://github.com/MeLike2D for help on these decorators
export const PublicCommand = (id: string, options: CommandOptions = {}) => {
  options.aliases = options.aliases ?? [];
  options.aliases.unshift(id);

  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

// Credit to https://github.com/MeLike2D for help on these decorators
export const OwnerCommand = (id: string, options: CommandOptions = {}) => {
  options.ownerOnly = true;
  options.aliases = options.aliases ?? [];
  options.aliases.unshift(id);

  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

// Credit to https://github.com/MeLike2D for help on these decorators
export const SettingsCommand = (id: string, options: CommandOptions = {}) => {
  options.channel = "guild";
  options.cooldown = 2500;

  options.aliases = options.aliases ?? [];
  options.aliases.unshift(id);

  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

// Credit to https://github.com/MeLike2D for help on these decorators
// tier 3 sub haha funni
export const Sub = (
  id: string,
  arg?: ArgumentGenerator | ArgumentOptions[]
) => {
  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, {
          category: "flag",
          args: arg,
        });
        void args;
      }
    };
  };
};

// Credit to https://github.com/MeLike2D for help on these decorators
export const Event = (id: string, options?: ListenerOptions) => {
  return <T extends new (...args: any[]) => Listener>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

// Credit to https://github.com/MeLike2D for help on these decorators
export const Activator = (id: string, options: InhibitorOptions = {}) => {
  options.reason = options.reason ?? id;

  return <T extends new (...args: any[]) => Inhibitor>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

export const Api = (options: APIOptions = {}) => {
  return <T extends new (...args: any[]) => API>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(options);
        void args;
      }
    };
  };
};

/* Database Related */
interface ColumnOptions {
  primary?: boolean;
  defaults?: any;
  nullable?: boolean;
}

export const Column = (options: ColumnOptions = {}) => {
  options.primary = options.primary ?? false;
  options.nullable = options.nullable ?? true;

  return (target: any, name: any) => {
    target.constructor.columns =
      target.constructor.columns ?? new Map<string, any>();

    target.constructor.columns.set(name, options);
  };
};
