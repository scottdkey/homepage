import { resumeSocialLinks } from './resume';

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
  { href: resumeSocialLinks.github.href, label: 'GitHub' },
  { href: resumeSocialLinks.linkedin.href, label: 'LinkedIn' },
];
