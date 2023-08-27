export type ParcelIdentity = {
    /**
     * Returns the current parcel data
     */
    getParcel(): Promise<any>
}

export function loadParcelIdentity(getSceneInformation: (_: any) => any) : ParcelIdentity {
    async function getParcel(): Promise<any> {
        const sceneInformation = await getSceneInformation({})
        return {
            land: {
              sceneId: sceneInformation.urn || '',
              sceneJsonData: JSON.parse(sceneInformation.metadataJson) || '{}',
              baseUrl: sceneInformation.baseUrl || '',
              baseUrlBundles: '',
              mappingsResponse: {
                parcelId: sceneInformation.urn || '',
                rootCid: sceneInformation.urn || '',
                contents: sceneInformation.content || []
              }
            },
            cid: sceneInformation.urn || ''
          }
    }
    return {
        getParcel
    }
}