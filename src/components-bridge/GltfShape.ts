import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

import { GltfContainer } from '@dcl/ecs'
import { getColliderLayer } from './commons/utils'
import { type ECS6ComponentGltfShape } from '~system/EngineApi'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentGltfShape
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  if (payload.visible === true) {
    GltfContainer.createOrReplace(ecs7Entity, {
      src: payload.src ?? '',
      invisibleMeshesCollisionMask: getColliderLayer(payload)
    })
  } else {
    GltfContainer.deleteFrom(ecs7Entity)
  }
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  GltfContainer.deleteFrom(ecs7Entity)
}

export const Ecs6GltfShapeConvertion: ComponentAdaptation = {
  update,
  remove
}
