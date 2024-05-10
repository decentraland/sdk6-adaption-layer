// import { ECS6Color4, UiValue } from "~system/EngineApi";

// /** NO CLASS */
// export interface ECS6ComponentUiShape {
//     name?: string | undefined;
//     visible?: boolean | undefined;
//     opacity?: number | undefined;
//     hAlign?: string | undefined;
//     vAlign?: string | undefined;
//     width?: UiValue | undefined;
//     height?: UiValue | undefined;
//     positionX?: UiValue | undefined;
//     positionY?: UiValue | undefined;
//     isPointerBlocker?: boolean | undefined;
//     parentComponent?: string | undefined;
// }
// /** CLASS_ID.UI_CONTAINER_RECT */
// export interface ECS6ComponentUiContainerRect extends ECS6ComponentUiShape {
//     thickness?: number | undefined;
//     color?: ECS6Color4 | undefined;
//     alignmentUsesSize?: boolean | undefined;
// }

// /** CLASS_ID.UI_TEXT_SHAPE */
// export interface ECS6ComponentUiText extends ECS6ComponentUiShape {
//     parentComponent?: string | undefined;
//     outlineWidth?: number | undefined;
//     outlineColor?: ECS6Color4 | undefined;
//     color?: ECS6Color4 | undefined;
//     fontSize?: number | undefined;
//     fontAutoSize?: boolean | undefined;
//     font?: string | undefined;
//     value?: string | undefined;
//     lineSpacing?: number | undefined;
//     lineCount?: number | undefined;
//     adaptWidth?: boolean | undefined;
//     adaptHeight?: boolean | undefined;
//     textWrapping?: boolean | undefined;
//     shadowBlur?: number | undefined;
//     shadowOffsetX?: number | undefined;
//     shadowOffsetY?: number | undefined;
//     shadowColor?: ECS6Color4 | undefined;
//     hTextAlign?: string | undefined;
//     vTextAlign?: string | undefined;
//     paddingTop?: number | undefined;
//     paddingRight?: number | undefined;
//     paddingBottom?: number | undefined;
//     paddingLeft?: number | undefined;
// }
// /** CLASS_ID.UI_INPUT_TEXT_SHAPE */
// export interface ECS6ComponentUiInputText extends ECS6ComponentUiShape {
//     parentComponent?: string | undefined;
//     outlineWidth?: number | undefined;
//     outlineColor?: ECS6Color4 | undefined;
//     color?: ECS6Color4 | undefined;
//     fontSize?: number | undefined;
//     font?: string | undefined;
//     value?: string | undefined;
//     placeholder?: string | undefined;
//     margin?: number | undefined;
//     focusedBackground?: ECS6Color4 | undefined;
//     textWrapping?: boolean | undefined;
//     shadowBlur?: number | undefined;
//     shadowOffsetX?: number | undefined;
//     shadowOffsetY?: number | undefined;
//     shadowColor?: ECS6Color4 | undefined;
//     hTextAlign?: string | undefined;
//     vTextAlign?: string | undefined;
//     paddingTop?: number | undefined;
//     paddingRight?: number | undefined;
//     paddingBottom?: number | undefined;
//     paddingLeft?: number | undefined;
//     onTextChanged?: string | undefined;
//     onFocus?: string | undefined;
//     onBlur?: string | undefined;
//     onTextSubmit?: string | undefined;
//     onChanged?: string | undefined;
// }
// /** CLASS_ID.UI_IMAGE_SHAPE */
// export interface ECS6ComponentUiImage extends ECS6ComponentUiShape {
//     parentComponent?: string | undefined;
//     sourceLeft?: number | undefined;
//     sourceTop?: number | undefined;
//     sourceWidth?: number | undefined;
//     sourceHeight?: number | undefined;
//     source?: string | undefined;
//     paddingTop?: number | undefined;
//     paddingRight?: number | undefined;
//     paddingBottom?: number | undefined;
//     paddingLeft?: number | undefined;
//     sizeInPixels?: boolean | undefined;
//     onClick?: string | undefined;
// }

// /** CLASS_ID.UI_SCREEN_SPACE_SHAPE */
// export interface ECS6ComponentUiScreenSpaceShape extends ECS6ComponentUiShape {
//     parentComponent?: string | undefined;
// }
