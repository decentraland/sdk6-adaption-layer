import { getExplorerInformation, getRealm, getWorldTime } from '~system/Runtime'

type Realm = {
  domain: string
  /** @deprecated use room instead */
  layer: string
  room: string
  serverName: string
  displayName: string
}

type ExplorerConfiguration = {
  clientUri: string
  configurations: Record<string, string | number | boolean>
}

const enum Platform {
  DESKTOP = 'desktop',
  BROWSER = 'browser'
}

export function create(): Record<string, any> {
  /**
   * Returns the current connected realm
   */
  async function getCurrentRealm(): Promise<Realm | undefined> {
    const realm = await getRealm({})
    return {
      domain: realm.realmInfo?.baseUrl ?? '',
      /** @deprecated use room instead */
      layer: realm.realmInfo?.room ?? '',
      room: realm.realmInfo?.room ?? '',
      serverName: realm.realmInfo?.realmName ?? '',
      displayName: realm.realmInfo?.realmName ?? ''
    }
  }

  /**
   * Returns whether the scene is running in preview mode or not
   */
  async function isPreviewMode(): Promise<boolean> {
    return true
    // const realm = await getRealm({})
    // return realm.realmInfo?.isPreview ?? false
  }

  /**
   * Returns explorer configuration and environment information
   */
  async function getExplorerConfiguration(): Promise<ExplorerConfiguration> {
    return {
      clientUri: 'https://play.decentraland.org/',
      configurations: {}
    }
  }

  /**
   * Returns what platform is running the scene
   */
  async function getPlatform(): Promise<Platform> {
    const config = await getExplorerInformation({})

    if (config.platform === 'web') {
      return Platform.BROWSER
    } else if (config.platform === 'desktop') {
      return Platform.DESKTOP
    }

    return config.platform as Platform
  }

  /**
   * Returns Decentraland's time
   */
  async function getDecentralandTime(): Promise<{ seconds: number }> {
    const time = await getWorldTime({})
    return { seconds: time.seconds }
  }

  return {
    getCurrentRealm,
    isPreviewMode,
    getExplorerConfiguration,
    getPlatform,
    getDecentralandTime
  }
}
