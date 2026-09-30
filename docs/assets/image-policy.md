# Image Policy

## Principles
1. Use only images with confirmed usage rights.
2. Never copy images from FNP or competing gift sellers.
3. Never use images with visible watermarks.
4. Never present stock images as exact product depictions.
5. Maintain provenance for every image in `image-manifest.csv`.

## Source Priority
1. Existing repository assets with documented rights.
2. Original placeholder images created for the project.
3. Appropriately licensed images from reputable free-image providers (Unsplash, Pexels, Pixabay).
4. AI-generated images where tooling and licensing permit.

## Current State
The v1 application uses CSS gradient placeholders with descriptive text overlays. No external images are downloaded or committed. Product cards display styled placeholder boxes with product initials and category-appropriate colors.

This approach:
- Requires no licensing verification.
- Works offline and in CI environments.
- Has no provenance concerns.
- Can be replaced with real product photography when available.

## Future Enhancement
When product photography becomes available:
1. Store optimized images in `public/images/products/`.
2. Create WebP derivatives for performance.
3. Update `image-manifest.csv` with source, license, and attribution.
4. Add responsive `<Image>` components with proper `alt` text.
5. Ensure no layout shift with fixed aspect-ratio containers.

## Alt Text Guidelines
- Describe what is visible in the image.
- Do not use promotional keywords.
- Be concise (under 125 characters).
- Example: "Gift hamper with organic tea, bamboo organizer, and cotton tote bag"
