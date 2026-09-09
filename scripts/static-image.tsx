import type { ImgHTMLAttributes } from 'react';
export default function StaticImage({ unoptimized: _unoptimized, alt, ...props }: ImgHTMLAttributes<HTMLImageElement> & { unoptimized?: boolean }) {
  // Static hosting has no image optimization endpoint; reuse the prepared local assets.
  // oxlint-disable-next-line next/no-img-element
  return <img alt={alt} {...props} />;
}
