export class AbortableFetch {
  private _abortController: AbortController;
  private _fetch: Promise<Response>;

  constructor(input: string | URL | globalThis.Request, init?: RequestInit) {
    this._abortController = new AbortController();
    this._fetch = fetch(input, {
      ...init,
      signal: this._abortController.signal,
    });
  }

  // Getter of the fetch promise
  get fetch(): Promise<Response> {
    return this._fetch;
  }

  // Abort the fetch
  abort(): void {
    this._abortController.abort();
  }
}
