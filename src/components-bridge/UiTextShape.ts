import { type ECS6ComponentUiText } from '~system/EngineApi'
import { type AdaptationLayerState, ECS6_CLASS_ID } from '../types'
import { updateComponent } from './commons/ui/core'

export function update(
  state: AdaptationLayerState,
  cid: string,
  payload: ECS6ComponentUiText
): void {
  updateComponent(cid, ECS6_CLASS_ID.UI_TEXT_SHAPE, payload)
}

export const Ecs6UiTextShapeConvertion = {
  update
}
