export function logMiddleware(
  dcl: DecentralandInterface
): DecentralandInterface {
  const decentralandInterface: DecentralandInterface = {
    DEBUG: true,

    addEntity: function (entityId: EntityID) {
      console.log('dcl.addEntity', { entityId })
      dcl.addEntity(entityId)
    },

    removeEntity: function (entityId: EntityID) {
      console.log('dcl.removeEntity', { entityId })
      dcl.removeEntity(entityId)
    },

    updateEntityComponent: function (
      entityId: EntityID,
      componentName: string,
      classId: number,
      json: string
    ) {
      console.log('dcl.updateEntityComponent', {
        entityId,
        componentName,
        classId,
        json
      })
      dcl.updateEntityComponent(entityId, componentName, classId, json)
    },

    attachEntityComponent: function (
      entityId: EntityID,
      componentName: string,
      componentId: ComponentID
    ) {
      console.log('dcl.attachEntityComponent', {
        entityId,
        componentName,
        componentId
      })
      dcl.attachEntityComponent(entityId, componentName, componentId)
    },

    removeEntityComponent: function (
      entityId: EntityID,
      componentName: string
    ) {
      console.log('dcl.removeEntityComponent', { entityId, componentName })
      dcl.removeEntityComponent(entityId, componentName)
    },

    setParent: function (entityId: EntityID, parentId: EntityID) {
      console.log('dcl.setParent', { entityId, parentId })
      dcl.setParent(entityId, parentId)
    },

    componentCreated: function (
      componentId: ComponentID,
      componentName: string,
      classId: number
    ) {
      console.log('dcl.componentCreated', {
        componentId,
        componentName,
        classId
      })
      dcl.componentCreated(componentId, componentName, classId)
    },

    componentDisposed: function (componentId: ComponentID) {
      console.log('dcl.componentDisposed', { componentId })
      dcl.componentDisposed(componentId)
    },

    componentUpdated: function (componentId: ComponentID, json: string) {
      console.log('dcl.componentUpdated', { componentId, json })
      dcl.componentUpdated(componentId, json)
    },

    query: dcl.query,
    subscribe: dcl.subscribe,
    unsubscribe: dcl.unsubscribe,
    log: dcl.log,
    openExternalUrl: dcl.openExternalUrl,
    openNFTDialog: dcl.openNFTDialog,
    onUpdate: dcl.onUpdate,
    onEvent: dcl.onEvent,
    loadModule: dcl.loadModule,
    callRpc: dcl.callRpc,
    onStart: dcl.onStart,
    error: dcl.error
  }
  return decentralandInterface
}
