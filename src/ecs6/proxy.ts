import { adaptToEcs7 } from '../ecs7/adapter'
import { type AdaptationLayerState } from '../types'

/**
 *
 * @param state
 * @param entityId
 * @param componentName
 * @param id
 */
export function proxyAttachEntityComponent(
  state: AdaptationLayerState,
  entityId: string,
  componentName: string,
  id: string
): void {
  preAttachEntityComponent(state, entityId, componentName, id)

  state.ecs6.events.push({
    method: 'attachEntityComponent',
    data: {
      entityId,
      componentName,
      id
    }
  })
}

/**
 *
 * @param state
 * @param entityId
 * @param componentName
 */
export function proxyRemoveEntityComponent(
  state: AdaptationLayerState,
  entityId: string,
  componentName: string
): void {
  state.ecs6.events.push({
    method: 'removeEntityComponent',
    data: {
      entityId,
      componentName
    }
  })
}

/**
 *
 * @param state
 * @param entityId
 */
export function proxyAddEntity(
  state: AdaptationLayerState,
  entityId: EntityID
): void {
  state.ecs6.events.push({
    method: 'addEntity',
    data: {
      entityId
    }
  })
}

/**
 *
 * @param state
 * @param entityId
 * @param parentId
 */
export function proxySetParent(
  state: AdaptationLayerState,
  entityId: string,
  parentId: string
): void {
  state.ecs6.events.push({
    method: 'setParent',
    data: {
      entityId,
      parentId
    }
  })
}

/**
 *
 * @param state
 * @param entityId
 */
export function proxyRemoveEntity(
  state: AdaptationLayerState,
  entityId: EntityID
): void {
  state.ecs6.events.push({
    method: 'removeEntity',
    data: {
      entityId
    }
  })
}

/**
 *
 * @param state
 * @param id
 * @param componentName
 * @param classId
 */
export function proxyComponentCreated(
  state: AdaptationLayerState,
  id: string,
  componentName: string,
  classId: number
): void {
  preComponentCreated(state, id, componentName, classId)

  state.ecs6.events.push({
    method: 'componentCreated',
    data: {
      id,
      componentName,
      classId
    }
  })
}

/**
 *
 * @param state
 * @param id
 */
export function proxyComponentDisposed(
  state: AdaptationLayerState,
  id: string
): void {
  state.ecs6.events.push({
    method: 'componentDisposed',
    data: {
      id
    }
  })
}

/**
 *
 * @param state
 * @param id
 * @param json
 */
export function proxyComponentUpdated(
  state: AdaptationLayerState,
  id: string,
  json: string
): void {
  preComponentUpdated(state, id, json)

  state.ecs6.events.push({
    method: 'componentUpdated',
    data: {
      id,
      json
    }
  })
}

/**
 *
 * @param state
 * @param entityId
 * @param componentName
 * @param classId
 * @param json
 */
export function proxyUpdateEntityComponent(
  state: AdaptationLayerState,
  entityId: string,
  componentName: string,
  classId: number,
  json: string
): void {
  preUpdateEntityComponent(state, entityId, componentName, classId, json)

  state.ecs6.events.push({
    method: 'updateEntityComponent',
    data: {
      entityId,
      componentName,
      classId,
      json
    }
  })
}

export function proxyHandleTick(state: AdaptationLayerState): void {
  for (const event of state.ecs6.events) {
    adaptToEcs7(state, event)
  }
  state.ecs6.events = []
}

/**
 *   
  - function attachEntityComponent(entityId: string, componentName: string, id: string): void
  function removeEntityComponent(entityId: string, componentName: string): void
  - function addEntity(entityId: EntityID): void
  - function setParent(entityId: string, parentId: string): void
  function removeEntity(entityId: EntityID): void
  -  function componentCreated(id: string, componentName: string, classId: number)
  function componentDisposed(id: string)
  - function componentUpdated(id: string, json: string)
  - function updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void

# Cube scene example
componentCreated(id: 'Ce', componentName: 'engine.shape', classId: 16)
componentUpdated(id: 'Ce', json: '{"withCollisions": true, ....}')
addEntity(entityId: 'Ed')
updateEntityComponent(entityId: 'Ed', componentName: 'engine.transform', classId: 1, json:'{"position": {"x":1 , ....')
attachEntityComponent(entityId: 'Ed', componentName: 'engine.shape', id: 'Ce')
*/

/**
 * 
function attachEntityComponent(entityId: string, componentName: string, id: string): void
function removeEntityComponent(entityId: string, componentName: string): void
function addEntity(entityId: EntityID): void
function setParent(entityId: string, parentId: string): void
function removeEntity(entityId: EntityID): void
function componentCreated(id: string, componentName: string, classId: number)
function componentDisposed(id: string)
function componentUpdated(id: string, json: string)
function updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void
 * 
 */

function preAttachEntityComponent(
  state: AdaptationLayerState,
  entityId: string,
  componentName: string,
  id: string
): void {
  if (state.ecs6.componentsWithId[id] === undefined) {
    state.ecs6.componentsWithId[id] = {
      componentName,
      classId: 0,
      disposed: false,
      json: '{}'
    }
  }

  if (state.ecs6.entities[entityId] === undefined) {
    state.ecs6.entities[entityId] = {
      componentsName: {}
    }
  }

  state.ecs6.entities[entityId].componentsName[componentName] = {
    classId: state.ecs6.componentsWithId[id].classId,
    id
  }
}

function preComponentCreated(
  state: AdaptationLayerState,
  id: string,
  componentName: string,
  classId: number
): void {
  state.ecs6.componentsWithId[id] = {
    componentName,
    classId,
    disposed: false,
    json: '{}'
  }
}

function preComponentUpdated(
  state: AdaptationLayerState,
  id: string,
  json: string
): void {
  let componentValue = state.ecs6.componentsWithId[id]
  if (componentValue === undefined) {
    state.ecs6.componentsWithId[id] = {
      componentName: '',
      classId: 0,
      disposed: false,
      json
    }

    componentValue = state.ecs6.componentsWithId[id]
  }

  componentValue.json = json
}

function preUpdateEntityComponent(
  state: AdaptationLayerState,
  entityId: string,
  componentName: string,
  classId: number,
  json: string
): void {
  if (state.ecs6.entities[entityId] === undefined) {
    state.ecs6.entities[entityId] = {
      componentsName: {}
    }
  }
}
