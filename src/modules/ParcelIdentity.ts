import { getSceneInformation } from '~system/Runtime'

declare type ContentMapping = {
  file: string
  hash: string
}

type MappingsResponse = {
  parcel_id: string
  root_cid: string
  contents: ContentMapping[]
}

type ILand = {
  /**
   * sceneId: Now it is either an internal identifier or the rootCID.
   * In the future will change to the sceneCID
   */
  sceneId: string
  sceneJsonData: SceneJsonData
  baseUrl: string
  baseUrlBundles: string
  mappingsResponse: MappingsResponse
}

export type SceneJsonData = {
  display?: SceneDisplay
  owner?: string
  contact?: SceneContact
  tags?: string[]
  scene: SceneParcels
  spawnPoints?: SceneSpawnPoint[]
  requiredPermissions?: string[]
}

type SceneDisplay = {
  title?: string
  favicon?: string
  description?: string
  navmapThumbnail?: string
}

type SceneContact = {
  name?: string
  email?: string
  url?: string
}

type SceneParcels = {
  base: string
  parcels: string[]
}

type SceneSpawnPoint = {
  name?: string
  position: {
    x: number | number[]
    y: number | number[]
    z: number | number[]
  }
  default?: boolean
}

export function create(): Record<string, any> {
  /**
   * Returns the current parcel data
   */
  async function getParcel(): Promise<{ land: ILand; cid: string }> {
    const sceneInformation = await getSceneInformation({})
    return {
      land: {
        sceneId: sceneInformation.urn ?? '',
        sceneJsonData: JSON.parse(sceneInformation.metadataJson) ?? '{}',
        baseUrl: sceneInformation.baseUrl ?? '',
        baseUrlBundles: '',
        mappingsResponse: {
          parcel_id: sceneInformation.urn ?? '',
          root_cid: sceneInformation.urn ?? '',
          contents: sceneInformation.content ?? []
        }
      },
      cid: sceneInformation.urn ?? ''
    }
  }

  return {
    getParcel
  }
}
