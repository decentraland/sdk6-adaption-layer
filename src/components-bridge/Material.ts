import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { AdaptationLayerState, ECS6_CLASS_ID } from '../types'

import { Material, TextureUnion, TextureWrapMode } from '@dcl/ecs'

// kernel:scene: [SDK7 Scene Template]    Hello from Material {"componentName":"engine.texture","classId":68,"disposed":false,"json":"{\"src\":\"images/scene-thumbnail.png\"}"}

function convertWrapMode(ecs6WrapMode: number | undefined): TextureWrapMode | undefined {
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

function convertTexture(state: AdaptationLayerState, textureEntityId: any): TextureUnion | undefined {
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

export function update(state: AdaptationLayerState, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  Material.setPbrMaterial(ecs7Entity, {
    texture: convertTexture(state, payload.albedoTexture),
    alphaTest: payload.alphaTest,
    castShadows: payload.castShadows,
    alphaTexture: convertTexture(state, payload.alphaTexture),
    emissiveTexture: convertTexture(state, payload.emissiveTexture),
    bumpTexture: convertTexture(state, payload.bumpTexture),
    albedoColor: payload.albedoColor,
    emissiveColor: payload.emissiveColor,
    reflectivityColor: payload.reflectivityColor,
    transparencyMode: payload.transparencyMode,
    metallic: payload.metallic,
    roughness: payload.roughness,
    //glossiness: payload.microSurface, // @deprecated https://github.com/decentraland/protocol/pull/155
    specularIntensity: payload.specularIntensity,
    emissiveIntensity: payload.emissiveIntensity,
    directIntensity: payload.directIntensity
  })
}

export function remove(state: AdaptationLayerState, ecs6EntityId: EntityID) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  if (Material.getOrNull(ecs7Entity)) {
    Material.deleteFrom(ecs7Entity)
  }
}
