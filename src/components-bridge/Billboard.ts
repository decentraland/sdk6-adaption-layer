import { type ECS6ComponentBillboard } from '~system/EngineApi'
import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'
import { Billboard, BillboardMode } from '@dcl/sdk/ecs'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentBillboard
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  let billboardMode: number = 0
  if (
    payload.x === undefined &&
    payload.y === undefined &&
    payload.z === undefined
  ) {
    billboardMode = BillboardMode.BM_ALL
  } else {
    let compountMode: number = 0
    if (payload.x === true) {
      compountMode |= BillboardMode.BM_X
    }
    if (payload.y === true) {
      compountMode |= BillboardMode.BM_Y
    }
    if (payload.z === true) {
      compountMode |= BillboardMode.BM_Z
    }
    billboardMode = compountMode
  }

  Billboard.createOrReplace(ecs7Entity, {
    billboardMode
  })
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  Billboard.deleteFrom(ecs7Entity)
}

export const Ecs6BillboardConvertion: ComponentAdaptation = {
  update,
  remove
}
