import { ecs7EnsureEntity } from '../ecs7/ECS7'
import { ECS6State } from '../types'

import { pointerEventsSystem } from '@dcl/ecs'
import { convertInputAction } from './commons/utils'

export function update(state: ECS6State, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = ecs7EnsureEntity(state, ecs6EntityId)

  pointerEventsSystem.onPointerDown(
    {
      entity: ecs7Entity,
      opts: {
        button: convertInputAction(payload.button),
        hoverText: payload.hoverText,
        maxDistance: payload.distance,
        showFeedback: payload.showFeedback
      }
    },
    () => {
        console.log('Clicked')
    }
  )
}

export function remove(state: ECS6State, ecs6EntityId: EntityID) {
  const ecs7Entity = ecs7EnsureEntity(state, ecs6EntityId)
  pointerEventsSystem.removeOnPointerDown(ecs7Entity)
}
