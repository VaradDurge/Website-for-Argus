import Image from "next/image";

export function Logo({ clipHeight = 52 }: { clipHeight?: number }) {
  // The source PNG is 1536×1024 but the visible logo content only
  // occupies ~45% of the canvas height (heavy transparent padding).
  // We render the image 2.4× larger than the desired clip height so
  // the actual letterforms fill the clipping window, then we crop the
  // transparent top/bottom with overflow:hidden.
  const renderHeight = Math.round(clipHeight * 2.4);
  const renderWidth = Math.round(renderHeight * (1536 / 1024));

  // The logo content is vertically centred in the source image.
  // Offset pulls the content into the visible clip window:
  //   content centre in rendered px  = renderHeight * 0.5
  //   desired centre in clip window  = clipHeight  * 0.5
  const offsetTop = Math.round(renderHeight * 0.5 - clipHeight * 0.5);

  return (
    <span
      className="inline-block overflow-hidden shrink-0"
      style={{ height: clipHeight, width: "auto" }}
    >
      <Image
        src="/argus-logo.png"
        alt="ARGUS — ArgusLabs"
        width={renderWidth}
        height={renderHeight}
        priority
        style={{
          height: renderHeight,
          width: "auto",
          marginTop: -offsetTop,
          display: "block",
        }}
      />
    </span>
  );
}
