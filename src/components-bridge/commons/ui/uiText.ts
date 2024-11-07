import { Font, TextAlignMode } from '@dcl/sdk/ecs'
import { type UiLabelProps } from '@dcl/sdk/react-ecs'

export function textAlignFromHV(
  hAlign: string | undefined,
  vAlign: string | undefined
): UiLabelProps['textAlign'] {
  if (vAlign === 'top') {
    if (hAlign === 'left') {
      return 'top-left'
    } else if (hAlign === 'right') {
      return 'top-right'
    } else {
      return 'top-center'
    }
  } else if (vAlign === 'bottom') {
    if (hAlign === 'left') {
      return 'bottom-left'
    } else if (hAlign === 'right') {
      return 'bottom-right'
    } else {
      return 'bottom-center'
    }
  } else {
    if (hAlign === 'left') {
      return 'middle-left'
    } else if (hAlign === 'right') {
      return 'middle-right'
    } else {
      return 'middle-center'
    }
  }
}

export function stringToTextAlignMode(
  textAlign: UiLabelProps['textAlign']
): TextAlignMode | undefined {
  switch (textAlign) {
    case 'top-left':
      return TextAlignMode.TAM_TOP_LEFT
    case 'top-right':
      return TextAlignMode.TAM_TOP_RIGHT
    case 'top-center':
      return TextAlignMode.TAM_TOP_CENTER
    case 'bottom-left':
      return TextAlignMode.TAM_BOTTOM_LEFT
    case 'bottom-right':
      return TextAlignMode.TAM_BOTTOM_RIGHT
    case 'bottom-center':
      return TextAlignMode.TAM_BOTTOM_CENTER
    case 'middle-left':
      return TextAlignMode.TAM_MIDDLE_LEFT
    case 'middle-right':
      return TextAlignMode.TAM_MIDDLE_RIGHT
    case 'middle-center':
      return TextAlignMode.TAM_MIDDLE_CENTER
  }
  return undefined
}

export function convertUiFontFromFont(
  font: Font | undefined
): UiLabelProps['font'] {
  switch (font) {
    case Font.F_SERIF:
      return 'serif'
    case Font.F_MONOSPACE:
      return 'monospace'
    case Font.F_SANS_SERIF:
    default:
      return 'sans-serif'
  }
}
