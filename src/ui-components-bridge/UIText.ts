import { UiText, UiTransform, YGAlign, YGDisplay, YGFlexDirection, YGJustify, YGOverflow, YGPositionType, YGUnit, YGWrap } from "@dcl/sdk/ecs";
import { sdk7EnsureEntityByIDForUI } from "../ecs7/ecs7";
import { AdaptationLayerState } from "../types";

export function update(state: AdaptationLayerState, id: string, payload: any) {
    const ecs7Entity = sdk7EnsureEntityByIDForUI(state, id)
/*
    outlineWidth: number;
    outlineColor: Color4;
    color: Color4;
    fontSize: number;
    fontAutoSize: boolean;
    font?: Font;
    value: string;
    lineSpacing: number;
    lineCount: number;
    adaptWidth: boolean;
    adaptHeight: boolean;
    textWrapping: boolean;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowColor: Color4;
    hTextAlign: string;
    vTextAlign: string;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;

    name: string | null;
    visible: boolean;
    opacity: number;
    hAlign: string;
    vAlign: string;
    width: string | number;
    height: string | number;
    positionX: string | number;
    positionY: string | number;
    isPointerBlocker: boolean;
    private _parent?;
    constructor(parent: UIShape | null);
    get parent(): UIShape | undefined;
    */

    UiText.createOrReplace(ecs7Entity, {
        color: payload.color,
        fontSize: payload.fontSize,
        font: payload.font,
        value: payload.value,
        textAlign: payload.hTextAlign
    })

    UiTransform.createOrReplace(ecs7Entity, {
        parent: 0,
        rightOf: 0,
        alignContent: YGAlign.YGA_CENTER,
        alignItems: YGAlign.YGA_FLEX_END,
        alignSelf: YGAlign.YGA_FLEX_START,
        display: YGDisplay.YGD_NONE,
        flexBasis: 3,
        flexBasisUnit: YGUnit.YGU_POINT,
        flexDirection: YGFlexDirection.YGFD_COLUMN_REVERSE,
        flexWrap: YGWrap.YGW_WRAP,
        flexGrow: 4,
        flexShrink: 1,
        height: payload.height || '50px',
        heightUnit: YGUnit.YGU_POINT,
        justifyContent: YGJustify.YGJ_FLEX_END,
        marginBottom: 0,
        marginBottomUnit: YGUnit.YGU_UNDEFINED,
        marginLeft: 0,
        marginLeftUnit: YGUnit.YGU_UNDEFINED,
        marginRight: 0,
        marginRightUnit: YGUnit.YGU_UNDEFINED,
        marginTop: 0,
        marginTopUnit: YGUnit.YGU_UNDEFINED,
        maxHeight: 0,
        maxHeightUnit: YGUnit.YGU_UNDEFINED,
        maxWidth: 0,
        maxWidthUnit: YGUnit.YGU_UNDEFINED,
        minHeight: 0,
        minHeightUnit: YGUnit.YGU_UNDEFINED,
        minWidth: 0,
        minWidthUnit: YGUnit.YGU_UNDEFINED,
        overflow: YGOverflow.YGO_VISIBLE,
        paddingBottom: 1,
        paddingBottomUnit: YGUnit.YGU_PERCENT,
        paddingLeft: 1,
        paddingLeftUnit: YGUnit.YGU_UNDEFINED,
        paddingTopUnit: YGUnit.YGU_POINT,
        paddingRight: 1,
        paddingRightUnit: YGUnit.YGU_POINT,
        paddingTop: 1,
        positionBottom: 0,
        positionBottomUnit: YGUnit.YGU_POINT,
        positionLeft: payload.positionX || '0px',
        positionLeftUnit: YGUnit.YGU_POINT,
        positionRight: 0,
        positionRightUnit: YGUnit.YGU_POINT,
        positionTop: payload.positionY || '0px',
        positionTopUnit: YGUnit.YGU_POINT,
        positionType: YGPositionType.YGPT_ABSOLUTE,
        width: payload.width || '100px',
        widthUnit: YGUnit.YGU_POINT
    })
}
  
export function remove(state: AdaptationLayerState, id: string) {
    const ecs7Entity = sdk7EnsureEntityByIDForUI(state, id)
    UiText.deleteFrom(ecs7Entity)
    UiTransform.deleteFrom(ecs7Entity)
}