import { sendBatch } from "~system/EngineApi"

import { sendEventToSDK6 } from "./events"
import { type AdaptationLayerState } from "../types"

export async function pollEvents(state: AdaptationLayerState): Promise<void>{
    const { events } = await sendBatch({ actions: [] })
    for (const e of events) {
        if (e.generic !== undefined) {
            const data = JSON.parse(e.generic.eventData)
            switch (e.generic.eventId) {
              case 'onEnterScene': {
                sendEventToSDK6(state.onEventFunctions, {
                  type: 'onEnterScene',
                  data
                })
                break
              }
              case 'onLeaveScene': {
                sendEventToSDK6(state.onEventFunctions, {
                  type: 'onLeaveScene',
                  data
                })
                break
              }
              case 'sceneStart': {
                sendEventToSDK6(state.onEventFunctions, {
                  type: 'sceneStart',
                  data
                })
                break
              }
              case 'playerExpression': {
                sendEventToSDK6(state.onEventFunctions, {
                  type: 'playerExpression',
                  data
                })
                break
              }
              case 'profileChanged': {
                sendEventToSDK6(state.onEventFunctions, {
                  type: 'profileChanged',
                  data
                })
                break
              }
              case 'playerConnected': {
                sendEventToSDK6(state.onEventFunctions, {
                  type: 'playerConnected',
                  data
                })
                break
              }
              case 'playerDisconnected': {
                sendEventToSDK6(state.onEventFunctions, {
                  type: 'playerDisconnected',
                  data
                })
                break
              }
              case 'onRealmChanged': {
                sendEventToSDK6(state.onEventFunctions, {
                  type: 'onRealmChanged',
                  data
                })
                break
              }
              case 'playerClicked': {
                sendEventToSDK6(state.onEventFunctions, {
                  type: 'playerClicked',
                  data
                })
                break
              }
              case 'comms': {
                sendEventToSDK6(state.onEventFunctions, {
                  type: 'comms',
                  data
                })
                break
              }
            }
        }
    }
}