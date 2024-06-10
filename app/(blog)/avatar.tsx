import { Image } from "next-sanity/image";

import type { Author } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { FaArrowLeft, FaUserFriends } from "react-icons/fa";
import Link from "next/link";

interface Props {
  name: string;
  picture: Exclude<Author["picture"], undefined> | null;
  jlptLevel?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
};

const imageSize = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

export default function Avatar({
  name,
  picture,
  jlptLevel,
  size = "md",
}: Props) {
  const avatarSizeClass = sizeClasses[size];
  const imgSize = imageSize[size];

  return (
    <div className="flex items-center text-xl">
      {picture?.asset?._ref ? (
        <div className={`mr-4 ${avatarSizeClass}`}>
          <Image
            alt={picture?.alt || ""}
            className="h-full rounded-full object-cover"
            height={imgSize}
            width={imgSize}
            src={
              urlForImage(picture)
                ?.height(imgSize * 2)
                .width(imgSize * 2)
                .fit("crop")
                .url() as string
            }
          />
        </div>
      ) : (
        <div className="mr-1">By </div>
      )}
      <div className="flex items-center gap-2">
        <div className="text-pretty text-xl font-bold">{name}</div>
        <div className="text-pretty text-xl">(JLPT Level {jlptLevel})</div>
      </div>
    </div>
  );
}
