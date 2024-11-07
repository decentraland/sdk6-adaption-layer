import { type ECS6ComponentAvatarModifierArea } from '~system/EngineApi'
import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'
import { AvatarModifierArea, AvatarModifierType } from '@dcl/sdk/ecs'

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentAvatarModifierArea
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  const modifiers: AvatarModifierType[] = (payload.modifiers ?? [])
    .map((modifier) => {
      if (modifier === 'HIDE_AVATARS') {
        return AvatarModifierType.AMT_HIDE_AVATARS
      } else if (modifier === 'DISABLE_PASSPORTS') {
        return AvatarModifierType.AMT_DISABLE_PASSPORTS
      }
      return undefined
    })
    .filter((modifier) => modifier !== undefined)

  AvatarModifierArea.createOrReplace(ecs7Entity, {
    excludeIds: payload.excludeIds ?? [],
    modifiers,
    area: payload.area?.box
  })
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  AvatarModifierArea.deleteFrom(ecs7Entity)
}

export const Ecs6AvatarModifierAreaConvertion: ComponentAdaptation = {
  update,
  remove
}
