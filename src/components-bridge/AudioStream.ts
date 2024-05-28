import { type ECS6ComponentAudioStream } from '~system/EngineApi'
import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'
import { AudioStream } from '@dcl/sdk/ecs'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentAudioStream
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  AudioStream.createOrReplace(ecs7Entity, {
    url: payload.url ?? '',
    volume: payload.volume ?? 1.0,
    playing: payload.playing ?? true
  })
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  AudioStream.deleteFrom(ecs7Entity)
}

export const Ecs6AudioStreamConvertion: ComponentAdaptation = {
  update,
  remove
}
