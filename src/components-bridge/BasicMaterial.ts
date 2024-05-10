import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

import { Material } from '@dcl/ecs'
import { convertTexture } from './commons/utils'
import { type ECS6ComponentBasicMaterial } from '~system/EngineApi'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentBasicMaterial
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  Material.setBasicMaterial(ecs7Entity, {
    texture: convertTexture(state, payload.texture),
    alphaTest: payload.alphaTest,
    castShadows: payload.castShadows
  })
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  if (Material.getOrNull(ecs7Entity) !== null) {
    Material.deleteFrom(ecs7Entity)
  }
}

export const Ecs6BasicMaterialConvertion: ComponentAdaptation = {
  update,
  remove
}
