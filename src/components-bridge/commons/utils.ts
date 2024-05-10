import {
  ColliderLayer,
  InputAction,
  Material,
  TextureWrapMode,
  type TextureUnion
} from '@dcl/ecs'

import {
  ECS6_ActionButton,
  ECS6_CLASS_ID,
  type AdaptationLayerState
} from '../../types'
import { Font } from '@dcl/sdk/ecs'
import { type ECS6ComponentFont } from '~system/EngineApi'

export function getColliderLayer(payload: any): number | undefined {
  if (
    payload.isPointerBlocker !== undefined ||
    payload.withCollisions !== undefined
  ) {
    let colliderLayer: ColliderLayer = ColliderLayer.CL_NONE
    if (payload.isPointerBlocker !== undefined)
      colliderLayer |= ColliderLayer.CL_POINTER
    if (payload.withCollisions !== undefined)
      colliderLayer |= ColliderLayer.CL_PHYSICS
    return colliderLayer
  }

  return undefined
}

export function convertWrapMode(
  ecs6WrapMode: number | undefined
): TextureWrapMode | undefined {
  if (ecs6WrapMode !== undefined) {
    switch (ecs6WrapMode) {
      case 0:
        return TextureWrapMode.TWM_CLAMP
      case 1:
        return TextureWrapMode.TWM_REPEAT
      case 2:
        return TextureWrapMode.TWM_MIRROR
    }
  }
  return undefined
}

export function convertTexture(
  state: AdaptationLayerState,
  textureEntityId: any
): TextureUnion | undefined {
  if (textureEntityId !== undefined) {
    const textureData = state.ecs7.components[textureEntityId]
    const texturePayload = textureData.data
    switch (textureData.classId) {
      case ECS6_CLASS_ID.TEXTURE:
        return Material.Texture.Common({
          src: texturePayload.src,
          filterMode: texturePayload.samplingMode,
          wrapMode: convertWrapMode(texturePayload.wrap)
        })
      case ECS6_CLASS_ID.AVATAR_TEXTURE:
        return Material.Texture.Avatar({
          userId: texturePayload.userId,
          filterMode: texturePayload.samplingMode,
          wrapMode: convertWrapMode(texturePayload.wrap)
        })
      // TODO: Implement VideoTexture
    }
  }
  return undefined
}

export function convertInputAction(action: string | undefined): InputAction {
  switch (action) {
    case ECS6_ActionButton.POINTER:
      return InputAction.IA_POINTER
    case ECS6_ActionButton.PRIMARY:
      return InputAction.IA_PRIMARY
    case ECS6_ActionButton.SECONDARY:
      return InputAction.IA_SECONDARY
    case ECS6_ActionButton.ANY:
      return InputAction.IA_ANY
    case ECS6_ActionButton.FORWARD:
      return InputAction.IA_FORWARD
    case ECS6_ActionButton.BACKWARD:
      return InputAction.IA_BACKWARD
    case ECS6_ActionButton.RIGHT:
      return InputAction.IA_RIGHT
    case ECS6_ActionButton.LEFT:
      return InputAction.IA_LEFT
    case ECS6_ActionButton.JUMP:
      return InputAction.IA_JUMP
    case ECS6_ActionButton.WALK:
      return InputAction.IA_WALK
    case ECS6_ActionButton.ACTION_3:
      return InputAction.IA_ACTION_3
    case ECS6_ActionButton.ACTION_4:
      return InputAction.IA_ACTION_4
    case ECS6_ActionButton.ACTION_5:
      return InputAction.IA_ACTION_5
    case ECS6_ActionButton.ACTION_6:
      return InputAction.IA_ACTION_6
    default:
      return InputAction.IA_ANY
  }
}

export function convertFont(
  state: AdaptationLayerState,
  fontEntityId: any
): Font | undefined {
  if (fontEntityId !== undefined) {
    const fontData = state.ecs7.components[fontEntityId]
    const fontPayload: ECS6ComponentFont = fontData.data
    switch (fontPayload.src) {
      case 'builtin:SF-UI-Text-Regular SDF':
      case 'SansSerif':
        return Font.F_SANS_SERIF

      case 'builtin:SF-UI-Text-Heavy SDF':
      case 'SansSerif_Heavy':
        return Font.F_SANS_SERIF

      case 'builtin:SF-UI-Text-Semibold SDF':
      case 'SansSerif_SemiBold':
        return Font.F_SANS_SERIF

      case 'builtin:LiberationSans SDF':
        return Font.F_SANS_SERIF

      case 'SansSerif_Bold':
        return Font.F_SANS_SERIF

      default:
        return Font.F_SANS_SERIF
    }
  }
  return undefined
}
