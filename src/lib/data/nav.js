// The primary navigation, in order. `match` decides when a link is the
// current page: the home link only matches exactly, the rest match their
// section so a nested page keeps its tab lit.
export const navLinks = [
  { href: '/', label: 'Home', icon: 'icon-home', exact: true },
  { href: '/crossword', label: 'Mini', icon: 'icon-puzzle' },
  { href: '/2048', label: '2048', icon: 'icon-grid' },
  { href: '/about', label: 'About', icon: 'icon-person' },
  { href: '/contact', label: 'Contact', icon: 'icon-mail' }
];
