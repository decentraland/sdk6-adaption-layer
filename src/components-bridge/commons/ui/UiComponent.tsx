import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  UiEntity,
  type JSX,
  type UiBackgroundProps
} from '@dcl/sdk/react-ecs'
import {
  type ECS6ComponentUiContainerRect,
  type ECS6ComponentUiContainerStack,
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

export type StackContext = {
  offset: Vector2
}

export function Ecs6UiComponent(
  state: AdaptationLayerState,
  c: ComponentNode,
  parentSize: Vector2,
  zoom: number,
  stack?: StackContext
): JSX.Element {
  switch (c.classId) {
    case ECS6_CLASS_ID.UI_CONTAINER_RECT: {
      const [uiTransform, size] = computeTransform(
        c.value,
        parentSize,
        zoom,
        stack
      )
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

    case ECS6_CLASS_ID.UI_CONTAINER_STACK: {
      const [, size] = computeTransform(c.value, parentSize, zoom, stack)
      const container = c.value as ECS6ComponentUiContainerStack

      const color = Color4.create(
        container.color?.r ?? 1.0,
        container.color?.g ?? 1.0,
        container.color?.b ?? 1.0,
        container.color?.a ?? 1.0
      )

      const sizes = c.children.map((child) => {
        return computeTransform(child.value, { x: 100, y: 50 }, zoom)
      })

      const totalSize: Vector2 = { x: 0, y: 0 }
      const positions: number[] = Array.from({ length: c.children.length })
      const spacing = container.spacing ?? 0
      for (let i = 0; i < c.children.length; i++) {
        if (container.stackOrientation === 0) {
          positions[i] = totalSize.y
        } else {
          positions[i] = totalSize.x
        }

        if (container.stackOrientation === 0) {
          totalSize.x = Math.max(sizes[i][1].x, totalSize.x)
          totalSize.y += sizes[i][1].y + spacing
        } else {
          totalSize.x += sizes[i][1].x + spacing
          totalSize.y = Math.max(sizes[i][1].y, totalSize.y)
        }
      }

      if (container.adaptHeight === true) {
        c.value.width = {
          type: 1,
          value: totalSize.x
        }
      }

      if (container.adaptHeight === true) {
        c.value.height = {
          type: 1,
          value: totalSize.y
        }
      }

      const [realUiTransform] = computeTransform(
        c.value,
        parentSize,
        zoom,
        stack
      )

      const stackOrientation = container.stackOrientation ?? 0
      return (
        <UiEntity
          key={'w' + c.__id}
          uiTransform={realUiTransform}
          uiBackground={{ color }}
        >
          {c.children.map(($, index) => {
            return Ecs6UiComponent(state, $, size, zoom, {
              offset: {
                x: stackOrientation === 1 ? positions[index] : 0,
                y: stackOrientation === 0 ? positions[index] : 0
              }
            })
          })}
        </UiEntity>
      )
    }

    case ECS6_CLASS_ID.UI_IMAGE_SHAPE: {
      const [uiTransform, size] = computeTransform(
        c.value,
        parentSize,
        zoom,
        stack
      )
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
      const [uiTransform, size] = computeTransform(
        c.value,
        parentSize,
        zoom,
        stack
      )
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

      const textWrap =
        textValue.textWrapping === undefined || textValue.textWrapping
          ? 'wrap'
          : 'nowrap'

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
            value: `${textValue.value}`,
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
            textWrap
          }}
        >
          {c.children.map(($) => Ecs6UiComponent(state, $, size, zoom))}
        </UiEntity>
      )
    }

    // TODO
    case ECS6_CLASS_ID.UI_INPUT_TEXT_SHAPE: {
      const [uiTransform, size] = computeTransform(
        c.value,
        parentSize,
        zoom,
        stack
      )
      // const inputValue = c.value as ECS6ComponentUiInputText

      return (
        <UiEntity key={'w' + c.__id} uiTransform={uiTransform}>
          {c.children.map(($) => Ecs6UiComponent(state, $, size, zoom))}
        </UiEntity>
      )
    }

    case ECS6_CLASS_ID.UI_SCREEN_SPACE_SHAPE: {
      const [uiTransform, size] = computeTransform(
        c.value,
        parentSize,
        zoom,
        stack
      )
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
      const [uiTransform, size] = computeTransform(
        c.value,
        parentSize,
        zoom,
        stack
      )
      return (
        <UiEntity key={'w' + c.__id} uiTransform={uiTransform}>
          {c.children.map(($) => Ecs6UiComponent(state, $, size, zoom))}
        </UiEntity>
      )
    }
  }
}
