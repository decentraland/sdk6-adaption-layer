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

    if (init !== undefined) {
      request.init = {
        method: init.method ?? 'GET',
        body: init.body,
        headers: init.headers ?? {}
      }
    }

    const response = await signedFetch(request)
    return response
  }

  return {
    signedFetch: internalSignedFetch
  }
}
