import { ECS6State, EventItem } from '../types'
import { ecs7DeleteComponent, ecs7UpdateComponent } from './bridge'
import { ecs7EnsureEntity, ecs7EnsureMutable } from './ECS7'

import { engine, Transform } from '@dcl/ecs'

function ensureEcs6ComponentState(state: ECS6State, id: string) {
  if (state.ecs7.components[id] === undefined) {
    state.ecs7.components[id] = {}
  }
  return state.ecs7.components[id]
}

// ECS6 core
function ecs7AttachEntityComponent(state: ECS6State, entityId: string, componentName: string, id: string): void {
  const component = ensureEcs6ComponentState(state, id)
  component.entityId = entityId
  if (component.classId) {
    ecs7UpdateComponent(state, component.entityId, component.classId, component.data || {})
  }
}

function ecs7RemoveEntityComponent(state: ECS6State, entityId: string, componentName: string): void {
  for (const [_id, component] of Object.entries(state.ecs7.components)) {
    if (component.entityId === entityId && component.componentName === componentName && component.classId) {
      ecs7DeleteComponent(state, entityId, component.classId)
      return
    }
  }
}

function ecs7AddEntity(state: ECS6State, entityId: EntityID): void {
  if (state.ecs7.entities[entityId]) {
    engine.removeEntity(state.ecs7.entities[entityId])
  }
  ecs7EnsureEntity(state, entityId)
}

function ecs7SetParent(state: ECS6State, entityId: string, parentId: string): void {
  if (parentId === '0') return
  const parentEntity = ecs7EnsureEntity(state, parentId)
  const transform = ecs7EnsureMutable(state, Transform, entityId)
  transform.parent = parentEntity
}

function ecs7RemoveEntity(state: ECS6State, entityId: EntityID): void {
  if (state.ecs7.entities[entityId] === undefined) {
    return
  }
  engine.removeEntity(state.ecs7.entities[entityId])
  delete state.ecs7.entities[entityId]
}

function ecs7ComponentCreated(state: ECS6State, id: string, componentName: string, classId: number) {
  state.ecs7.components[id] = {
    classId,
    componentName
  }
}

function ecs7ComponentDisposed(state: ECS6State, id: string) {
  if (state.ecs7.components[id]) {
    const component = state.ecs7.components[id]
    if (component.entityId && component.classId) {
      ecs7DeleteComponent(state, component.entityId, component.classId)
    }
    delete state.ecs7.components[id]
  }
}

function ecs7ComponentUpdated(state: ECS6State, id: string, json: string) {
  const component = ensureEcs6ComponentState(state, id)
  component.data = JSON.parse(json)
  if (component.classId && component.entityId) {
    ecs7UpdateComponent(state, component.entityId, component.classId, component.data)
  }
}

function ecs7UpdateEntityComponent(
  state: ECS6State,
  entityId: string,
  componentName: string,
  classId: number,
  json: string
): void {
  const payload = JSON.parse(json)
  ecs7UpdateComponent(state, entityId, classId, payload)
}

export function adaptToEcs7(state: ECS6State, event: EventItem) {
  switch (event.method) {
    case 'attachEntityComponent':
      ecs7AttachEntityComponent(state, event.data.entityId, event.data.componentName, event.data.id)
      break
    case 'removeEntityComponent':
      ecs7RemoveEntityComponent(state, event.data.entityId, event.data.componentName)
      break
    case 'componentCreated':
      ecs7ComponentCreated(state, event.data.id, event.data.componentName, event.data.classId)
      break
    case 'componentDisposed':
      ecs7ComponentDisposed(state, event.data.id)
      break
    case 'componentUpdated':
      ecs7ComponentUpdated(state, event.data.id, event.data.json)
      break
    case 'updateEntityComponent':
      ecs7UpdateEntityComponent(
        state,
        event.data.entityId,
        event.data.componentName,
        event.data.classId,
        event.data.json
      )
      break
    case 'addEntity':
      ecs7AddEntity(state, event.data.entityId)
      break
    case 'removeEntity':
      ecs7RemoveEntity(state, event.data.entityId)
      break
    case 'setParent':
      ecs7SetParent(state, event.data.entityId, event.data.parentId)
      break

    default:
      break
  }

  return false
}
