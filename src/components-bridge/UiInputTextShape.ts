import { type ECS6ComponentUiInputText } from '~system/EngineApi'
import { ECS6_CLASS_ID, type AdaptationLayerState } from '../types'
import { updateComponent } from './commons/ui/core'

export function update(
  state: AdaptationLayerState,
  cid: string,
  payload: ECS6ComponentUiInputText
): void {
  updateComponent(cid, ECS6_CLASS_ID.UI_INPUT_TEXT_SHAPE, payload)
}

export const Ecs6UiInputTextShapeConvertion = {
  update
}
