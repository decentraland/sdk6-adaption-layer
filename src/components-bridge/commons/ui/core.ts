import { type ECS6ComponentUiShape } from '~system/EngineApi'
import { type AdaptationLayerState } from '../../../types'
import { renderEcs6UiRootComponent } from './UiRoot'

export type ComponentNode = {
  __id: string
  classId: number
  value: ECS6ComponentUiShape
  children: ComponentNode[]
}

const componentMap: Record<string, ComponentNode> = {}
const roots: ComponentNode[] = []
const waitingForParent: Record<string, string[]> = {}

export function updateComponent(
  componentId: string,
  classId: number,
  _baseValue: ECS6ComponentUiShape
): void {
  if (componentMap[componentId] === undefined) {
    componentMap[componentId] = {
      __id: componentId,
      classId,
      value: { ..._baseValue },
      children: []
    }

    const parentId = componentMap[componentId].value.parentComponent
    if (parentId === undefined) {
      roots.push(componentMap[componentId])
    } else {
      const parent = componentMap[parentId]
      if (parent !== undefined) {
        parent.children.push(componentMap[componentId])
      } else {
        if (waitingForParent[parentId] === undefined) {
          waitingForParent[parentId] = [componentId]
        } else {
          waitingForParent[parentId].push(componentId)
        }
      }
    }
  } else {
    const currentComponent = componentMap[componentId]
    // Reparenting
    if (currentComponent.value.parentComponent !== _baseValue.parentComponent) {
      const oldParentId = componentMap[componentId].value.parentComponent
      if (oldParentId !== undefined) {
        const oldParent = componentMap[oldParentId]
        if (oldParent !== undefined) {
          oldParent.children = oldParent.children.filter(
            (c) => c.__id !== componentId
          )
        }
      }

      const newParentId = _baseValue.parentComponent
      if (newParentId !== undefined) {
        const newParent = componentMap[newParentId]
        if (newParent !== undefined) {
          newParent.children.push(currentComponent)
        } else {
          if (waitingForParent[newParentId] === undefined) {
            waitingForParent[newParentId] = [componentId]
          } else {
            waitingForParent[newParentId].push(componentId)
          }
        }
      }
    }

    currentComponent.value = { ..._baseValue }
  }
}

export function renderEcs6Ui(state: AdaptationLayerState) {
  return () => [...roots.map(($) => renderEcs6UiRootComponent(state, $))]
}
