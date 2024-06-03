import { movePlayerTo, triggerEmote } from '~system/RestrictedActions'

export type PositionType = { x: number; y: number; z: number }

export type Emote = {
  predefined: PredefinedEmote
}

export const enum PredefinedEmote {
  WAVE = 'wave',
  FIST_PUMP = 'fistpump',
  ROBOT = 'robot',
  RAISE_HAND = 'raiseHand',
  CLAP = 'clap',
  MONEY = 'money',
  KISS = 'kiss',
  TIK = 'tik',
  HAMMER = 'hammer',
  TEKTONIK = 'tektonik',
  DONT_SEE = 'dontsee',
  HANDS_AIR = 'handsair',
  SHRUG = 'shrug',
  DISCO = 'disco',
  DAB = 'dab',
  HEAD_EXPLODDE = 'headexplode'
}

export function create(): Record<string, any> {
  /**
   * move player to a position inside the scene
   *
   * @param position PositionType
   * @param cameraTarget PositionType
   */
  async function internalMovePlayerTo(
    newPosition: PositionType,
    cameraTarget?: PositionType
  ): Promise<void> {
    await movePlayerTo({ newRelativePosition: newPosition, cameraTarget })
  }

  /**
   * trigger an emote on the current player
   *
   * @param emote the emote to perform
   */
  async function internalTriggerEmote(emote: Emote): Promise<void> {
    await triggerEmote({
      predefinedEmote: emote.predefined
    })
  }

  return {
    movePlayerTo: internalMovePlayerTo,
    triggerEmote: internalTriggerEmote
  }
}
