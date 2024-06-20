import { type SignedFetchRequest, signedFetch } from '~system/SignedFetch'

type FlatFetchResponse = {
  ok: boolean
  status: number
  statusText: string
  headers: Record<string, string>
  json?: any
  text?: string
}
type BodyType = 'json' | 'text'
type FlatFetchInit = RequestInit & { responseBodyType?: BodyType }

export function create(): Record<string, any> {
  async function internalSignedFetch(
    url: string,
    init?: FlatFetchInit
  ): Promise<FlatFetchResponse> {
    const request: SignedFetchRequest = {
      url
    }

    let responseBodyType: BodyType = 'text'
    if (init !== undefined) {
      request.init = {
        method: init.method ?? 'GET',
        body: init.body,
        headers: init.headers ?? {}
      }
      responseBodyType = init.responseBodyType ?? 'text'
    }

    const response = await signedFetch(request)

    let json: any | undefined
    let text: string | undefined

    if (response.ok) {
      if (responseBodyType === 'json') {
        json = JSON.parse(response.body)
      } else {
        text = response.body
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      json,
      text
    }
  }

  return {
    signedFetch: internalSignedFetch
  }
}
