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

  const zoomX = canvasInfo.width / 1280.0
  const zoomY = canvasInfo.height / 720.0
  const zoom = Math.min(zoomX, zoomY)
  const canvasSize = { x: 1280, y: 720 - 100 }

  return (
    <UiEntity
      key={`root${c.__id}`}
      uiTransform={{
        positionType: 'absolute',
        position: { left: 0, top: 70 * zoom },
        width: '100%',
        height: '100%'
      }}
    >
      {c.children.map(($) => Ecs6UiComponent(state, $, canvasSize, zoom))}
    </UiEntity>
  )
}
