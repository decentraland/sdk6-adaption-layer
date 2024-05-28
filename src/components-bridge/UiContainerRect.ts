import { type ECS6ComponentUiContainerRect } from '~system/EngineApi'
import { type AdaptationLayerState, ECS6_CLASS_ID } from '../types'
import { updateComponent } from './commons/ui/core'

export function update(
  state: AdaptationLayerState,
  cid: string,
  payload: ECS6ComponentUiContainerRect
): void {
  updateComponent(cid, ECS6_CLASS_ID.UI_CONTAINER_RECT, payload)
}

export const Ecs6UiContainerRectConvertion = {
  update
}
