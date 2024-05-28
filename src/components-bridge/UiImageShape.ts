import { type ECS6ComponentUiImage } from '~system/EngineApi'
import { type AdaptationLayerState, ECS6_CLASS_ID } from '../types'
import { updateComponent } from './commons/ui/core'

export function update(
  state: AdaptationLayerState,
  cid: string,
  payload: ECS6ComponentUiImage
): void {
  updateComponent(cid, ECS6_CLASS_ID.UI_IMAGE_SHAPE, payload)
}

export const Ecs6UiImageShapeConvertion = {
  update
}
