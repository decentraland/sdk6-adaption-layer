import { AdaptationLayerState } from '../types'

import { Entity, engine, LastWriteWinElementSetComponentDefinition } from '@dcl/ecs'

export function sdk7ExistsEntity(state: AdaptationLayerState, ecs6EntityId: EntityID): boolean {
  if (state.ecs7.entities[ecs6EntityId] === undefined) {
    return false
  }
  return true
}

export function sdk7EnsureEntity(state: AdaptationLayerState, ecs6EntityId: EntityID): Entity {
  if (state.ecs7.entities[ecs6EntityId] === undefined) {
    state.ecs7.entities[ecs6EntityId] = engine.addEntity()
  }
  return state.ecs7.entities[ecs6EntityId]
}

// TODO: A cache can be created to make function faster
export function getSdk6Entity(state: AdaptationLayerState, ecs7EntityId: Entity | undefined): EntityID | undefined {
  if (!ecs7EntityId) return undefined
  const entries = Object.entries(state.ecs7.entities).find(value => value[1] == ecs7EntityId)
  return entries ? entries![0] : undefined
}


export function sdk7EnsureMutable<T>(
  state: AdaptationLayerState,
  component: LastWriteWinElementSetComponentDefinition<T>,
  ecs6EntityId: EntityID
): T {
  const entity = sdk7EnsureEntity(state, ecs6EntityId)
  if (component.has(entity)) {
    return component.getMutable(entity)
  } else {
    return component.createOrReplace(entity)
  }
}
