export enum ECS6_CLASS_ID {
  TRANSFORM = 1,
  UUID_CALLBACK = 8,
  UUID_ON_CLICK = 9,
  UUID_ON_DOWN = 10,
  UUID_ON_UP = 11,
  UUID_ON_HOVER_ENTER = 12,
  UUID_ON_HOVER_EXIT = 13,

  BOX_SHAPE = 16,
  SPHERE_SHAPE = 17,
  PLANE_SHAPE = 18,
  CONE_SHAPE = 19,
  CYLINDER_SHAPE = 20,
  TEXT_SHAPE = 21,

  NFT_SHAPE = 22,
  UI_WORLD_SPACE_SHAPE = 23,
  UI_SCREEN_SPACE_SHAPE = 24,
  UI_CONTAINER_RECT = 25,
  UI_CONTAINER_STACK = 26,
  UI_TEXT_SHAPE = 27,
  UI_INPUT_TEXT_SHAPE = 28,
  UI_IMAGE_SHAPE = 29,
  UI_SLIDER_SHAPE = 30,
  CIRCLE_SHAPE = 31,
  BILLBOARD = 32,

  ANIMATION = 33,
  FONT = 34,

  UI_FULLSCREEN_SHAPE = 40, // internal fullscreen scenes
  UI_BUTTON_SHAPE = 41,

  GLTF_SHAPE = 54,
  OBJ_SHAPE = 55,
  AVATAR_SHAPE = 56,

  BASIC_MATERIAL = 64,
  PBR_MATERIAL = 65,

  HIGHLIGHT_ENTITY = 66,

  /** @deprecated Sound has been deprecataed */
  SOUND = 67,
  TEXTURE = 68,

  VIDEO_CLIP = 70,
  VIDEO_TEXTURE = 71,

  AVATAR_TEXTURE = 72,

  AUDIO_CLIP = 200,
  AUDIO_SOURCE = 201,
  AUDIO_STREAM = 202,
  GIZMOS = 203,
  SMART_ITEM = 204,
  AVATAR_MODIFIER_AREA = 205,
  AVATAR_ATTACH = 206,
  CAMERA_MODE_AREA = 207,

  // For state sync only
  NAME = 300,
  LOCKED_ON_EDIT = 301,
  VISIBLE_ON_EDIT = 302
}

export const ECS6_CLASS_ID_BYPASS = [
  ECS6_CLASS_ID.UI_WORLD_SPACE_SHAPE,
  ECS6_CLASS_ID.UI_SCREEN_SPACE_SHAPE,
  ECS6_CLASS_ID.UI_CONTAINER_RECT,
  ECS6_CLASS_ID.UI_CONTAINER_STACK,
  ECS6_CLASS_ID.UI_TEXT_SHAPE,
  ECS6_CLASS_ID.UI_INPUT_TEXT_SHAPE,
  ECS6_CLASS_ID.UI_IMAGE_SHAPE,
  ECS6_CLASS_ID.UI_SLIDER_SHAPE
]

export type Ecs6ComponentData = {
  classId?: number
  entityId?: string
  data?: any
  componentName?: string
}
import { Entity } from '@dcl/ecs'

export type AdaptationLayerState = {
  onUpdateFunctions: ((dt: number) => void)[]
  onStartFunctions: (() => void)[]
  onEventFunctions: ((event: any) => void)[]
  subscribedEvents: Set<string>

  ecs7: {
    entities: Record<string, Entity>
    components: Record<string, Ecs6ComponentData>
  }

  ecs6: {
    entities: Record<
      string,
      {
        componentsName: Record<
          string,
          {
            classId: number
            id: string
          }
        >
      }
    >

    // Components with ID
    componentsWithId: Record<
      string,
      {
        componentName: string
        classId: number
        disposed: boolean
        json: string
      }
    >

    events: EventItem[],
  }

  loadedModules: Record<string, any>,

  developerMode: boolean,
}

export type UpdateFunction = (state: AdaptationLayerState, ecs6EntityId: EntityID, payload: any) => void
export type DeleteFunction = (state: AdaptationLayerState, ecs6EntityId: EntityID) => void

export type ComponentAdaptation = {
  update: UpdateFunction
  remove: DeleteFunction
}

export type AttachEntityComponentEvent = {
  method: 'attachEntityComponent'
  data: {
    entityId: string
    componentName: string
    id: string
  }
}
export type RemoveEntityComponentEvent = {
  method: 'removeEntityComponent'
  data: {
    entityId: string
    componentName: string
  }
}
export type AddEntityEvent = {
  method: 'addEntity'
  data: {
    entityId: EntityID
  }
}
export type SetParentEvent = {
  method: 'setParent'
  data: {
    entityId: string
    parentId: string
  }
}
export type RemoveEntityEvent = {
  method: 'removeEntity'
  data: {
    entityId: EntityID
  }
}
export type ComponentCreatedEvent = {
  method: 'componentCreated'
  data: {
    id: string
    componentName: string
    classId: number
  }
}
export type ComponentDisposedEvent = {
  method: 'componentDisposed'
  data: {
    id: string
  }
}
export type ComponentUpdatedEvent = {
  method: 'componentUpdated'
  data: {
    id: string
    json: string
  }
}
export type UpdateEntityComponentEvent = {
  method: 'updateEntityComponent'
  data: {
    entityId: string
    componentName: string
    classId: number
    json: string
  }
}

export type EventItem =
  | AttachEntityComponentEvent
  | RemoveEntityComponentEvent
  | AddEntityEvent
  | SetParentEvent
  | RemoveEntityEvent
  | ComponentCreatedEvent
  | ComponentDisposedEvent
  | ComponentUpdatedEvent
  | UpdateEntityComponentEvent

export enum ECS6_ActionButton {
  POINTER = 'POINTER',
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  ANY = 'ANY',
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  JUMP = 'JUMP',
  WALK = 'WALK',
  ACTION_3 = 'ACTION_3',
  ACTION_4 = 'ACTION_4',
  ACTION_5 = 'ACTION_5',
  ACTION_6 = 'ACTION_6'
}
