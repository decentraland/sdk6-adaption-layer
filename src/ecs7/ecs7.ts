import { AdaptationLayerState, ECS6_CLASS_ID } from '../types'

import { Entity, engine, LastWriteWinElementSetComponentDefinition } from '@dcl/ecs'

export function sdk7ExistsEntity(state: AdaptationLayerState, ecs6EntityId: EntityID): boolean {
  if (state.ecs7.entities[ecs6EntityId] === undefined) {
    return false
  }
  return true
}

export function sdk7EnsureEntity(state: AdaptationLayerState, ecs6EntityId: EntityID): Entity {
  if (state.ecs7.entities[ecs6EntityId] === undefined) {
    state.ecs7.entities[ecs6EntityId] = engine.addEntity(true)
  }
  return state.ecs7.entities[ecs6EntityId]
}

export function sdk7EnsureEntityByIDForUI(state: AdaptationLayerState, id: string): Entity {
  if (state.ecs7.entities[`ui_${id}`] === undefined) {
    state.ecs7.entities[`ui_${id}`] = engine.addEntity(true)
  }
  return state.ecs7.entities[`ui_${id}`]
}

export function sdk7RemoveEntityByIDForUI(state: AdaptationLayerState, id: string) {
  const entity = state.ecs7.entities[`ui_${id}`]
  if (entity) {
    engine.removeEntity(entity)
    delete state.ecs7.entities[`ui_${id}`]
  }
}

// TODO: A cache can be created to make function faster
export function getSdk6Entity(state: AdaptationLayerState, ecs7EntityId: Entity | undefined): EntityID | undefined {
  if (!ecs7EntityId) return undefined
  const entries = Object.entries(state.ecs7.entities).find(value => value[1] == ecs7EntityId)
  return entries ? entries![0] : undefined
}

export function isSDK6UIClassID(classId: ECS6_CLASS_ID) {
  return classId === ECS6_CLASS_ID.UI_WORLD_SPACE_SHAPE ||
    classId === ECS6_CLASS_ID.UI_SCREEN_SPACE_SHAPE ||
    classId === ECS6_CLASS_ID.UI_CONTAINER_RECT ||
    classId === ECS6_CLASS_ID.UI_CONTAINER_STACK ||
    classId === ECS6_CLASS_ID.UI_TEXT_SHAPE ||
    classId === ECS6_CLASS_ID.UI_INPUT_TEXT_SHAPE ||
    classId === ECS6_CLASS_ID.UI_IMAGE_SHAPE ||
    classId === ECS6_CLASS_ID.UI_SLIDER_SHAPE
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
