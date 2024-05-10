import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { type AdaptationLayerState, type ComponentAdaptation } from '../types'

import { NftShape, MeshCollider } from '@dcl/ecs'
import { getColliderLayer } from './commons/utils'
import { type ECS6ComponentNftShape } from '~system/EngineApi'

function convertNftSrcToUrn(src: string): string {
  src = src.substring('ethereum://'.length)
  src = src.replace('/', ':')
  return `urn:decentraland:ethereum:erc721:${src}`
}

function update(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  payload: ECS6ComponentNftShape
): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  if (payload.visible === true) {
    NftShape.createOrReplace(ecs7Entity, {
      urn: convertNftSrcToUrn(payload.src ?? ''),
      color: payload.color,
      style: payload.style as any // convert style should be mapped 1-1
    })
  } else {
    NftShape.deleteFrom(ecs7Entity)
  }

  const colliderLayer = getColliderLayer(payload)
  if (colliderLayer != null) {
    MeshCollider.setPlane(ecs7Entity, colliderLayer)
  } else {
    MeshCollider.deleteFrom(ecs7Entity)
  }
}

function remove(state: AdaptationLayerState, ecs6EntityId: EntityID): void {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  NftShape.deleteFrom(ecs7Entity)
}

export const Ecs6NftShapeConvertion: ComponentAdaptation = {
  update,
  remove
}
