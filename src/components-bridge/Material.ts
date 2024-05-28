import { type ECS6ComponentMaterial } from '~system/EngineApi'
import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

import { Material } from '@dcl/ecs'
import { Color4 } from '@dcl/sdk/math'
import { convertTexture } from './commons/utils'

// kernel:scene: [SDK7 Scene Template]    Hello from Material {"componentName":"engine.texture","classId":68,"disposed":false,"json":"{\"src\":\"images/scene-thumbnail.png\"}"}

// function convertWrapMode(
//   ecs6WrapMode: number | undefined
// ): TextureWrapMode | undefined {
//   if (ecs6WrapMode) {
//     switch (ecs6WrapMode) {
//       case 0:
//         return TextureWrapMode.TWM_CLAMP
//       case 1:
//         return TextureWrapMode.TWM_REPEAT
//       case 2:
//         return TextureWrapMode.TWM_MIRROR
//     }
//   }
//   return undefined
// }

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentMaterial
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  Material.setPbrMaterial(ecs7Entity, {
    texture: convertTexture(state, payload.albedoTexture),
    alphaTest: payload.alphaTest,
    castShadows: payload.castShadows,
    alphaTexture: convertTexture(state, payload.alphaTexture),
    emissiveTexture: convertTexture(state, payload.emissiveTexture),
    bumpTexture: convertTexture(state, payload.bumpTexture),
    albedoColor: { ...Color4.White(), ...payload.albedoColor },
    emissiveColor: payload.emissiveColor,
    reflectivityColor: payload.reflectivityColor,
    transparencyMode: payload.transparencyMode,
    metallic: payload.metallic,
    roughness: payload.roughness,
    // glossiness: payload.microSurface, // @deprecated https://github.com/decentraland/protocol/pull/155
    specularIntensity: payload.specularIntensity,
    emissiveIntensity: payload.emissiveIntensity,
    directIntensity: payload.directIntensity
  })
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  if (Material.getOrNull(ecs7Entity) !== null) {
    Material.deleteFrom(ecs7Entity)
  }
}

export const Ecs6MaterialConvertion: ComponentAdaptation = {
  update,
  remove
}
