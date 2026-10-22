import messages from "@/data/locales/uk.json";

type Messages = typeof messages;

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never;

type Paths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string
        ? K
        : T[K] extends Record<string, unknown>
          ? K | Join<K, Paths<T[K]>>
          : K;
    }[keyof T & string];

type Leaves<T> = T extends string
  ? never
  : { [K in keyof T & string]: T[K] extends string ? K : Join<K, Leaves<T[K]>> }[keyof T & string];

export type MessageKey = Leaves<Messages>;
export type MessageNamespace = Exclude<Paths<Messages>, MessageKey>;

type Params = Record<string, string | number>;

const pluralRules = new Intl.PluralRules("uk-UA");

function lookup(key: string): unknown {
  return key
    .split(".")
    .reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], messages);
}

function interpolate(template: string, params?: Params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export function t(key: MessageKey, params?: Params): string {
  const value = lookup(key);
  return typeof value === "string" ? interpolate(value, params) : key;
}

export function tPlural(key: MessageNamespace, count: number, params?: Params): string {
  const forms = lookup(key) as Record<string, string> | undefined;
  const template = forms?.[pluralRules.select(count)] ?? forms?.other ?? key;
  return interpolate(template, { count, ...params });
}
