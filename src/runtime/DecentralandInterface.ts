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
import { type AdaptationLayerState } from './../types'

import { engine } from '@dcl/ecs'
import { ReactEcsRenderer } from '@dcl/react-ecs'
import { renderEcs6Ui } from '../components-bridge/commons/ui/core'
import { CameraType } from '@dcl/sdk/ecs'
import { logMiddleware } from './LogMiddleware'
import { openExternalUrl, openNftDialog } from '~system/RestrictedActions'
import { DEBUG_CONFIG } from '../debug/config'

type AdaptionLayerType = {
  decentralandInterface: DecentralandInterface

  start: () => void

  forceUpdate: (dt: number) => void
  flushEvents: () => void
}

// only import if it's absolutely necessary
export const state: AdaptationLayerState = {
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

  developerMode: false,
  eventState: {
    lastRotationChanged: null,
    lastPositionChanged: null,
    lastCameraMode: CameraType.CT_FIRST_PERSON,
    lastIsPointerLock: false
  },

  disableUpdate: true
}

// ECS6 core
function attachEntityComponent(
  entityId: string,
  componentName: string,
  id: string
): void {
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

function componentCreated(
  id: string,
  componentName: string,
  classId: number
): void {
  proxyComponentCreated(state, id, componentName, classId)
}

function componentDisposed(id: string): void {
  proxyComponentDisposed(state, id)
}

function componentUpdated(id: string, json: string): void {
  proxyComponentUpdated(state, id, json)
}

function updateEntityComponent(
  entityId: string,
  componentName: string,
  classId: number,
  json: string
): void {
  proxyUpdateEntityComponent(state, entityId, componentName, classId, json)
}

// Actions
function sdk6OpenExternalUrl(url: string): void {
  openExternalUrl({ url }).catch(console.error)
}
function sdk6OpenNftDialog(
  assetContractAddress: string,
  tokenId: string,
  comment: string | null
): void {
  openNftDialog({
    urn: `urn:decentraland:ethereum:erc721:${assetContractAddress}:${tokenId}`
  }).catch(console.error)
}

// Events
function query(queryType: any, payload: any): void {}
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
function onStart(cb: () => void): void {
  state.onStartFunctions.push(cb)
}

// Logging
function error(message: string, data: Error): void {
  console.error(message, data)
}
function log(...args: any[]): void {
  console.log(...args)
}

// RPC
async function loadModule(moduleName: string): Promise<any> {
  if (DEBUG_CONFIG.RPC_MODULE) console.log('loadingModule', moduleName)

  const maybeModule = state.loadedModules[moduleName]
  if (maybeModule !== undefined) {
    return maybeModule
  }

  const wrappedModule = loadWrappedModule(moduleName)
  wrappedModule.rpcHandle = moduleName
  state.loadedModules[moduleName] = wrappedModule

  return wrappedModule
}

async function callRpc(
  rpcHandle: string,
  methodName: string,
  args: any[]
): Promise<any> {
  if (DEBUG_CONFIG.RPC_MODULE)
    console.log('callRpc', rpcHandle, methodName, args)

  const module = state.loadedModules[rpcHandle]
  if (module !== undefined) {
    const implementation = module.implementation
    if (implementation[methodName] !== undefined) {
      const res = await implementation[methodName](...args)
      return res
    } else {
      throw new Error(
        `Method not found rpcHandle=${rpcHandle} methodName=${methodName}`
      )
    }
  }
  throw new Error(
    `Module not loaded rpcHandle=${rpcHandle} methodName=${methodName}`
  )
}

let lastTick = Date.now()
function flushEvents(): void {
  proxyHandleTick(state)
  updateEventSystem(state)

  // Print state each 100ms
  if (Date.now() - lastTick > 1000) {
    lastTick = Date.now()
    if (DEBUG_CONFIG.STATS_1_SECOND) {
      printState(state)
    }
  }
}

function onLegacyUpdate(dt: number): void {
  if (state.disableUpdate) return

  for (const cb of state.onUpdateFunctions) {
    try {
      cb(dt)
    } catch (err: any) {
      error('Error onLegacyUpdate', err)
    }
  }
  flushEvents()
}

function start(): void {
  for (const cb of state.onStartFunctions) {
    try {
      cb()
    } catch (err: any) {
      error('Error onStart', err)
    }
  }

  state.disableUpdate = false
  if (DEBUG_CONFIG.STATS_1_SECOND)
    console.log('Adaption Layer sent start signal')
}

export function createAdaptionLayer(developerMode: boolean): AdaptionLayerType {
  state.developerMode = developerMode

  ReactEcsRenderer.setUiRenderer(renderEcs6Ui(state))
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
    openExternalUrl: sdk6OpenExternalUrl,
    openNFTDialog: sdk6OpenNftDialog,
    onUpdate,
    onEvent,
    loadModule,
    callRpc,
    onStart,
    error
  }

  return {
    decentralandInterface: DEBUG_CONFIG.LOG_MIDDLEWARE
      ? logMiddleware(decentralandInterface)
      : decentralandInterface,
    forceUpdate: onLegacyUpdate,
    flushEvents,
    start
  }
}
