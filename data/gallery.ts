export type GallerySlide = {
  src: string;
  alt: string;
  /** CSS object-position for object-cover frames (e.g. "top", "50% 20%") */
  objectPosition?: string;
};

export type HomeGalleryImage = {
  file: string;
  objectPosition?: string;
};

/** Home page `#gallery` carousel (excludes IMG_4461 — head crop in wide frames) */
export const homeGalleryImages: HomeGalleryImage[] = [
  { file: "IMG_4444.jpg", objectPosition: "top" },
  { file: "IMG_4445.jpg", objectPosition: "top" },
  { file: "IMG_4446.jpg", objectPosition: "top" },
  { file: "IMG_4449.jpg" },
  { file: "IMG_4450.jpg" },
  { file: "IMG_4453.jpg" },
  { file: "IMG_4456-1.jpg", objectPosition: "top" },
];

/** Supper Club page carousel (poster is video hero only, not duplicated here) */
export const supperClubGallerySlides: GallerySlide[] = [
  {
    src: "/images/chef-brie-gallery/IMG_4444.jpg",
    alt: "Plated supper club course with refined presentation",
    objectPosition: "top",
  },
  {
    src: "/images/chef-brie-gallery/IMG_4445.jpg",
    alt: "Chef Brie supper club table setting and ambiance",
    objectPosition: "top",
  },
  {
    src: "/images/chef-brie-gallery/IMG_4446.jpg",
    alt: "Multi-course dish served at a supper club event",
    objectPosition: "top",
  },
  {
    src: "/images/chef-brie-gallery/IMG_4449.jpg",
    alt: "Supper club dining experience with guests and courses",
  },
  {
    src: "/images/chef-brie-gallery/IMG_4450.jpg",
    alt: "Artfully plated entrée at Chef Brie supper club",
  },
  {
    src: "/images/chef-brie-gallery/IMG_4453.jpg",
    alt: "Shared table atmosphere at a curated supper club evening",
  },
  {
    src: "/images/chef-brie-gallery/IMG_4456-1.jpg",
    alt: "Chef Brie service moment during a multi-course pop-up",
    objectPosition: "top",
  },
];
