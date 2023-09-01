import { ECS6State } from '../types';

import { engine } from '@dcl/sdk/ecs'
import { Quaternion } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'

export function sendEventToSDK6(onEventFunctions: ((event: any) => void)[], event: EngineEvent) {
  for (const cb of onEventFunctions) {
    try {
      cb(event)
    } catch (err: any) {
      console.error('Error sendEventToSDK6', err)
    }
  }
}

export function updateEventSystem(state: ECS6State) {
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
}