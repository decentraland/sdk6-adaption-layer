import { clearTimeout, setTimeout } from '../timers'

type Callback = any

type XMLHttpRequestResponseType =
  | ''
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ProgressEvent {}
export class XMLHttpRequest {
  public withCredentials?: boolean
  public timeout: number = 0
  public readyState: number = 0
  public responseType: XMLHttpRequestResponseType = 'text'
  public responseURL: string = ''

  private _events: Record<string, Callback> = {}
  private _headers: Record<string, string> = {}
  private _method: string = 'GET'
  private _url: string = ''

  public headers: Record<string, string> = {}
  public statusText: string = ''
  public status: number = 0
  public response: any
  public responseText: string | null | undefined
  private allHeaders: string = ''

  private updateReadyState(state: number): void {
    this.readyState = state
    this._events.readystatechange?.(new ProgressEvent())
  }

  // eslint-disable-next-line accessor-pairs
  set ontimeout(cb: Callback) {
    this._events.timeout = cb
  }

  // eslint-disable-next-line accessor-pairs
  set onloadstart(cb: Callback) {
    this._events.loadstart = cb
  }

  // eslint-disable-next-line accessor-pairs
  set onloadend(cb: Callback) {
    this._events.loadend = cb
  }

  // eslint-disable-next-line accessor-pairs
  set onload(cb: Callback) {
    this._events.load = cb
  }

  // eslint-disable-next-line accessor-pairs
  set onerror(cb: Callback) {
    this._events.error = cb
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
    this.updateReadyState(1)
  }

  send(body?: string): void {
    // const controller = new AbortController();
    const options: RequestInit = {
      method: this._method,
      headers: this._headers,
      body
      // , signal: controller.signal };
    }

    // if (this.withCredentials) { (options as any).credentials = 'include'; }

    const e = new ProgressEvent()
    this._events.loadstart?.(e)

    let timeoutId: number | undefined
    if (this.timeout > 0) {
      timeoutId = setTimeout(() => {
        // controller.abort();
        this._events.timeout?.(e)
      }, this.timeout)
    }

    fetch(this._url, options)
      .then(async (response) => {
        if (timeoutId !== undefined) clearTimeout(timeoutId)
        this.responseURL = response.url
        this.allHeaders = ''
        this.headers = {}

        response.headers.forEach((value, key) => {
          this.headers[key] = value
          this.allHeaders += key + ': ' + value + '\r\n'
        })

        this.status = response.status
        this.statusText = response.statusText

        if (this.responseType === 'json') {
          this.response = await response.json()
        } else if (this.responseType === 'blob') {
          this.response = await (response as any).bytes()
        } else if (this.responseType === 'arraybuffer') {
          this.response = await (response as any).arrayBuffer()
        } else {
          this.response = await response.text()
          this.responseText = this.response
        }

        this.updateReadyState(4)
        this._events.load?.(e)
        this._events.loadend?.(e)
      })
      .catch((reason) => {
        if (timeoutId !== undefined) clearTimeout(timeoutId)
        this._events.error?.(reason)
        this._events.loadend?.(e)
      })
  }

  public abort(): void {
    this._events.abort?.(new ProgressEvent())
  }
}
