import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { AdaptationLayerState } from '../types'

import { MeshRenderer, MeshCollider } from '@dcl/ecs'
import { getColliderLayer } from './commons/utils'

export function update(state: AdaptationLayerState, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  if (payload.visible) {
    const uvs: number[] = payload.uvs || []

    MeshRenderer.setBox(ecs7Entity, uvs)
  } else {
    MeshRenderer.deleteFrom(ecs7Entity)
  }

  const colliderLayer = getColliderLayer(payload)
  if (colliderLayer) {
    MeshCollider.setBox(ecs7Entity, colliderLayer)
  } else {
    MeshCollider.deleteFrom(ecs7Entity)
  }
}

export function remove(state: AdaptationLayerState, ecs6EntityId: EntityID) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  MeshRenderer.deleteFrom(ecs7Entity)
  MeshCollider.deleteFrom(ecs7Entity)
}
