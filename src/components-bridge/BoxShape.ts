import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

import { MeshRenderer, MeshCollider } from '@dcl/ecs'
import { getColliderLayer } from './commons/utils'
import { type ECS6ComponentBoxShape } from '~system/EngineApi'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentBoxShape
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  if (payload.visible === true) {
    const uvs: number[] = payload.uvs ?? []

    MeshRenderer.setBox(ecs7Entity, uvs)
  } else {
    MeshRenderer.deleteFrom(ecs7Entity)
  }

  const colliderLayer = getColliderLayer(payload)
  if (colliderLayer != null) {
    MeshCollider.setBox(ecs7Entity, colliderLayer)
  } else {
    MeshCollider.deleteFrom(ecs7Entity)
  }
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  MeshRenderer.deleteFrom(ecs7Entity)
  MeshCollider.deleteFrom(ecs7Entity)
}

export const Ecs6BoxShapeConvertion: ComponentAdaptation = {
  update,
  remove
}
