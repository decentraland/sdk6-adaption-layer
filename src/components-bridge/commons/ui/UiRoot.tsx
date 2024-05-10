import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity, type JSX } from '@dcl/sdk/react-ecs'
import { type AdaptationLayerState } from '../../../types'
import { type ComponentNode } from './core'
import { Ecs6UiComponent } from './UiComponent'

export function renderEcs6UiRootComponent(
  state: AdaptationLayerState,
  c: ComponentNode
): JSX.Element {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
  const canvasSize = { x: canvasInfo.width, y: canvasInfo.height }

  return (
    <UiEntity
      key={`root${c.__id}`}
      uiTransform={{
        position: { left: 0, top: 0 },
        width: '100%',
        height: '100%'
      }}
    >
      {c.children.map(($) => Ecs6UiComponent(state, $, canvasSize))}
    </UiEntity>
  )
}
