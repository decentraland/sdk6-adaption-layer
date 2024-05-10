import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

import { MeshRenderer, MeshCollider } from '@dcl/ecs'
import { getColliderLayer } from './commons/utils'
import { type ECS6ComponentCylinderShape } from '~system/EngineApi'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentCylinderShape
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  if (payload.visible === true) {
    MeshRenderer.setCylinder(
      ecs7Entity,
      payload.radiusBottom ?? 1,
      payload.radiusTop ?? 0
    )
  } else if (MeshRenderer.getOrNull(ecs7Entity) === null) {
    MeshRenderer.deleteFrom(ecs7Entity)
  }

  const colliderLayer = getColliderLayer(payload)
  if (colliderLayer != null) {
    MeshCollider.setCylinder(ecs7Entity, colliderLayer)
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

export const Ecs6CylinderShapeConvertion: ComponentAdaptation = {
  update,
  remove
}
