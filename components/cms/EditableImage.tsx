"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { useCMS } from "./CMSProvider";
import { Pencil, Trash2 } from "lucide-react";

interface EditableImageProps {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  hideButton?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function EditableImage({
  contentKey,
  defaultSrc,
  alt,
  className = "",
  width,
  height,
  fill,
  sizes,
  priority,
  style,
  hideButton,
  inputRef: externalInputRef,
}: EditableImageProps) {
  const { content, isAdmin, loaded, updateContent, deleteContent } = useCMS();
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalRef;
  const src = content[contentKey] || defaultSrc;
  const hasCustomImage = !!content[contentKey];

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        updateContent(contentKey, data.url, "image");
      }
    },
    [contentKey, updateContent]
  );

  const handleDelete = useCallback(() => {
    if (deleteContent) deleteContent(contentKey);
  }, [contentKey, deleteContent]);

  const isExternal = src.startsWith("http");
  const imageProps: any = { src, alt, className, style, priority };
  if (isExternal) imageProps.unoptimized = true;
  if (fill) {
    imageProps.fill = true;
    if (sizes) imageProps.sizes = sizes;
  } else {
    imageProps.width = width;
    imageProps.height = height;
  }

  if (!isAdmin) {
    return <Image {...imageProps} />;
  }

  // Full-screen / fill images
  if (fill) {
    return (
      <div
        className="relative group"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <Image {...imageProps} />
        {isAdmin && !hideButton && (
          <button
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            className="absolute top-4 right-4 z-[50] bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-xl hover:bg-white cursor-pointer transition-colors pointer-events-auto"
          >
            <Pencil className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Changer l&apos;image</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>
    );
  }

  // Small images (logo, etc.): small edit + delete buttons
  return (
    <div className="relative inline-block group">
      <Image {...imageProps} />
      <div className="absolute -top-1 -right-1 flex gap-1 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          className="bg-black/60 hover:bg-black/80 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer transition-colors"
          title="Modifier"
        >
          <Pencil className="w-3 h-3 text-white" />
        </button>
        {hasCustomImage && (
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className="bg-red-500/80 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </div>
  );
}
