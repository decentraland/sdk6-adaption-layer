import { ecs7EnsureEntity } from '../ecs7/ECS7'
import { ECS6State } from '../types'

import { GltfContainer } from '@dcl/ecs'
import { getColliderLayer } from './commons/utils'

export function update(state: ECS6State, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = ecs7EnsureEntity(state, ecs6EntityId)

  GltfContainer.createOrReplace(ecs7Entity, {
    src: payload.src,
    invisibleMeshesCollisionMask: getColliderLayer(payload)
  })
}

export function remove(state: ECS6State, ecs6EntityId: EntityID) {
  const ecs7Entity = ecs7EnsureEntity(state, ecs6EntityId)
  if (GltfContainer.getOrNull(ecs7Entity)) {
    GltfContainer.deleteFrom(ecs7Entity)
  }
}
