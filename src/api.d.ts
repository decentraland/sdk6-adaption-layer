declare module '~system/AdaptationLayerHelper' {
  function getTextureSize(body: {
    src: string
  }): Promise<{ src: string; size: { width: number; height: number } }>
}

declare type FormData = any
declare type Blob = any
