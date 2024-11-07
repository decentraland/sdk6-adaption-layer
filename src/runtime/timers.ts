import * as utils from '@dcl-sdk/utils'

const thisGlobal: any = globalThis

export const clearTimeout =
  thisGlobal.clearTimeout !== undefined
    ? thisGlobal.clearTimeout
    : utils.timers.clearTimeout
export const clearInterval =
  thisGlobal.clearInterval !== undefined
    ? thisGlobal.clearInterval
    : utils.timers.clearInterval
export const setTimeout =
  thisGlobal.setTimeout !== undefined
    ? thisGlobal.setTimeout
    : utils.timers.setTimeout
export const setInterval =
  thisGlobal.setInterval !== undefined
    ? thisGlobal.setInterval
    : utils.timers.setInterval
