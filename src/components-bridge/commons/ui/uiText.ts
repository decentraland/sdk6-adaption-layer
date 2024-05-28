import { Font } from '@dcl/sdk/ecs'
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
