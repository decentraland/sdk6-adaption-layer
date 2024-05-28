import { type ECS6ComponentUiScreenSpaceShape } from '~system/EngineApi'
import { type AdaptationLayerState, ECS6_CLASS_ID } from '../types'
import { updateComponent } from './commons/ui/core'

export function update(
  state: AdaptationLayerState,
  cid: string,
  payload: ECS6ComponentUiScreenSpaceShape
): void {
  updateComponent(cid, ECS6_CLASS_ID.UI_SCREEN_SPACE_SHAPE, payload)
}

export const Ecs6UiScreenSpaceConvertion = {
  update
}
