type StringifyOptions = {
  cmp?: (a: { key: string; value: unknown }, b: { key: string; value: unknown }) => number;
  cycles?: boolean;
  replacer?: (key: string, value: unknown) => unknown;
  space?: string | number;
};

declare function stringify(value: unknown, opts?: StringifyOptions): string;
export default stringify;
