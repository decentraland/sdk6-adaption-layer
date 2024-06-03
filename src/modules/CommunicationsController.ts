import { send as sendString } from '~system/CommunicationsController'

export function create(): Record<string, any> {
  async function send(message: string): Promise<void> {
    await sendString({ message })
  }

  return {
    send
  }
}
