import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { AdaptationLayerState } from '../types'
import { AudioStream } from '@dcl/sdk/ecs'

export function update(state: AdaptationLayerState, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  AudioStream.createOrReplace(ecs7Entity, {
    url: payload.url,
    volume: payload.volume || 1.0,
    playing: payload.playing || true
  })

}

export function remove(state: AdaptationLayerState, ecs6EntityId: EntityID) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  AudioStream.deleteFrom(ecs7Entity)
}
