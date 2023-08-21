import { ecs7EnsureEntity, ecs7EnsureMutable } from '../ecs7/ECS7'
import { ECS6State } from '../types'

import { Transform } from '@dcl/ecs'

export function update(state: ECS6State, ecs6EntityId: EntityID, payload: any) {
  const transform = ecs7EnsureMutable(state, Transform, ecs6EntityId)
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

export function remove(state: ECS6State, ecs6EntityId: EntityID) {
  Transform.deleteFrom(ecs7EnsureEntity(state, ecs6EntityId))
}
