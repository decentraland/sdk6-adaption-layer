import { ECS6State } from '../types'

import { Entity, engine, LastWriteWinElementSetComponentDefinition } from '@dcl/ecs'

export function ecs7ExistsEntity(state: ECS6State, ecs6EntityId: EntityID): boolean {
  if (state.ecs7.entities[ecs6EntityId] === undefined) {
    return false
  }
  return true
}

export function ecs7EnsureEntity(state: ECS6State, ecs6EntityId: EntityID): Entity {
  if (state.ecs7.entities[ecs6EntityId] === undefined) {
    state.ecs7.entities[ecs6EntityId] = engine.addEntity(true)
  }
  return state.ecs7.entities[ecs6EntityId]
}

export function ecs7EnsureMutable<T>(
  state: ECS6State,
  component: LastWriteWinElementSetComponentDefinition<T>,
  ecs6EntityId: EntityID
): T {
  const entity = ecs7EnsureEntity(state, ecs6EntityId)
  if (component.has(entity)) {
    return component.getMutable(entity)
  } else {
    return component.createOrReplace(entity)
  }
}
