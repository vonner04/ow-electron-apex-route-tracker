import type { PassthroughType, ZOrderType } from "@overwolf/ow-electron-packages-types";

//Work-around to overlay-services because OverlayWindowOptions don't accept types from ow-electron-packages-types
export const Passthrough = {
  NoPassThrough: "noPassThrough" as PassthroughType,
  PassThrough: "passThrough" as PassthroughType,
  PassThroughAndNotify: "passThroughAndNotify" as PassthroughType,
} as const;

export const ZOrder = {
  Default: "default" as ZOrderType,
  TopMost: "topMost" as ZOrderType,
  BottomMost: "bottomMost" as ZOrderType,
} as const;
