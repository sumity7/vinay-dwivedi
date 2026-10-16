import Image, { type ImageProps } from "next/image";
import { focusOf } from "@/lib/images";

/** next/image that crops around the photo's focus point (see lib/images.ts). */
export function Pic({ style, ...props }: ImageProps) {
  const src = props.src as { src?: string } | string;
  const pos = typeof src === "string" || src?.src ? focusOf(src as { src: string } | string) : undefined;
  return <Image {...props} style={{ objectPosition: pos, ...style }} />;
}
