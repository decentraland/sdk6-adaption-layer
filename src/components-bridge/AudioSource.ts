import { type ECS6ComponentAudioSource } from '~system/EngineApi'
import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'
import { AudioSource } from '@dcl/sdk/ecs'
import { convertAudioClip } from './commons/utils'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentAudioSource
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  const audioClip = convertAudioClip(state, payload.audioClipId)
  AudioSource.createOrReplace(ecs7Entity, {
    audioClipUrl: audioClip?.url ?? '',
    volume: payload.volume ?? audioClip?.volume ?? 1.0,
    playing: payload.playing ?? true,
    loop: payload.loop ?? audioClip?.loop ?? false,
    pitch: payload.pitch ?? 1.0,
    currentTime: payload.playedAtTimestamp ?? 0.0
  })
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  AudioSource.deleteFrom(ecs7Entity)
}

export const Ecs6AudioSourceConvertion: ComponentAdaptation = {
  update,
  remove
}
