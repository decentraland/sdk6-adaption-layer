import { AdaptationLayerState } from '../types';

import { engine, inputSystem } from '@dcl/sdk/ecs'
import { Quaternion } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { PointerEventStateComponent, convertPointerEventToSDK6 } from '../components-bridge/UuidCallback';

export function sendEventToSDK6(onEventFunctions: ((event: any) => void)[], event: EngineEvent) {
  for (const cb of onEventFunctions) {
    try {
      cb(event)
    } catch (err: any) {
      console.error('Error sendEventToSDK6', err)
    }
  }
}

export function updateEventSystem(state: AdaptationLayerState) {
  // TODO: We can cache it, and send only when changes

  if (state.subscribedEvents.has('positionChanged')) {
    sendEventToSDK6(state.onEventFunctions, {
      type: 'positionChanged',
      data: {
        position: utils.getWorldPosition(engine.PlayerEntity),
        cameraPosition: utils.getWorldPosition(engine.CameraEntity),
        playerHeight: 1.6,
      } as IEvents['positionChanged']
    })
  }

  if (state.subscribedEvents.has('rotationChanged')) {
    const rotation = utils.getWorldRotation(engine.CameraEntity)
    sendEventToSDK6(state.onEventFunctions, {
      type: 'rotationChanged',
      data: {
        quaternion: rotation,
        rotation: Quaternion.toEulerAngles(rotation),
      } as IEvents['rotationChanged']
    })
  }
  for (const [entity, component] of engine.getEntitiesWith(PointerEventStateComponent)) {
    for (const action of component.registeredActions) {
      const event = inputSystem.getInputCommand(action.inputAction, action.eventType)
      if (event && event?.hit?.entityId == entity) {
        sendEventToSDK6(state.onEventFunctions, {
          type: 'uuidEvent',
          data: {
            uuid: action.uuid,
            payload: convertPointerEventToSDK6(state, event)
          } as IEvents['uuidEvent']
        })
      }
    }
  }
}