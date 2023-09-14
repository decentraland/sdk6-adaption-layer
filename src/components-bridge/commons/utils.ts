import { ColliderLayer, Material, TextureUnion, TextureWrapMode, InputAction } from '@dcl/ecs'

import { AdaptationLayerState, ECS6_ActionButton, ECS6_CLASS_ID } from '../../types'

export function getColliderLayer(payload: any) {
  if (payload.isPointerBlocker || payload.withCollisions) {
    let colliderLayer: ColliderLayer = ColliderLayer.CL_NONE
    if (payload.isPointerBlocker) colliderLayer |= ColliderLayer.CL_POINTER
    if (payload.withCollisions) colliderLayer |= ColliderLayer.CL_PHYSICS
    return colliderLayer
  }

  return undefined
}

export function convertWrapMode(ecs6WrapMode: number | undefined): TextureWrapMode | undefined {
  if (ecs6WrapMode) {
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

export function convertTexture(state: AdaptationLayerState, textureEntityId: any): TextureUnion | undefined {
  if (textureEntityId) {
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

export function convertInputAction(action: ECS6_ActionButton | undefined) {
  if (!action) return undefined

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
  }
}
