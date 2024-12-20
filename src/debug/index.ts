import { type AdaptationLayerState } from '../types'

export function printState(state: AdaptationLayerState): void {
  console.log(`State:
    ecs6.componentsWithId: ${getObjectLength(state.ecs6.componentsWithId)}
    ecs6.entities: ${getObjectLength(state.ecs6.entities)}
    ecs6.events: ${state.ecs6.events.length}
    ecs7.entities: ${getObjectLength(state.ecs7.entities)}
    ecs7.components: ${getObjectLength(state.ecs7.components)}
    loadedModules: ${getObjectLength(state.loadedModules)}
    onUpdateFunctions: ${state.onUpdateFunctions.length}
    onEventFunctions: ${state.onEventFunctions.length}
    onStartFunctions: ${state.onStartFunctions.length}
    subscribedEvents: ${state.subscribedEvents.size}
    `)
}

function getObjectLength(object: any): number {
  return Object.keys(object).length
}
