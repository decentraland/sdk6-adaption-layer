import { CameraModeArea, CameraType } from '@dcl/sdk/ecs'
import { type ECS6ComponentCameraModeArea } from '~system/EngineApi'
import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentCameraModeArea
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  let mode = CameraType.CT_THIRD_PERSON
  if (payload.cameraMode === 0) {
    mode = CameraType.CT_FIRST_PERSON
  }

  CameraModeArea.createOrReplace(ecs7Entity, {
    mode,
    area: payload.area?.box
  })
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  CameraModeArea.deleteFrom(ecs7Entity)
}

export const Ecs6CameraModeAreaConvertion: ComponentAdaptation = {
  update,
  remove
}
