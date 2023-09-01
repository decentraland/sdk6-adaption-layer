import { ByteBuffer, ISchema } from '@dcl/sdk/ecs'

export type CustomPointerEvent = {
    inputAction: number,
    eventType: number,
    uuid: string
}

export const CustomPointerEventSchemas: ISchema<CustomPointerEvent> = {
    serialize(value: CustomPointerEvent, builder: ByteBuffer): void {
        builder.writeUint32(value.inputAction)
        builder.writeUint32(value.eventType)
        builder.writeUtf8String(value.uuid)
    },
    deserialize(reader: ByteBuffer): CustomPointerEvent {
        return {
            inputAction: reader.readUint32(),
            eventType: reader.readUint32(),
            uuid: reader.readUtf8String()
        }
    },
    create() {
        return { eventType: 0, inputAction: 0, uuid: "" }
    },
    jsonSchema: {
        type: 'object',
        serializationType: 'unknown'
    }
}