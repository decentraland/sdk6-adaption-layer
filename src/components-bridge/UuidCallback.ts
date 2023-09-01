import { getSdk6Entity, sdk7EnsureEntity } from '../ecs7/ECS7'
import { ECS6State } from '../types'
import { pointerEventsSystem } from '@dcl/ecs'
import { convertInputAction } from './commons/utils'
import { sendEventToSDK6 } from '../events/events'
import { Entity, InputAction, PBPointerEventsResult, PointerEventType, PointerEvents, Schemas, engine, inputSystem } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { CustomPointerEvent, CustomPointerEventSchemas } from '../schemas/CustomPointerEventSchemas'

export const PointerEventStateComponent = engine.defineComponent(
  "pointerEventStateComponent",
  {
    registeredActions: Schemas.Array(CustomPointerEventSchemas),
  })

function convertPointerEventTypeToSDK6(type: PointerEventType) {
  /** SDK6
   * DOWN = 0,
   * UP = 1
   */
  switch (type) {
    case PointerEventType.PET_DOWN:
    case PointerEventType.PET_HOVER_ENTER:
      return 0
    case PointerEventType.PET_UP:
    case PointerEventType.PET_HOVER_LEAVE:
      return 1
  }
}

function getPointerEventType(type: string): PointerEventType {
  switch (type) {
    case 'pointerDown':
      return PointerEventType.PET_DOWN
    case 'pointerUp':
      return PointerEventType.PET_UP
    case 'pointerHoverEnter':
      return PointerEventType.PET_HOVER_ENTER
    case 'pointerHoverExit':
      return PointerEventType.PET_HOVER_LEAVE
  }

  return PointerEventType.PET_DOWN
}

function convertPointerEventToSDK6(state: ECS6State, event: PBPointerEventsResult): GlobalInputEventResult {
  return {
    buttonId: event.button,
    direction: event.hit?.direction || Vector3.create(0.0, 0.0, 0.0),
    origin: event.hit?.globalOrigin || Vector3.create(0.0, 0.0, 0.0),
    type: convertPointerEventTypeToSDK6(event.state),
    hit: event.hit ? {
      entityId: getSdk6Entity(state, event.hit!.entityId as Entity) || '',
      hitPoint: event.hit!.position || Vector3.create(0.0, 0.0, 0.0),
      length: event.hit!.length,
      meshName: event.hit!.meshName || '',
      normal: event.hit!.normalHit || Vector3.create(0.0, 0.0, 0.0),
      worldNormal: event.hit!.normalHit || Vector3.create(0.0, 0.0, 0.0)
    } : undefined
  }
}

export function update(state: ECS6State, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  const component = PointerEventStateComponent.getMutableOrNull(ecs7Entity)
  if (component === null) {
    // create event component
    PointerEventStateComponent.create(ecs7Entity, {
      registeredActions: [{
        eventType: getPointerEventType(payload.type),
        inputAction: convertInputAction(payload.button)!,
        uuid: payload.uuid
      }]
    })

    // create system
    engine.addSystem(() => {
      const eventStateComponent = PointerEventStateComponent.get(ecs7Entity)
      for (const action of eventStateComponent.registeredActions) {
        const event = inputSystem.getInputCommand(action.inputAction, action.eventType)
        if (event) {
          sendEventToSDK6(state.onEventFunctions, {
            type: 'uuidEvent',
            data: {
              uuid: action.uuid,
              payload: convertPointerEventToSDK6(state, event)
            } as IEvents['uuidEvent']
          })
        }
      }
    })
  } else {
    component.registeredActions.push({
      eventType: getPointerEventType(payload.type),
      inputAction: convertInputAction(payload.button)!,
      uuid: payload.uuid
    })
  }


  if (payload.hoverText || payload.showFeedback) {
    const pointerEvent = PointerEvents.getOrCreateMutable(ecs7Entity)

    pointerEvent.pointerEvents.push({
      eventType: getPointerEventType(payload.type),
      eventInfo: {
        button: convertInputAction(payload.button),
        hoverText: payload.hoverText,
        maxDistance: payload.distance,
        showFeedback: payload.showFeedback
      }
    })
  }
}

export function remove(state: ECS6State, ecs6EntityId: EntityID) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  PointerEvents.deleteFrom(ecs7Entity)
  PointerEventStateComponent.deleteFrom(ecs7Entity)
}
