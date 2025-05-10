
export interface NavItem {
  name: string;
  path: string;
}

export const mainNavItems: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/#features" },
  { name: "Pricing", path: "/#pricing" },
  { name: "Testimonials", path: "/#testimonials" },
];
