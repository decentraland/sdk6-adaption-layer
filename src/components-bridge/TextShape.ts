import { TextShape } from '@dcl/sdk/ecs'
import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

import { type ECS6ComponentTextShape } from '~system/EngineApi'
import { stringToTextAlignMode, textAlignFromHV } from './commons/ui/uiText'
import { convertFont } from './commons/utils'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentTextShape
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  const value = TextShape.getOrCreateMutable(ecs7Entity)
  value.text = payload.value ?? ''
  value.outlineWidth = payload.outlineWidth
  value.outlineColor = payload.outlineColor
  value.textColor = {
    a: payload.opacity ?? 1,
    ...(payload.color !== undefined
      ? {
          r: payload.color.r ?? 0,
          g: payload.color.g ?? 0,
          b: payload.color.b ?? 0
        }
      : { r: 1, g: 1, b: 1 })
  }
  value.fontSize = payload.fontSize
  value.font = convertFont(state, payload.font)
  value.lineSpacing = parseInt(payload.lineSpacing ?? '') ?? 0
  value.lineCount = payload.lineCount
  value.textWrapping = payload.textWrapping
  value.shadowBlur = payload.shadowBlur
  value.shadowOffsetX = payload.shadowOffsetX
  value.shadowOffsetY = payload.shadowOffsetY
  value.shadowColor = payload.shadowColor
  value.textAlign = stringToTextAlignMode(
    textAlignFromHV(payload.hTextAlign, payload.vTextAlign)
  )
  value.width = payload.width
  value.height = payload.height
  value.paddingTop = payload.paddingTop
  value.paddingRight = payload.paddingRight
  value.paddingBottom = payload.paddingBottom
  value.paddingLeft = payload.paddingLeft

  if (payload.visible === false) {
    value.text = ''
  }
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  TextShape.deleteFrom(ecs7Entity)
}

export const Ecs6TextShapeConvertion: ComponentAdaptation = {
  update,
  remove
}
