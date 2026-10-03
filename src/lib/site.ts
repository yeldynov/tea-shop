export const site = {
  name: "Tea Shop",
  tagline: "Traditional Chinese tea — pu’er, rock oolong and more, from small farms.",
  announcement: ["Free shipping on orders over $60", "A tasting sample with every order"],
};

export const mainNav = [
  { label: "Shop all", href: "/shop" },
  { label: "Pu’er", href: "/collections/puer" },
  { label: "Oolong", href: "/collections/oolong" },
  { label: "Teaware", href: "/collections/teaware" },
  { label: "Journal", href: "/journal" },
];

export const footerNav = [
  {
    title: "Shop",
    links: [
      { label: "All tea", href: "/shop" },
      { label: "New arrivals", href: "/new-arrivals" },
      { label: "Pu’er", href: "/collections/puer" },
      { label: "Oolong", href: "/collections/oolong" },
      { label: "Black tea", href: "/collections/black-tea" },
      { label: "Teaware", href: "/collections/teaware" },
      { label: "Gift cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Gongfu brewing", href: "/journal/brewing" },
      { label: "Our sourcing", href: "/about/sourcing" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping & returns", href: "/help/shipping" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/help" },
    ],
  },
];
