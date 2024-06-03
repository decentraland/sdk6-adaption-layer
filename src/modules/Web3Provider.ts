import { sendAsync } from '~system/EthereumController'

export function create(): Record<string, any> {
  const request = async (message: any): Promise<any> => {
    const response = await sendAsync({
      id: message.id,
      method: message.method,
      jsonParams: JSON.stringify(message.params)
    })
    return JSON.parse(response.jsonAnyResponse)
  }

  return {
    async getProvider(): Promise<any> {
      return {
        // @internal
        send(
          message: any,
          callback?: (error: Error | null, result?: any) => void
        ): void {
          if (
            message !== undefined &&
            callback !== undefined &&
            callback instanceof Function
          ) {
            request(message)
              .then((x: any) => {
                callback(null, x)
              })
              .catch(callback)
          } else {
            throw new Error('Decentraland provider only allows async calls')
          }
        },
        sendAsync(
          message: any,
          callback: (error: Error | null, result?: any) => void
        ): void {
          request(message)
            .then((x: any) => {
              callback(null, x)
            })
            .catch(callback)
        }
      }
    }
  }
}
