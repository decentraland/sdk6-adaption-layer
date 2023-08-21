import { ComponentAdaptation, ECS6State, ECS6_CLASS_ID } from '../types'

import * as Ecs6Transform from '../components-bridge/Transform'
import * as Ecs6BoxShape from '../components-bridge/BoxShape'
import * as Ecs6CylinderShape from '../components-bridge/CylinderShape'
import * as Ecs6PlaneShape from '../components-bridge/PlaneShape'
import * as Ecs6Material from '../components-bridge/Material'
import * as Ecs6BasicMaterial from '../components-bridge/BasicMaterial'
import * as Ecs6GltfShape from '../components-bridge/GltfShape'
import * as Ecs6UuidCallback from '../components-bridge/UuidCallback'

const componentUpdates: Map<ECS6_CLASS_ID, ComponentAdaptation> = new Map([
  [ECS6_CLASS_ID.TRANSFORM, Ecs6Transform],
  [ECS6_CLASS_ID.BOX_SHAPE, Ecs6BoxShape],
  [ECS6_CLASS_ID.CYLINDER_SHAPE, Ecs6CylinderShape],
  [ECS6_CLASS_ID.PLANE_SHAPE, Ecs6PlaneShape],
  [ECS6_CLASS_ID.PBR_MATERIAL, Ecs6Material],
  [ECS6_CLASS_ID.BASIC_MATERIAL, Ecs6BasicMaterial],
  [ECS6_CLASS_ID.GLTF_SHAPE, Ecs6GltfShape],
  [ECS6_CLASS_ID.UUID_CALLBACK, Ecs6UuidCallback],
])

export function ecs7DeleteComponent(state: ECS6State, ecs6EntityId: EntityID, ecs6ClassId: number): void {
  console.log('Delete Component', ecs6ClassId)
  const deleteFn = componentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.remove
  if (deleteFn) {
    deleteFn(state, ecs6EntityId)
  }
}

export function ecs7UpdateComponent(state: ECS6State, ecs6EntityId: EntityID, ecs6ClassId: number, payload: any): void {
  console.log('Update Component', ecs6ClassId)
  const updateFn = componentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.update
  if (updateFn) {
    updateFn(state, ecs6EntityId, payload)
  }
}
