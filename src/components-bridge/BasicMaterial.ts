import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { AdaptationLayerState } from '../types'

import { Material } from '@dcl/ecs'
import { convertTexture } from './commons/utils'

export function update(state: AdaptationLayerState, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  Material.setBasicMaterial(ecs7Entity, {
    texture: convertTexture(state, payload.albedoTexture),
    alphaTest: payload.alphaTest,
    castShadows: payload.castShadows,
  })
}

export function remove(state: AdaptationLayerState, ecs6EntityId: EntityID) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  if (Material.getOrNull(ecs7Entity)) {
    Material.deleteFrom(ecs7Entity)
  }
}
