import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { AdaptationLayerState } from '../types'

import { MeshRenderer, MeshCollider } from '@dcl/ecs'
import { getColliderLayer } from './commons/utils'

export function update(state: AdaptationLayerState, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  if (payload.visible) {
    MeshRenderer.setCylinder(ecs7Entity, payload.radiusBottom || 1, payload.radiusTop || 0)
  } else if (MeshRenderer.getOrNull(ecs7Entity)) {
    MeshRenderer.deleteFrom(ecs7Entity)
  }

  const colliderLayer = getColliderLayer(payload)
  if (colliderLayer) {
    MeshCollider.setCylinder(ecs7Entity, colliderLayer)
  } else if (MeshCollider.getOrNull(ecs7Entity)) {
    MeshCollider.deleteFrom(ecs7Entity)
  }
}

export function remove(state: AdaptationLayerState, ecs6EntityId: EntityID) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  if (MeshRenderer.getOrNull(ecs7Entity)) {
    MeshRenderer.deleteFrom(ecs7Entity)
  }
  if (MeshCollider.getOrNull(ecs7Entity)) {
    MeshCollider.deleteFrom(ecs7Entity)
  }
}
