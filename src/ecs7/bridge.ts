import { ComponentAdaptation, AdaptationLayerState, ECS6_CLASS_ID } from '../types'

import * as Ecs6Transform from '../components-bridge/Transform'
import * as Ecs6BoxShape from '../components-bridge/BoxShape'
import * as Ecs6CylinderShape from '../components-bridge/CylinderShape'
import * as Ecs6PlaneShape from '../components-bridge/PlaneShape'
import * as Ecs6Material from '../components-bridge/Material'
import * as Ecs6BasicMaterial from '../components-bridge/BasicMaterial'
import * as Ecs6GltfShape from '../components-bridge/GltfShape'
import * as Ecs6NftShape from '../components-bridge/NftShape'
import * as Ecs6UuidCallback from '../components-bridge/UuidCallback'
import * as Ecs6Animation from '../components-bridge/Animation'
import * as Ecs6AudioStream from '../components-bridge/AudioStream'

const componentUpdates: Map<ECS6_CLASS_ID, ComponentAdaptation> = new Map([
  [ECS6_CLASS_ID.TRANSFORM, Ecs6Transform],
  [ECS6_CLASS_ID.BOX_SHAPE, Ecs6BoxShape],
  [ECS6_CLASS_ID.CYLINDER_SHAPE, Ecs6CylinderShape],
  [ECS6_CLASS_ID.PLANE_SHAPE, Ecs6PlaneShape],
  [ECS6_CLASS_ID.PBR_MATERIAL, Ecs6Material],
  [ECS6_CLASS_ID.BASIC_MATERIAL, Ecs6BasicMaterial],
  [ECS6_CLASS_ID.GLTF_SHAPE, Ecs6GltfShape],
  [ECS6_CLASS_ID.NFT_SHAPE, Ecs6NftShape],
  [ECS6_CLASS_ID.UUID_CALLBACK, Ecs6UuidCallback],
  [ECS6_CLASS_ID.ANIMATION, Ecs6Animation],
  [ECS6_CLASS_ID.AUDIO_STREAM, Ecs6AudioStream],
])

export function ecs7DeleteComponent(state: AdaptationLayerState, ecs6EntityId: EntityID, ecs6ClassId: number): void {
  const deleteFn = componentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.remove
  if (deleteFn) {
    deleteFn(state, ecs6EntityId)
  }
}

export function ecs7UpdateComponent(state: AdaptationLayerState, ecs6EntityId: EntityID, ecs6ClassId: number, payload: any): void {
  const updateFn = componentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.update
  if (updateFn) {
    updateFn(state, ecs6EntityId, payload)
  }
}
