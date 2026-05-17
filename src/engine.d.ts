export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  nulltoremove?: boolean;
  autojson?: boolean;
  autoencode?: boolean;
  encode?: (val: string) => string;
  decode?: (val: string) => string;
  fallback?: false | ((key: string, opt: CookieOptions) => unknown);
  test?: (res: string) => void;
}

export interface CookieEngine extends CookieOptions {
  (key: string): unknown;
  (data: Record<string, unknown>, opt?: CookieOptions): CookieEngine;
  [key: string]: unknown;
}

declare const engine: CookieEngine;
export default engine;
