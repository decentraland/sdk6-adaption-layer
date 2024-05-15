import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type UiBackgroundProps, UiEntity, type JSX } from '@dcl/sdk/react-ecs'
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

import { getTextureSize } from '~system/EngineApi'
import { getClickHandler } from './events'

declare module '~system/EngineApi' {
  function getTextureSize(body: { src: string }) : Promise<{ src: string, size: { width: number, height: number}}>
}

const textureSizes = new Map<string, Vector2 | null>()

export function Ecs6UiComponent(
  state: AdaptationLayerState,
  c: ComponentNode,
  parentSize: Vector2
): JSX.Element {
  const [uiTransform, size] = computeTransform(c.value, parentSize)

  switch (c.classId) {
    case ECS6_CLASS_ID.UI_CONTAINER_RECT: {
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
          {c.children.map(($) => Ecs6UiComponent(state, $, size))}
        </UiEntity>
      )
    }

    case ECS6_CLASS_ID.UI_IMAGE_SHAPE: {
      const imageValue = c.value as ECS6ComponentUiImage
      const texture = convertTexture(state, imageValue.source ?? '')
      
      let uiBackground: UiBackgroundProps = {}
      if (texture?.tex?.$case === 'texture') {
        uiBackground = { texture: { src: texture.tex.texture.src }, textureMode: 'stretch' }

        if (imageValue.sizeInPixels === true) {
          const lowerSrc = texture.tex.texture.src.toLowerCase()
          if (!textureSizes.has(lowerSrc)) {
            textureSizes.set(lowerSrc, null)

            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (getTextureSize) {

              getTextureSize({ src: lowerSrc }).then((data) => {
                textureSizes.set(lowerSrc, { x: data.size.width, y: data.size.height } )
              }).catch((e) => {
                console.error('Error getting texture size', e)
              })
            }
          } else{ 
            const size = textureSizes.get(lowerSrc) ?? { x: 1, y: 1 }         
            if (size.x === 0) size.x = 1
            if (size.y === 0) size.y = 1

            const sourceLeft = (imageValue.sourceLeft ?? 0) / size.x
            const sourceTop = (imageValue.sourceTop ?? 0) / size.y
            const sourceWidth = imageValue.sourceWidth !== undefined ? (sourceLeft + imageValue.sourceWidth) / size.x : 1.0
            const sourceHeight = imageValue.sourceHeight !== undefined ? (sourceTop + imageValue.sourceHeight) / size.y : 1.0
            uiBackground.uvs = [
              sourceLeft, sourceHeight,
              sourceLeft, sourceTop,
              sourceWidth, sourceTop,
              sourceWidth, sourceHeight
            ]
            uiBackground.textureMode = 'stretch'
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

      const [onMouseDown, onMouseUp]  = getClickHandler(state, imageValue.onClick)
      return (
        <UiEntity
          key={'w' + c.__id}
          uiTransform={uiTransform}
          uiBackground={uiBackground}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          {c.children.map(($) => Ecs6UiComponent(state, $, size))}
        </UiEntity>
      )
    }

    case ECS6_CLASS_ID.UI_TEXT_SHAPE: {
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
            fontSize: (textValue.fontSize?? 10) * 1.6,
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
          }}
        >
          {c.children.map(($) => Ecs6UiComponent(state, $, size))}
        </UiEntity>
      )
    }

    // TODO
    case ECS6_CLASS_ID.UI_INPUT_TEXT_SHAPE: {
      // const inputValue = c.value as ECS6ComponentUiInputText
    
      return (
        <UiEntity key={'w' + c.__id} uiTransform={uiTransform}>
          {c.children.map(($) => Ecs6UiComponent(state, $, size))}
        </UiEntity>
      )
    }

    case ECS6_CLASS_ID.UI_SCREEN_SPACE_SHAPE: {
      return (
        <UiEntity key={'w' + c.__id} uiTransform={uiTransform}>
          {c.children.map(($) => Ecs6UiComponent(state, $, size))}
        </UiEntity>
      )
    }

    // TODO: MISSING
    // uiContainerStack
    // uiButton
    // uiScrollRect
    // uiWorldSpaceShape
    // uiFullScreenShape

    default:
      return (
        <UiEntity key={'w' + c.__id} uiTransform={uiTransform}>
          {c.children.map(($) => Ecs6UiComponent(state, $, size))}
        </UiEntity>
      )
  }
}