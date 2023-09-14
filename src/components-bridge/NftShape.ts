import { sdk7EnsureEntity } from '../ecs7/ecs7'
import { AdaptationLayerState } from '../types'

import { NftShape, MeshCollider } from '@dcl/ecs'
import { getColliderLayer } from './commons/utils'

function convertNftSrcToUrn(src: string): string {
    src = src.substring('ethereum://'.length)
    src = src.replace('/', ':')
    return `urn:decentraland:ethereum:erc721:${src}`
}

export function update(state: AdaptationLayerState, ecs6EntityId: EntityID, payload: any) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)

  if (payload.visible) {
    NftShape.createOrReplace(ecs7Entity, {
        urn: convertNftSrcToUrn(payload.src),
        color: payload.color,
        style: payload.style
    })
  } else {
    NftShape.deleteFrom(ecs7Entity)
  }

  const colliderLayer = getColliderLayer(payload)
  if (colliderLayer) {
    MeshCollider.setPlane(ecs7Entity, colliderLayer)
  } else {
    MeshCollider.deleteFrom(ecs7Entity)
  }
}

export function remove(state: AdaptationLayerState, ecs6EntityId: EntityID) {
  const ecs7Entity = sdk7EnsureEntity(state, ecs6EntityId)
  NftShape.deleteFrom(ecs7Entity)
}
