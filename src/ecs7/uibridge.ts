import { AdaptationLayerState, ECS6_CLASS_ID, UIComponentAdaptation } from '../types'

import * as Ecs6UIText from '../ui-components-bridge/UIText'

const uiComponentUpdates: Map<ECS6_CLASS_ID, UIComponentAdaptation> = new Map([
  [ECS6_CLASS_ID.UI_TEXT_SHAPE, Ecs6UIText],
])

export function ecs7UIDeleteComponent(state: AdaptationLayerState, id: string, ecs6ClassId: number): void {
  const deleteFn = uiComponentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.remove
  if (deleteFn) {
    deleteFn(state, id)
  }
}

export function ecs7UIUpdateComponent(state: AdaptationLayerState, id: string, ecs6ClassId: number, payload: any): void {
  const updateFn = uiComponentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.update
  if (updateFn) {
    updateFn(state, id, payload)
  }
}
