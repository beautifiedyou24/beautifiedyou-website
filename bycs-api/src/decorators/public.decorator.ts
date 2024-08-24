import { SetMetadata } from "@nestjs/common";
export const IS_PUBLIC_KEY_DECORATOR = "IS-PUBLIC-KEY-DECORATOR";
export const Public = () => SetMetadata(IS_PUBLIC_KEY_DECORATOR, true);
