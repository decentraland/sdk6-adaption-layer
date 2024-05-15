import { type Callback } from "@dcl/sdk/react-ecs"
import { sendEventToSDK6 } from "../../../events/events"
import { type AdaptationLayerState } from "../../../types"


export function getClickHandler(state: AdaptationLayerState, onClick?: string | undefined): [Callback, undefined] | [undefined, undefined] {
    if (onClick !== undefined && onClick !== '' && onClick !== null) {
        const fn: Callback = () => {
            sendEventToSDK6(state.onEventFunctions, {
                type: 'uuidEvent',
                data: {
                    uuid: onClick,
                    payload: {
                        buttonId: 0
                    } 
                }
            })
        }
        return [fn, undefined]
    } else {
        return [undefined, undefined]
    }
}