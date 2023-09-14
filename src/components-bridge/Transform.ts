import { sdk7EnsureEntity, sdk7EnsureMutable } from '../ecs7/ecs7'
import { AdaptationLayerState } from '../types'

import { Transform } from '@dcl/ecs'

export function update(state: AdaptationLayerState, ecs6EntityId: EntityID, payload: any) {
  const transform = sdk7EnsureMutable(state, Transform, ecs6EntityId)
  transform.position!.x = payload.position.x
  transform.position!.y = payload.position.y
  transform.position!.z = payload.position.z
  transform.scale!.x = payload.scale.x
  transform.scale!.y = payload.scale.y
  transform.scale!.z = payload.scale.z
  transform.rotation!.x = payload.rotation.x
  transform.rotation!.y = payload.rotation.y
  transform.rotation!.z = payload.rotation.z
  transform.rotation!.w = payload.rotation.w
}

export function remove(state: AdaptationLayerState, ecs6EntityId: EntityID) {
  Transform.deleteFrom(sdk7EnsureEntity(state, ecs6EntityId))
}
