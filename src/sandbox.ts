import { XMLHttpRequest } from './runtime/polyfill/XMLHttpRequest'
import * as utils from '@dcl-sdk/utils'
import { TextEncoder, TextDecoder } from 'text-encoding'
import { FormData } from 'formdata-polyfill/esm.min'

const allowListES5: Array<keyof typeof globalThis> = [
  'eval',
  'parseInt',
  'parseFloat',
  'isNaN',
  'isFinite',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'escape',
  'unescape',
  'Object',
  'Function',
  'String',
  'Boolean',
  'Number',
  'Math',
  'Date',
  'RegExp',
  'Error',
  'EvalError',
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'URIError',
  'JSON',
  'Array',
  'Promise',
  'NaN',
  'Infinity'
]

// eslint-disable-next-line @typescript-eslint/ban-types
const defer: (fn: Function) => void = (Promise.resolve().then as any).bind(
  Promise.resolve() as any
)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function customEval(code: string, context: any) {
  const sandbox: any = {}

  const resultKey = 'SAFE_EVAL_' + Math.floor(Math.random() * 1000000)
  sandbox[resultKey] = {}

  Object.keys(context).forEach(function (key) {
    sandbox[key] = context[key]
  })

  sandbox.clearInterval = utils.timers.clearInterval
  sandbox.clearTimeout = utils.timers.clearTimeout
  sandbox.setInterval = utils.timers.setInterval
  sandbox.setTimeout = utils.timers.setTimeout

  sandbox.XMLHttpRequest = XMLHttpRequest
  sandbox.TextEncoder = TextEncoder
  sandbox.TextDecoder = TextDecoder
  sandbox.FormData = FormData

  sandbox.window = sandbox
  sandbox.self = sandbox

  sandbox.fetch = async (url: string, init: any) => {
    return await fetch(url, init)
  }

  defer(() =>
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    new Function('code', `with (this) { ${code} }`).call(sandbox, code)
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getES5Context(base: Record<string, any>) {
  // globalThis shouldn't crash here, as allowListES5 is an array of `keyof typeof globalThis`
  allowListES5.forEach(($) => (base[$] = (globalThis as any)[$]))

  return base
}
