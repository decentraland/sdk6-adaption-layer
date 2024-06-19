import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type UiBackgroundProps,
  UiEntity,
  type JSX
} from '@dcl/sdk/react-ecs'
import {
  type ECS6ComponentUiContainerRect,
  type ECS6ComponentUiImage,
  type ECS6ComponentUiText,
  type Vector2
} from '~system/EngineApi'
import { ECS6_CLASS_ID, type AdaptationLayerState } from '../../../types'
import { convertFont, convertTexture } from '../utils'
import { type ComponentNode } from './core'
import { computeTransform } from './layout'
import { convertUiFontFromFont, textAlignFromHV } from './uiText'

import { getTextureSize } from '~system/AdaptationLayerHelper'
import { getClickHandler } from './events'

const textureSizes = new Map<string, Vector2 | null>()

export function Ecs6UiComponent(
  state: AdaptationLayerState,
  c: ComponentNode,
  parentSize: Vector2,
  zoom: number
): JSX.Element {
  switch (c.classId) {
    case ECS6_CLASS_ID.UI_CONTAINER_RECT: {
      const [uiTransform, size] = computeTransform(c.value, parentSize, zoom)
      const container = c.value as ECS6ComponentUiContainerRect
      const color = Color4.create(
        container.color?.r ?? 1.0,
        container.color?.g ?? 1.0,
        container.color?.b ?? 1.0,
        container.color?.a ?? 1.0
      )

      // TODO: thickness
      // Note: alignmentUsesSize is not used in the Web client

      return (
        <UiEntity
          key={'w' + c.__id}
          uiTransform={uiTransform}
          uiBackground={{ color }}
        >
          {c.children.map(($) => Ecs6UiComponent(state, $, size, zoom))}
        </UiEntity>
      )
    }

    case ECS6_CLASS_ID.UI_IMAGE_SHAPE: {
      const [uiTransform, size] = computeTransform(c.value, parentSize, zoom)
      const imageValue = c.value as ECS6ComponentUiImage
      const texture = convertTexture(state, imageValue.source ?? '')

      let uiBackground: UiBackgroundProps = {}
      if (texture?.tex?.$case === 'texture') {
        uiBackground = {
          texture: { src: texture.tex.texture.src },
          textureMode: 'stretch'
        }

        if (imageValue.sizeInPixels === true) {
          const lowerSrc = texture.tex.texture.src.toLowerCase()
          if (!textureSizes.has(lowerSrc)) {
            textureSizes.set(lowerSrc, null)

            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (getTextureSize) {
              getTextureSize({ src: lowerSrc })
                .then((data) => {
                  textureSizes.set(lowerSrc, {
                    x: data.size.width,
                    y: data.size.height
                  })
                })
                .catch((e) => {
                  console.error('Error getting texture size', e)
                })
            }
          } else {
            const size = textureSizes.get(lowerSrc) ?? { x: 1, y: 1 }
            if (size.x === 0) size.x = 1
            if (size.y === 0) size.y = 1

            const sX = imageValue.sourceLeft ?? 0
            const sY = imageValue.sourceTop ?? 0
            const sW = imageValue.sourceWidth ?? size.x
            const sH = imageValue.sourceHeight ?? size.y
            const uvLeft = sX / size.x
            const uvTop = 1 - sY / size.y
            const uvRight = (sX + sW) / size.x
            const uvBottom = 1 - (sY + sH) / size.y

            uiBackground.uvs = [
              uvLeft,
              uvBottom,
              uvLeft,
              uvTop,
              uvRight,
              uvTop,
              uvRight,
              uvBottom
            ]
          }
        } else {
          uiBackground.uvs = []
        }
      }

      // TODO: uvs - not used in the Web client.
      //  We need to get the size of the texture to compute them, or add a way with SDK7
      //  First option makes sense because it's up to the explorer to resize images
      //    (uvs perms independnt of texture size, more reliable)
      //  uvs would cover `sourceLeft, sourceTop, sourceWidth, sourceHeight, sizeInPixels`

      const [onMouseDown, onMouseUp] = getClickHandler(
        state,
        imageValue.onClick
      )
      return (
        <UiEntity
          key={'w' + c.__id}
          uiTransform={uiTransform}
          uiBackground={uiBackground}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          {c.children.map(($) => Ecs6UiComponent(state, $, size, zoom))}
        </UiEntity>
      )
    }

    case ECS6_CLASS_ID.UI_TEXT_SHAPE: {
      const [uiTransform, size] = computeTransform(c.value, parentSize, zoom)
      const textValue = c.value as ECS6ComponentUiText

      if (textValue.textWrapping === true) {
        uiTransform.flexWrap = 'wrap'
      }

      // TODO
      // outline and outlineColor
      // lineSpacing, lineCount
      // adaptWidth, adaptHeight
      // textWrapping
      // shadowBlur shadowOffsetX, shadowOffsetY, shadowColor

      return (
        <UiEntity
          key={'w' + c.__id}
          uiTransform={uiTransform}
          uiText={{
            textAlign: textAlignFromHV(
              textValue.hTextAlign,
              textValue.vTextAlign
            ),
            fontSize: (textValue.fontSize ?? 10) * zoom,
            font: convertUiFontFromFont(convertFont(state, textValue.font)),
            value: textValue.value ?? '',
            color: Color4.create(
              textValue.color?.r ?? 1.0,
              textValue.color?.g ?? 1.0,
              textValue.color?.b ?? 1.0,
              textValue.color?.a ?? 1.0
            ),
            outlineColor: Color4.create(
              textValue.outlineColor?.r ?? 1.0,
              textValue.outlineColor?.g ?? 1.0,
              textValue.outlineColor?.b ?? 1.0,
              textValue.outlineColor?.a ?? 1.0
            ),
            outlineWidth: textValue.outlineWidth ?? 0,
            textWrapping: textValue.textWrapping ?? false
          }}
        >
          {c.children.map(($) => Ecs6UiComponent(state, $, size, zoom))}
        </UiEntity>
      )
    }

    // TODO
    case ECS6_CLASS_ID.UI_INPUT_TEXT_SHAPE: {
      const [uiTransform, size] = computeTransform(c.value, parentSize, zoom)
      // const inputValue = c.value as ECS6ComponentUiInputText

      return (
        <UiEntity key={'w' + c.__id} uiTransform={uiTransform}>
          {c.children.map(($) => Ecs6UiComponent(state, $, size, zoom))}
        </UiEntity>
      )
    }

    case ECS6_CLASS_ID.UI_SCREEN_SPACE_SHAPE: {
      const [uiTransform, size] = computeTransform(c.value, parentSize, zoom)
      return (
        <UiEntity key={'w' + c.__id} uiTransform={uiTransform}>
          {c.children.map(($) => Ecs6UiComponent(state, $, size, zoom))}
        </UiEntity>
      )
    }

    // TODO: MISSING
    // uiContainerStack
    // uiButton
    // uiScrollRect
    // uiWorldSpaceShape
    // uiFullScreenShape

    default: {
      const [uiTransform, size] = computeTransform(c.value, parentSize, zoom)
      return (
        <UiEntity key={'w' + c.__id} uiTransform={uiTransform}>
          {c.children.map(($) => Ecs6UiComponent(state, $, size, zoom))}
        </UiEntity>
      )
    }
  }
}
