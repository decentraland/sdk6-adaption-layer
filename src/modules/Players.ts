import { getConnectedPlayers, getPlayersInScene } from '~system/Players'
import { getUserData } from '~system/UserIdentity'

type WearableId = string

type ColorString = string

type Snapshots = {
  // @deprecated
  face: string
  // @deprecated
  face256: string
  // @deprecated
  face128: string
  // @deprecated
  body: string
}

type AvatarForUserData = {
  bodyShape: WearableId
  skinColor: ColorString
  hairColor: ColorString
  eyeColor: ColorString
  wearables: WearableId[]
  snapshots: Snapshots
}

type UserData = {
  displayName: string
  publicKey: string | null
  hasConnectedWeb3: boolean
  userId: string
  version: number
  avatar: AvatarForUserData
}

export function create(): Record<string, any> {
  /**
   * Return the players's data
   */
  async function getPlayerData(opt: {
    userId: string
  }): Promise<UserData | null> {
    const userData = await getUserData({})
    return {
      displayName: userData.data?.displayName ?? '',
      publicKey: userData.data?.userId ?? null,
      hasConnectedWeb3: userData.data?.hasConnectedWeb3 ?? false,
      userId: userData.data?.userId ?? '',
      version: userData.data?.version ?? 0,
      avatar: {
        bodyShape: userData.data?.avatar?.bodyShape ?? '',
        skinColor: userData.data?.avatar?.skinColor ?? '',
        hairColor: userData.data?.avatar?.hairColor ?? '',
        eyeColor: userData.data?.avatar?.eyeColor ?? '',
        wearables: userData.data?.avatar?.wearables ?? [],
        snapshots: {
          // @deprecated
          face: userData.data?.avatar?.snapshots?.face256 ?? '',
          // @deprecated
          face256: userData.data?.avatar?.snapshots?.face256 ?? '',
          // @deprecated
          face128: userData.data?.avatar?.snapshots?.face256 ?? '',
          // @deprecated
          body: userData.data?.avatar?.snapshots?.body ?? ''
        }
      }
    }
  }

  /**
   * Return array of connected players
   */
  async function internalGetConnectedPlayers(): Promise<
    Array<{ userId: string }>
  > {
    const connectedPlayers = await getConnectedPlayers({})
    return connectedPlayers.players
  }

  /**
   * Return array of players inside the scene
   */
  async function internalGetPlayersInScene(): Promise<
    Array<{ userId: string }>
  > {
    const playersInScene = await getPlayersInScene({})
    return playersInScene.players
  }

  return {
    getPlayerData,
    getConnectedPlayers: internalGetConnectedPlayers,
    getPlayersInScene: internalGetPlayersInScene
  }
}
