import { sendAsync } from '~system/EthereumController'
import { getUserData } from '~system/UserIdentity'

type RPCSendableMessage = {
  jsonrpc: '2.0'
  id: number
  method: string
  params: any[]
}

type MessageDict = Record<string, string>

export function create(): Record<string, any> {
  /**
   * Requires a generic payment in ETH or ERC20.
   * @param  {string} [toAddress] - NFT asset id.
   * @param  {number} [amount] - Exact amount of the order.
   * @param  {string} [currency] - ETH or ERC20 supported token symbol
   */
  async function requirePayment(
    toAddress: string,
    amount: number,
    currency: string
  ): Promise<any> {
    throw new Error('RequirePayment is not available, use sendAsync instead.')
  }

  /**
   * Takes a dictionary, converts it to string with correct format and signs it.
   * @param  {messageToSign} [MessageDict] - Message in an object format.
   * @return {object} - Promise of message and signature in an object.
   */
  async function signMessage(message: MessageDict): Promise<{
    message: string
    hexEncodedMessage: string
    signature: string
  }> {
    throw new Error('signMessage is not available, use sendAsync instead.')
  }

  /**
   * Takes a message string, parses it and converts to object.
   * @param  {message} [string] - Message in a string format.
   * @return {object} - Promise of message as a MessageDict.
   * @internal
   */
  async function convertMessageToObject(message: string): Promise<MessageDict> {
    let parsedMessage = message
  
    // Remove `# DCL Signed message` header
    if (message.indexOf('# DCL Signed message') === 0) {
      parsedMessage = message.slice(21)
    }
    // First, split the string parts into nested array
    const arr = parsedMessage
      .split('\n')
      .map((m) => m.split(':'))
      .map(([key, value]) => [key, value.trim()])
  
    // convert the array into object of type MessageDict
    return arr.reduce((o, [key, value]) => ({ ...o, [key]: value }), {})
  }

  /**
   * Used to build a Ethereum provider
   */
  async function internalSendAsync(message: RPCSendableMessage): Promise<any> {
    const response = await sendAsync({
      id: message.id,
      method: message.method,
      jsonParams: JSON.stringify(message.params)
    })
    return response
  }

  /**
   * Returns the user's public key (address)
   */
  async function getUserAccount(): Promise<string> {
    const userData = await getUserData({})
    return userData.data?.userId ?? ''
  }

  return {
    requirePayment,
    signMessage,
    convertMessageToObject,
    sendAsync: internalSendAsync,
    getUserAccount
  }
}
