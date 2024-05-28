import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

import { MeshRenderer, MeshCollider } from '@dcl/ecs'
import { getColliderLayer } from './commons/utils'
import { type ECS6ComponentPlaneShape } from '~system/EngineApi'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentPlaneShape
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  if (payload.visible === true) {
    let uvs: number[] = payload.uvs ?? []
    if (uvs.length === 0) {
      uvs = [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0]
    }
    uvs = [...uvs.slice(2), ...uvs.slice(0, 2)]

    MeshRenderer.setPlane(ecs7Entity, uvs)
  } else if (MeshRenderer.getOrNull(ecs7Entity) === null) {
    MeshRenderer.deleteFrom(ecs7Entity)
  }

  const colliderLayer = getColliderLayer(payload)
  if (colliderLayer != null) {
    MeshCollider.setPlane(ecs7Entity, colliderLayer)
  } else if (MeshCollider.getOrNull(ecs7Entity) === null) {
    MeshCollider.deleteFrom(ecs7Entity)
  }
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  if (MeshRenderer.getOrNull(ecs7Entity) === null) {
    MeshRenderer.deleteFrom(ecs7Entity)
  }
  if (MeshCollider.getOrNull(ecs7Entity) === null) {
    MeshCollider.deleteFrom(ecs7Entity)
  }
}

export const Ecs6PlaneShapeConvertion: ComponentAdaptation = {
  update,
  remove
}
