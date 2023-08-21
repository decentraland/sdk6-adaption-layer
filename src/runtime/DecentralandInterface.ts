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
import { ECS6State } from './../types'

import { engine } from '@dcl/ecs'

import * as SignedFetchModule from '~system/SignedFetch'
import * as EnvironmentApi from '~system/EnvironmentApi'

export namespace AdaptionLayer {
  const state: ECS6State = {
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
    }
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
    console.log('subscribe', eventName)
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
    console.log('loadModule', moduleName)
    switch (moduleName)
    {
      case '@decentraland/SignedFetchModule':
        return {
          methods: Object.keys(SignedFetchModule).map((e): MethodDescriptor => ({ name: e })),
          rpcHandle: 'signedFetchModule'
        }
      case '@decentraland/EnvironmentAPI':
        return {
          methods: Object.keys(EnvironmentApi).map((e): MethodDescriptor => ({ name: e })),
          rpcHandle: 'environmentApi'
        }
    }
    const emptyDescriptor: ModuleDescriptor = {
      methods: [],
      rpcHandle: 'empty'
    }

    return emptyDescriptor
  }
  async function callRpc(rpcHandle: string, methodName: string, args: any[]) {
    console.log('callRpc', rpcHandle, methodName, args)
    return dcl.callRpc(rpcHandle, methodName, args)
  }

  //let t = 0
  function onLegacyUpdate(dt: number) {
    for (const cb of state.onUpdateFunctions) {
      try {
        cb(dt)
      } catch (err: any) {
        error('Error onLegacyUpdate', err)
      }
    }
    
    proxyHandleTick(state)
    /*t += dt

    if (t > 1) {
      t = 0
      console.log({ state })
      for (const [entity, c] of engine.getEntitiesWith(MeshRenderer)) {
        console.log({ entity, c })
      }
    }*/
  }

  export async function createDecentralandInterface(): Promise<DecentralandInterface> {
    engine.addSystem(onLegacyUpdate)

    return {
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
  }
}
