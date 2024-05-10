import {
  type ECS6ComponentAnimator,
  type ECS6ComponentAnimator_AnimationState
} from '~system/EngineApi'
import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

import { Animator, type PBAnimationState } from '@dcl/sdk/ecs'

function convertAnimationState(
  states: ECS6ComponentAnimator_AnimationState[]
): PBAnimationState[] {
  const animationStates: PBAnimationState[] = []

  for (const state of states) {
    animationStates.push({
      clip: state.clip ?? state.name ?? '',
      loop: state.looping,
      weight: state.weight,
      playing: state.playing,
      shouldReset: state.shouldReset,
      speed: state.speed
    })
  }

  return animationStates
}

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentAnimator
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  Animator.createOrReplace(ecs7Entity, {
    states: convertAnimationState(payload.states)
  })
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  Animator.deleteFrom(ecs7Entity)
}

export const Ecs6AnimationConvertion: ComponentAdaptation = {
  update,
  remove
}
