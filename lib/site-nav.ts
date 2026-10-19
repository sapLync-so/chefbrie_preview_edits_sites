export type SiteNavLink = {
  href: string;
  label: string;
  homeAnchor?: boolean;
};

/** Header + mobile menu */
export const headerNavLinks: SiteNavLink[] = [
  { href: "/#about", label: "About", homeAnchor: true },
  { href: "/#services", label: "Services", homeAnchor: true },
  { href: "/#testimonials", label: "Testimonials", homeAnchor: true },
  { href: "/menu", label: "Menu" },
  { href: "/services/supper-club", label: "Supper Club" },
  { href: "/#contact", label: "Contact", homeAnchor: true },
];

/** Footer site map */
export const footerNavLinks: SiteNavLink[] = [
  { href: "/#services", label: "Services", homeAnchor: true },
  { href: "/services/meal-prep", label: "Meal Prep" },
  { href: "/services/micro-catering", label: "Micro-Catering" },
  { href: "/services/supper-club", label: "Supper Club" },
  { href: "/menu", label: "Menu" },
  { href: "/#contact", label: "Contact", homeAnchor: true },
];

export function resolveNavHref(link: SiteNavLink, pathname: string): string {
  if (link.homeAnchor && pathname !== "/") {
    return `/${link.href.replace(/^\//, "")}`;
  }
  if (link.homeAnchor && pathname === "/") {
    return link.href.replace(/^\//, "") || link.href;
  }
  return link.href;
}
