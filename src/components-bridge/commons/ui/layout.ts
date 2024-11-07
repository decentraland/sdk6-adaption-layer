import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import {
  type ECS6ComponentUiImage,
  type ECS6ComponentUiShape,
  type UiValue,
  type Vector2
} from '~system/EngineApi'
import { type StackContext } from './UiComponent'

export function computeTransform(
  uiShape: ECS6ComponentUiShape,
  parentSize: Vector2,
  zoom: number,
  stack?: StackContext
): [UiTransformProps, Vector2] {
  const size = computedVector2FromUiValue(
    uiShape.width,
    uiShape.height,
    stack !== undefined ? { x: 100, y: 50 } : parentSize,
    { x: 100, y: 50 }
  )
  const offsetPosition = computedVector2FromUiValue(
    uiShape.positionX,
    uiShape.positionY,
    parentSize,
    { x: 0, y: 0 }
  )
  const position =
    stack !== undefined
      ? stack.offset
      : computedVector2FromAlign(
          uiShape.hAlign,
          uiShape.vAlign,
          size,
          parentSize
        )

  const computedPosition = {
    x: position.x + offsetPosition.x,
    y: position.y - offsetPosition.y
  }

  // Padding
  {
    const shapeImage = uiShape as ECS6ComponentUiImage
    if (shapeImage.paddingTop !== undefined) {
      computedPosition.y += Math.min(size.y, shapeImage.paddingTop)
      size.y -= shapeImage.paddingTop
    }
    if (shapeImage.paddingLeft !== undefined) {
      computedPosition.x += Math.min(size.y, shapeImage.paddingLeft)
      size.x -= shapeImage.paddingLeft
    }
    if (shapeImage.paddingRight !== undefined) {
      size.x -= shapeImage.paddingRight
    }
    if (shapeImage.paddingBottom !== undefined) {
      size.y -= shapeImage.paddingBottom
    }
  }

  return [
    {
      display: uiShape.visible === false ? 'none' : 'flex',
      positionType: 'absolute',
      position: {
        left: computedPosition.x * zoom,
        top: computedPosition.y * zoom
      },
      width: (size.x >= 0 ? size.x : 0) * zoom,
      height: (size.y >= 0 ? size.y : 0) * zoom,
      opacity: uiShape.opacity ?? 1.0
    },
    size
  ]
}

function computedVector2FromUiValue(
  width: UiValue | undefined,
  height: UiValue | undefined,
  parentSize: Vector2,
  initialValue: Vector2
): Vector2 {
  if (width?.value !== undefined && width?.type !== undefined) {
    if (width?.type === 0) {
      initialValue.x = parentSize.x * (width.value / 100.0)
    } else {
      initialValue.x = width.value
    }
  }

  if (height?.value !== undefined && height?.type !== undefined) {
    if (height?.type === 0) {
      initialValue.y = parentSize.y * (height.value / 100.0)
    } else {
      initialValue.y = height.value
    }
  }
  return initialValue
}

function computedVector2FromAlign(
  hAlign: string | undefined,
  vAlign: string | undefined,
  selfSize: Vector2,
  parentSize: Vector2
): Vector2 {
  const retVec = { x: 100, y: 50 } satisfies Vector2

  if (hAlign === 'left') {
    retVec.x = 0
  } else if (hAlign === 'right') {
    retVec.x = parentSize.x - selfSize.x
  } else {
    retVec.x = parentSize.x / 2 - selfSize.x / 2
  }

  if (vAlign === 'top') {
    retVec.y = 0
  } else if (vAlign === 'bottom') {
    retVec.y = parentSize.y - selfSize.y
  } else {
    retVec.y = parentSize.y / 2 - selfSize.y / 2
  }

  return retVec
}
