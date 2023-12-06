import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { AdaptationLayerState } from '../types'

import { Animator, PBAnimationState } from '@dcl/sdk/ecs'

function convertAnimationState(states: any): PBAnimationState[] {
  const animationStates: PBAnimationState[] = []

  for (const state of states) {
    animationStates.push({
      clip: state.clip,
      loop: state.looping,
      weight: state.weight,
      playing: state.playing,
      shouldReset: state.shouldReset,
      speed: state.speed,
    })
  }

  return animationStates
}

export function update(state: AdaptationLayerState, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  Animator.createOrReplace(ecs7Entity, {
    states: convertAnimationState(payload.states)
  })
}

export function remove(state: AdaptationLayerState, ecs6EntityId: EntityID) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  Animator.deleteFrom(ecs7Entity)
}
