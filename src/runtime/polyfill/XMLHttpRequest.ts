type Callback = any

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ProgressEvent {}

export class XMLHttpRequest {
  public withCredentials?: boolean = undefined

  // request info
  public timeout: number = 0
  private _events: Record<string, Callback> = {}
  private _headers: Record<string, string> = {}
  private _method: string = 'GET'
  private _url: string = ''

  // response info
  public headers: Record<string, string> = {}
  public statusText: string = ''
  public status: number = 0
  public response: any
  private allHeaders: string = ''

  set ontimeout(cb: Callback) {
    this._events.timeout = cb
  }

  get ontimeout(): Callback {
    return this._events.timeout
  }

  set onloadstart(cb: Callback) {
    this._events.loadstart = cb
  }

  get onloadstart(): Callback {
    return this._events.loadstart
  }

  set onloadend(cb: Callback) {
    this._events.loadend = cb
  }

  get onloadend(): Callback {
    return this._events.loadend
  }

  set onload(cb: Callback) {
    this._events.load = cb
  }

  get onload(): Callback {
    return this._events.load
  }

  set onerror(cb: Callback) {
    this._events.error = cb
  }

  get onerror(): Callback {
    return this._events.error
  }

  addEventListener(event: string, callback: Callback): void {
    this._events[event] = callback
  }

  setRequestHeader(name: string, value: string): void {
    this._headers[name] = value
  }

  getAllResponseHeaders(): string {
    return this.allHeaders
  }

  open(method: string, url: string): void {
    this._method = method
    this._url = url
  }

  send(body?: string): void {
    // const controller = new AbortController();

    const options: RequestInit = {
      method: this._method,
      headers: this._headers,
      body
      // signal: controller.signal,
    }

    // TODO: this is not used
    if (this.withCredentials === true) {
      ;(options as any).credentials = 'include'
    }

    // dummy ProgressEvent
    const e = new ProgressEvent()
    this._events.loadstart?.(e)

    // let timeoutId: number;
    // if (this.timeout > 0) {
    //   timeoutId = setTimeout(() => controller.abort(), this.timeout);
    // }

    fetch(this._url, options)
      .then(async (response) => {
        // clearTimeout(timeoutId);

        // fill response headers
        this.allHeaders = ''
        this.headers = {}
        response.headers.forEach((value, key) => {
          this.headers[key] = value
          this.allHeaders += key + ': ' + value + '\r\n'
        })

        this.status = response.status
        this.statusText = response.statusText
        this.response = await response.text()

        // trigger events
        this._events.load?.(e)
        this._events.loadend?.(e)
      })
      .catch((reason) => {
        // clearTimeout(timeoutId);
        console.error(reason.message)

        if (
          reason.code !== undefined &&
          (reason.code === 20 || reason.code === 23)
        ) {
          reason.type = 'timeout'
        }

        this._events.error?.(reason)
      })
  }
}
