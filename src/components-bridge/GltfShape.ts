import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { ECS6State } from '../types'

import { GltfContainer } from '@dcl/ecs'
import { getColliderLayer } from './commons/utils'

export function update(state: ECS6State, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  if (payload.visible) {
    GltfContainer.createOrReplace(ecs7Entity, {
      src: payload.src,
      invisibleMeshesCollisionMask: getColliderLayer(payload)
    })
  } else {
    GltfContainer.deleteFrom(ecs7Entity)
  }
}

export function remove(state: ECS6State, ecs6EntityId: EntityID) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  GltfContainer.deleteFrom(ecs7Entity)
}
