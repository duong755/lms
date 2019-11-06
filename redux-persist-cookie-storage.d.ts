type Callback = (...result: any[]) => any;
type Options = {
  keyPrefix: string | undefined,
  indexKey: string | undefined,
  expiration: any,
  setCookieOptions: any
};

declare module 'redux-persist-cookie-storage' {
  export class CookieStorage {
    cookies: any;
    expiration: object;
    indexKey: string;
    keyPrefix: string;
    setCookieOptions: any;
    expiration: any;

    constructor(cookies: any, options?: Options);

    getItem(key: string, callback?: Callback): Promise<any>;

    setItem(key: string, value: any, callback?: Callback): Promise<any>;

    removeItem(key: string, callback?: Callback): Promise<any>;

    getAllKeys(callback?: Callback): Promise<string[]>;
  }

  export class NodeCookiesWrapper {
    cookies: any;

    constructor(cookies: any);

    get(key: string): string | undefined;

    set(key: string, value: any, options: any): void;

    expire(key: string): void;
  }
}
