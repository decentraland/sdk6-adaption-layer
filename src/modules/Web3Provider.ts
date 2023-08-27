export function loadWeb3Provider(sendAsyncMethod: (message: any) => any): any {
  const request = async (message: any) => {
    const response = await sendAsyncMethod({
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
        send(message: any, callback?: (error: Error | null, result?: any) => void): void {
          if (message && callback && callback instanceof Function) {
            request(message)
              .then((x: any) => callback(null, x))
              .catch(callback)
          } else {
            throw new Error('Decentraland provider only allows async calls')
          }
        },
        sendAsync(message: any, callback: (error: Error | null, result?: any) => void): void {
          request(message)
            .then((x: any) => callback(null, x))
            .catch(callback)
        }
      }
    }
  }
}