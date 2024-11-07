import { type AdaptationLayerState } from '../types'

import {
  CameraMode,
  CameraType,
  type Entity,
  InputAction,
  PointerEvents,
  PointerLock,
  Transform,
  engine,
  inputSystem
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

import {
  PointerEventStateComponent,
  convertPointerEventToSDK6
} from '../components-bridge/UuidCallback'

export function sendEventToSDK6(
  onEventFunctions: Array<(event: any) => void>,
  event: EngineEvent
): void {
  for (const cb of onEventFunctions) {
    try {
      cb(event)
    } catch (err: any) {
      console.error('Error sendEventToSDK6', err)
    }
  }
}

function vector3CloseTo(a: Vector3, b: Vector3): boolean {
  return (
    Math.abs(a.x - b.x) < 0.001 &&
    Math.abs(a.y - b.y) < 0.001 &&
    Math.abs(a.z - b.z) < 0.001
  )
}

function quaterniongCloseTo(a: Quaternion, b: Quaternion): boolean {
  return (
    Math.abs(a.x - b.x) < 0.001 &&
    Math.abs(a.y - b.y) < 0.001 &&
    Math.abs(a.z - b.z) < 0.001 &&
    Math.abs(a.w - b.w) < 0.001
  )
}

function hasAssignAnyPointerEvent(entity: Entity): boolean {
  const value = PointerEvents.getOrNull(entity)
  if (value !== null && value.pointerEvents.length > 0) {
    return (
      value.pointerEvents[0].eventInfo === undefined ||
      value.pointerEvents[0].eventInfo.button === InputAction.IA_ANY ||
      value.pointerEvents[0].eventInfo.button === undefined
    )
  }
  return false
}

export function updateEventSystem(state: AdaptationLayerState): void {
  if (state.subscribedEvents.has('positionChanged')) {
    // TODO: should we add y-offset 0.8?
    const playerPosition: Vector3.ReadonlyVector3 =
      Transform.getOrNull(engine.PlayerEntity)?.position ?? Vector3.Zero()
    const cameraPosition: Vector3.ReadonlyVector3 =
      Transform.getOrNull(engine.CameraEntity)?.position ?? Vector3.Zero()
    const needUpdate =
      state.eventState.lastPositionChanged === null ||
      !vector3CloseTo(
        playerPosition,
        state.eventState.lastPositionChanged.position
      )
    if (needUpdate) {
      const data: IEvents['positionChanged'] = {
        position: playerPosition,
        cameraPosition,
        playerHeight: 1.6
      }

      sendEventToSDK6(state.onEventFunctions, {
        type: 'positionChanged',
        data
      })

      state.eventState.lastPositionChanged = data
    }
  }

  if (state.subscribedEvents.has('rotationChanged')) {
    const rotation =
      Transform.getOrNull(engine.CameraEntity)?.rotation ??
      Quaternion.Identity()

    if (
      state.eventState.lastRotationChanged === null ||
      !quaterniongCloseTo(
        rotation,
        state.eventState.lastRotationChanged.quaternion
      )
    ) {
      const data = {
        quaternion: rotation,
        rotation: Quaternion.toEulerAngles(rotation)
      } satisfies IEvents['rotationChanged']

      sendEventToSDK6(state.onEventFunctions, {
        type: 'rotationChanged',
        data
      })

      state.eventState.lastRotationChanged = data
    }
  }

  for (const [entity, component] of engine.getEntitiesWith(
    PointerEventStateComponent
  )) {
    for (const action of component.registeredActions) {
      const event = inputSystem.getInputCommand(
        action.inputAction,
        action.eventType
      )
      if (event !== undefined) {
        if (event?.hit?.entityId === entity) {
          let send = true
          if (hasAssignAnyPointerEvent(entity)) {
            if (
              event.button === InputAction.IA_WALK ||
              event.button === InputAction.IA_BACKWARD ||
              event.button === InputAction.IA_LEFT ||
              event.button === InputAction.IA_RIGHT
            ) {
              send = false
            }
          }

          send &&
            sendEventToSDK6(state.onEventFunctions, {
              type: 'uuidEvent',
              data: {
                uuid: action.uuid,
                payload: convertPointerEventToSDK6(state, event)
              } satisfies IEvents['uuidEvent']
            })
        } else if (event !== null) {
          sendEventToSDK6(state.onEventFunctions, {
            type: 'actionButtonEvent',
            data: {
              payload: convertPointerEventToSDK6(
                state,
                event
              ) satisfies IEvents['actionButtonEvent']
            }
          })
        }
      }
    }
  }

  if (state.subscribedEvents.has('cameraModeChanged')) {
    const currentMode =
      CameraMode.getOrNull(engine.CameraEntity)?.mode ??
      CameraType.CT_THIRD_PERSON
    if (state.eventState.lastCameraMode !== currentMode) {
      sendEventToSDK6(state.onEventFunctions, {
        type: 'cameraModeChanged',
        data: {
          cameraMode: currentMode as any
        } satisfies IEvents['cameraModeChanged']
      })
      state.eventState.lastCameraMode = currentMode
    }
  }

  if (state.subscribedEvents.has('cameraModeChanged')) {
    const isPointerLocked =
      PointerLock.getOrNull(engine.CameraEntity)?.isPointerLocked ?? false
    if (state.eventState.lastIsPointerLock !== isPointerLocked) {
      sendEventToSDK6(state.onEventFunctions, {
        type: 'cameraModeChanged',
        data: {
          locked: isPointerLocked
        } satisfies IEvents['onPointerLock']
      })
      state.eventState.lastIsPointerLock = isPointerLocked
    }
  }
}

// TODO idleStateChanged
// TODO videoEvent
