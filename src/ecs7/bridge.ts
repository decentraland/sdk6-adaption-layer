import {
  type ComponentAdaptation,
  type AdaptationLayerState,
  ECS6_CLASS_ID,
  type UiComponentAdaptation
} from '../types'

import { Ecs6TransformConvertion } from '../components-bridge/Transform'
import { Ecs6BoxShapeConvertion } from '../components-bridge/BoxShape'
import { Ecs6CylinderShapeConvertion } from '../components-bridge/CylinderShape'
import { Ecs6PlaneShapeConvertion } from '../components-bridge/PlaneShape'
import { Ecs6MaterialConvertion } from '../components-bridge/Material'
import { Ecs6BasicMaterialConvertion } from '../components-bridge/BasicMaterial'
import { Ecs6GltfShapeConvertion } from '../components-bridge/GltfShape'
import { Ecs6NftShapeConvertion } from '../components-bridge/NftShape'
import { Ecs6TextShapeConvertion } from '../components-bridge/TextShape'
import { Ecs6UuidCallbackConvertion } from '../components-bridge/UuidCallback'
import { Ecs6AnimationConvertion } from '../components-bridge/Animation'
import { Ecs6AudioStreamConvertion } from '../components-bridge/AudioStream'
import { Ecs6UiScreenSpaceConvertion } from '../components-bridge/UiScreenSpace'
import { Ecs6UiImageShapeConvertion } from '../components-bridge/UiImageShape'
import { Ecs6UiTextShapeConvertion } from '../components-bridge/UiTextShape'
import { Ecs6UiContainerRectConvertion } from '../components-bridge/UiContainerRect'
import { Ecs6UiInputTextShapeConvertion } from '../components-bridge/UiInputTextShape'
import { DEBUG_CONFIG } from '../debug/config'
import { Ecs6BillboardConvertion } from '../components-bridge/Billboard'
import { Ecs6AudioSourceConvertion } from '../components-bridge/AudioSource'
import { Ecs6AvatarModifierAreaConvertion } from '../components-bridge/AvatarModifierArea'
import { Ecs6CameraModeAreaConvertion } from '../components-bridge/CameraModeArea'
import { Ecs6UiContainerStackConvertion } from '../components-bridge/UiContainerStack'

const componentUpdates = new Map<ECS6_CLASS_ID, ComponentAdaptation>([
  [ECS6_CLASS_ID.TRANSFORM, Ecs6TransformConvertion],
  [ECS6_CLASS_ID.BOX_SHAPE, Ecs6BoxShapeConvertion],
  [ECS6_CLASS_ID.CYLINDER_SHAPE, Ecs6CylinderShapeConvertion],
  [ECS6_CLASS_ID.PLANE_SHAPE, Ecs6PlaneShapeConvertion],
  [ECS6_CLASS_ID.PBR_MATERIAL, Ecs6MaterialConvertion],
  [ECS6_CLASS_ID.BASIC_MATERIAL, Ecs6BasicMaterialConvertion],
  [ECS6_CLASS_ID.GLTF_SHAPE, Ecs6GltfShapeConvertion],
  [ECS6_CLASS_ID.NFT_SHAPE, Ecs6NftShapeConvertion],
  [ECS6_CLASS_ID.UUID_CALLBACK, Ecs6UuidCallbackConvertion],
  [ECS6_CLASS_ID.ANIMATION, Ecs6AnimationConvertion],
  [ECS6_CLASS_ID.AUDIO_STREAM, Ecs6AudioStreamConvertion],
  [ECS6_CLASS_ID.TEXT_SHAPE, Ecs6TextShapeConvertion],
  [ECS6_CLASS_ID.BILLBOARD, Ecs6BillboardConvertion],
  [ECS6_CLASS_ID.AUDIO_SOURCE, Ecs6AudioSourceConvertion],
  [ECS6_CLASS_ID.AVATAR_MODIFIER_AREA, Ecs6AvatarModifierAreaConvertion],
  [ECS6_CLASS_ID.CAMERA_MODE_AREA, Ecs6CameraModeAreaConvertion]
])

const uiComponentUpdates = new Map<ECS6_CLASS_ID, UiComponentAdaptation>([
  [ECS6_CLASS_ID.UI_SCREEN_SPACE_SHAPE, Ecs6UiScreenSpaceConvertion],
  [ECS6_CLASS_ID.UI_TEXT_SHAPE, Ecs6UiTextShapeConvertion],
  [ECS6_CLASS_ID.UI_IMAGE_SHAPE, Ecs6UiImageShapeConvertion],
  [ECS6_CLASS_ID.UI_CONTAINER_RECT, Ecs6UiContainerRectConvertion],
  [ECS6_CLASS_ID.UI_CONTAINER_STACK, Ecs6UiContainerStackConvertion],
  [ECS6_CLASS_ID.UI_INPUT_TEXT_SHAPE, Ecs6UiInputTextShapeConvertion]
])

export function ecs7DeleteComponent(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  ecs6ClassId: number
): void {
  const deleteFn = componentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.remove
  if (deleteFn !== undefined) {
    deleteFn(state, ecs6EntityId)
  }
}

export function ecs7UpdateComponent(
  state: AdaptationLayerState,
  ecs6EntityId: EntityID,
  ecs6ClassId: number,
  payload: any
): void {
  const updateFn = componentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.update
  if (updateFn !== undefined) {
    updateFn(state, ecs6EntityId, payload)
  } else {
    if (DEBUG_CONFIG.MISSING_UPDATES)
      console.log('missing update fn', ecs6EntityId, ecs6ClassId, payload)
  }
}

export function ecs7UpdateComponentWithoutEntityId(
  state: AdaptationLayerState,
  componentId: string,
  ecs6ClassId: number,
  payload: any
): void {
  const updateFn = uiComponentUpdates.get(ecs6ClassId as ECS6_CLASS_ID)?.update
  if (updateFn !== undefined) {
    updateFn(state, componentId, payload)
  } else {
    if (DEBUG_CONFIG.MISSING_UPDATES)
      console.log(
        'missing update fn without entityId',
        componentId,
        ecs6ClassId,
        payload
      )
  }
}
