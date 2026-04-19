export interface NavLink {
  href: string;
  label: string;
}

export const mainNav: NavLink[] = [
  { href: '/projects', label: 'Projects' },
  { href: '/til', label: 'TIL' },
  { href: '/notes', label: 'Notes' },
];

export const footerLinks: NavLink[] = [
  { href: 'https://github.com/scottdkey', label: 'GitHub' },
  { href: 'https://linkedin.com/in/scottdkey', label: 'LinkedIn' },
];
