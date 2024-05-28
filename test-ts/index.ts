import fs from 'fs'
import { ComponentBodyPayload, EntityAction } from '@dcl/protocol/out-ts/decentraland/sdk/ecs6/engine_interface_ecs6.gen'

type State = {
    entities: Record<string, { 
        attachedComponent: string[], 
        selfComponents: Record<string, any>, 
        parent: string
    }>
    components: Record<string, { classId: number, data: ComponentBodyPayload | undefined, children: string[]}>
}

const state:State = {
    entities: {},
    components: {}
}

function parseAction(action: EntityAction) {
    switch (action.payload?.payload?.$case) {
        case 'createEntity':
            {
                const payload = action.payload.payload.createEntity
                state.entities[payload.id] = { selfComponents: {}, attachedComponent: [], parent: '0' }
            }
            break;
        case 'removeEntity':
            {
                const payload = action.payload.payload.removeEntity
                delete state.entities[payload.id]
            }
            break;
        case 'updateEntityComponent':
            {
                const payload = action.payload.payload.updateEntityComponent
                state.entities[payload.entityId].selfComponents[payload.classId] = payload.componentData
            }
            break;
        case 'attachEntityComponent':
            {
                const payload = action.payload.payload.attachEntityComponent
                state.entities[payload.entityId].attachedComponent.push(payload.id)
            }
            break;
        // case 'componentRemoved':
        //     {
        //         const payload = action.payload.payload.componentRemoved
        //         state.components[payload.entityId] = undefined
        //     }
        //     break;
        case 'setEntityParent':
            {
                const payload = action.payload.payload.setEntityParent
                state.entities[payload.entityId].parent = payload.parentId
            }
            break;
        case 'componentCreated':
            {
                const payload = action.payload.payload.componentCreated
                
                state.components[payload.id] = {
                    classId: payload.classId,
                    data: undefined,
                    children: []
                }

            }
            break;
        // case 'componentDisposed':
        //     {
        //         const payload = action.payload.payload.componentDisposed
        //     }
        //     break;
        case 'componentUpdated':
            {
                const payload = action.payload.payload.componentUpdated
                state.components[payload.id].data = payload.componentData
            }
            break;
        
    }
}

async function main() {
    const value = await fs.promises.readFile('example-state.json')
    const decoder = new TextDecoder()
    const textContent = decoder.decode(value)
    const jsonContent = JSON.parse(textContent) as EntityAction[]
    
    for (const action of jsonContent) {
        parseAction(action)
    }

    const typeOfElements = new Set()

    const uiComponents = Object.entries(state.components)
        .filter(component => component[1].data?.payload?.$case.startsWith('ui'))
        .map($ => { 
            const payload: any = $[1].data?.payload!
            const __type: string = payload.$case!
            typeOfElements.add(__type)
            return {   __id: $[0] , __type, ...payload[__type],}
        })

    function buildTree(element: any, parentId: string | undefined) {
        const tree: Record<string ,any> = {};
        
        uiComponents.forEach(item => {
            if (item.parentComponent === parentId) {
                tree[item.__id] = buildTree(item, item.__id);
            }
        });
        
        return {
            ...element,
            tree
        }
    }

    const tree = buildTree({name: 'root'}, undefined)
 
    fs.promises.writeFile('state.json', JSON.stringify(state, null, 2))
    fs.promises.writeFile('ui.json', JSON.stringify(uiComponents, null, 2))
    fs.promises.writeFile('ui-tree.json', JSON.stringify(tree, null, 2))
    fs.promises.writeFile('ui-types.json', JSON.stringify(Array.from(typeOfElements.values()), null, 2))
    console.log("Done!");
}

main()


