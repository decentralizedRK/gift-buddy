const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function imagePath(src: string): string {
  if (basePath && src.startsWith('/')) {
    return `${basePath}${src}`;
  }
  return src;
}
