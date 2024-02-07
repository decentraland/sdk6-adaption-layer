import { printState } from '../debug'
import { updateEventSystem } from '../events/events'
import { loadWrappedModule } from '../modules/modulesWrapper'
import {
  proxyAddEntity,
  proxyAttachEntityComponent,
  proxyComponentCreated,
  proxyComponentDisposed,
  proxyComponentUpdated,
  proxyHandleTick,
  proxyRemoveEntity,
  proxyRemoveEntityComponent,
  proxySetParent,
  proxyUpdateEntityComponent
} from './../ecs6/proxy'
import { AdaptationLayerState } from './../types'

import { engine } from '@dcl/ecs'

type AdaptionLayerType = {
  decentralandInterface: DecentralandInterface
  forceUpdate: (dt: number) => void
  flushEvents: () => void
}

export namespace AdaptionLayer {
  const state: AdaptationLayerState = {
    onUpdateFunctions: [],
    onStartFunctions: [],
    onEventFunctions: [],
    subscribedEvents: new Set<string>(),
    ecs7: {
      entities: {},
      components: {}
    },

    ecs6: {
      entities: {},
      componentsWithId: {},
      events: []
    },

    loadedModules: {},

    developerMode: false
  }

  // ECS6 core
  function attachEntityComponent(entityId: string, componentName: string, id: string): void {
    proxyAttachEntityComponent(state, entityId, componentName, id)
  }

  function removeEntityComponent(entityId: string, componentName: string): void {
    proxyRemoveEntityComponent(state, entityId, componentName)
  }

  function addEntity(entityId: EntityID): void {
    proxyAddEntity(state, entityId)
  }

  function setParent(entityId: string, parentId: string): void {
    proxySetParent(state, entityId, parentId)
  }

  function removeEntity(entityId: EntityID): void {
    proxyRemoveEntity(state, entityId)
  }

  function componentCreated(id: string, componentName: string, classId: number) {
    proxyComponentCreated(state, id, componentName, classId)
  }

  function componentDisposed(id: string) {
    proxyComponentDisposed(state, id)
  }

  function componentUpdated(id: string, json: string) {
    proxyComponentUpdated(state, id, json)
  }

  function updateEntityComponent(entityId: string, componentName: string, classId: number, json: string): void {
    proxyUpdateEntityComponent(state, entityId, componentName, classId, json)
  }

  // Actions
  function openExternalUrl(url: string) {}
  function openNFTDialog(assetContractAddress: string, tokenId: string, comment: string | null) {}

  // Events
  function query(queryType: any, payload: any) {}
  function subscribe(eventName: string): void {
    state.subscribedEvents.add(eventName)
  }
  function unsubscribe(eventName: string): void {
    state.subscribedEvents.delete(eventName)
  }

  // Callbacks
  function onUpdate(cb: (deltaTime: number) => void): void {
    state.onUpdateFunctions.push(cb)
  }
  function onEvent(cb: (event: any) => void): void {
    state.onEventFunctions.push(cb)
  }
  function onStart(cb: () => void) {
    state.onStartFunctions.push(cb)
  }

  // Logging
  function error(message: string, data: Error) {
    console.error(message, data)
  }
  function log(...args: any[]) {
    console.log(...args)
  }

  // RPC
  async function loadModule(moduleName: string) {
    const wrappedModule = await loadWrappedModule(moduleName)
    state.loadedModules[wrappedModule.rpcHandle] = wrappedModule
    
    return wrappedModule
  }
  async function callRpc(rpcHandle: string, methodName: string, args: any[]) {
    const module = state.loadedModules[rpcHandle]
    if (module) {
      const implementation = module.implementation
      const res = await implementation[methodName](...args)
      return res
    }
    throw new Error(`Module not loaded rpcHandle=${rpcHandle} methodName=${methodName}`)
  }

  function flushEvents() {
    proxyHandleTick(state)
    updateEventSystem(state)

    if (state.developerMode) {
      printState(state)
    }
  }

  function onLegacyUpdate(dt: number) {
    for (const cb of state.onUpdateFunctions) {
      try {
        cb(dt)
      } catch (err: any) {
        error('Error onLegacyUpdate', err)
      }
    }
    flushEvents()
  }

  export function createAdaptionLayer(developerMode: boolean): AdaptionLayerType {
    state.developerMode = developerMode

    engine.addSystem(onLegacyUpdate)

    const decentralandInterface: DecentralandInterface = {
      DEBUG: true,
      updateEntityComponent,
      attachEntityComponent,
      removeEntityComponent,
      setParent,
      addEntity,
      removeEntity,
      query,
      subscribe,
      unsubscribe,
      componentCreated,
      componentDisposed,
      componentUpdated,
      log,
      openExternalUrl,
      openNFTDialog,
      onUpdate,
      onEvent,
      loadModule,
      callRpc,
      onStart,
      error
    }

    return {
      decentralandInterface,
      forceUpdate: onLegacyUpdate,
      flushEvents
    }
  }
}
