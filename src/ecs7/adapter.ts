/* eslint-disable @typescript-eslint/no-dynamic-delete */
import {
  type Ecs6ComponentData,
  type AdaptationLayerState,
  type EventItem
} from '../types'
import {
  ecs7DeleteComponent,
  ecs7UpdateComponent,
  ecs7UpdateComponentWithoutEntityId
} from './bridge'
import { sdk7EnsureEntity, sdk7EnsureMutable } from './ecs7'

import { engine, Transform } from '@dcl/ecs'

function ensureEcs6ComponentState(
  state: AdaptationLayerState,
  id: string
): Ecs6ComponentData {
  if (state.ecs7.components[id] === undefined) {
    state.ecs7.components[id] = {}
  }
  return state.ecs7.components[id]
}

// ECS6 core
function ecs7AttachEntityComponent(
  state: AdaptationLayerState,
  entityId: string,
  componentName: string,
  id: string
): void {
  const component = ensureEcs6ComponentState(state, id)
  component.entityId = entityId
  if (component.classId !== undefined) {
    ecs7UpdateComponent(
      state,
      component.entityId,
      component.classId,
      component.data ?? {}
    )
  }
}

function ecs7RemoveEntityComponent(
  state: AdaptationLayerState,
  entityId: string,
  componentName: string
): void {
  for (const [_id, component] of Object.entries(state.ecs7.components)) {
    if (
      component.entityId === entityId &&
      component.componentName === componentName &&
      component.classId !== undefined
    ) {
      ecs7DeleteComponent(state, entityId, component.classId)

      const sdk6ComponentId =
        state.ecs6.entities[entityId].componentsName[componentName].id

      // clean
      delete state.ecs7.components[_id]
      delete state.ecs6.componentsWithId[sdk6ComponentId]
      delete state.ecs6.entities[entityId].componentsName[componentName]
      return
    }
  }
}

function ecs7AddEntity(state: AdaptationLayerState, entityId: EntityID): void {
  if (state.ecs7.entities[entityId] !== undefined) {
    engine.removeEntity(state.ecs7.entities[entityId])
  }
  sdk7EnsureEntity(state, entityId)
}

function ecs7SetParent(
  state: AdaptationLayerState,
  entityId: string,
  parentId: string
): void {
  if (parentId === '0') return
  const parentEntity = sdk7EnsureEntity(state, parentId)
  const transform = sdk7EnsureMutable(state, Transform, entityId)
  transform.parent = parentEntity
}

function ecs7RemoveEntity(
  state: AdaptationLayerState,
  entityId: EntityID
): void {
  if (state.ecs7.entities[entityId] === undefined) {
    return
  }
  engine.removeEntity(state.ecs7.entities[entityId])
  delete state.ecs7.entities[entityId]
}

function ecs7ComponentCreated(
  state: AdaptationLayerState,
  id: string,
  componentName: string,
  classId: number
): void {
  state.ecs7.components[id] = {
    classId,
    componentName
  }
}

function ecs7ComponentDisposed(state: AdaptationLayerState, id: string): void {
  if (state.ecs7.components[id] !== undefined) {
    const component = state.ecs7.components[id]
    if (component.entityId !== undefined && component.classId !== undefined) {
      ecs7DeleteComponent(state, component.entityId, component.classId)
    }
    delete state.ecs7.components[id]
  }
}

function ecs7ComponentUpdated(
  state: AdaptationLayerState,
  id: string,
  json: string
): void {
  const component = ensureEcs6ComponentState(state, id)
  component.data = JSON.parse(json)
  if (component.classId !== undefined) {
    if (component.entityId !== undefined) {
      ecs7UpdateComponent(
        state,
        component.entityId,
        component.classId,
        component.data
      )
    } else {
      ecs7UpdateComponentWithoutEntityId(
        state,
        id,
        component.classId,
        component.data
      )
    }
  }
}

function ecs7UpdateEntityComponent(
  state: AdaptationLayerState,
  entityId: string,
  componentName: string,
  classId: number,
  json: string
): void {
  const payload = JSON.parse(json)
  ecs7UpdateComponent(state, entityId, classId, payload)
}

export function adaptToEcs7(
  state: AdaptationLayerState,
  event: EventItem
): void {
  switch (event.method) {
    case 'attachEntityComponent':
      ecs7AttachEntityComponent(
        state,
        event.data.entityId,
        event.data.componentName,
        event.data.id
      )
      break
    case 'removeEntityComponent':
      ecs7RemoveEntityComponent(
        state,
        event.data.entityId,
        event.data.componentName
      )
      break
    case 'componentCreated':
      ecs7ComponentCreated(
        state,
        event.data.id,
        event.data.componentName,
        event.data.classId
      )
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
  }
}
