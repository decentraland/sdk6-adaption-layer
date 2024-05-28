import { type ECS6ComponentTransform } from '~system/EngineApi'
import { sdk7EnsureEntity, sdk7EnsureMutable } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

import { Transform } from '@dcl/ecs'
import { type TransformType } from '@dcl/sdk/ecs'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentTransform
): void {
  const transform = sdk7EnsureMutable(
    state,
    Transform,
    ecs6EntityId
  ) as TransformType
  transform.position.x = payload.position?.x ?? 0
  transform.position.y = payload.position?.y ?? 0
  transform.position.z = payload.position?.z ?? 0
  transform.scale.x = payload.scale?.x ?? 1
  transform.scale.y = payload.scale?.y ?? 1
  transform.scale.z = payload.scale?.z ?? 1
  transform.rotation.x = payload.rotation?.x ?? 0
  transform.rotation.y = payload.rotation?.y ?? 0
  transform.rotation.z = payload.rotation?.z ?? 0
  transform.rotation.w = payload.rotation?.w ?? 1
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  Transform.deleteFrom(sdk7EnsureEntity(state, ecs6EntityId))
}

export const Ecs6TransformConvertion: ComponentAdaptation = {
  update,
  remove
}
