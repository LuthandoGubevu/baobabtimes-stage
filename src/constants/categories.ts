export interface Category {
  name: string;
  slug: string;
}

export const CATEGORIES: Category[] = [
  { name: "Company News", slug: "company-news" },
  { name: "Employee Spotlight", slug: "employee-spotlight" },
  { name: "Strategy", slug: "strategy" },
  { name: "Culture", slug: "culture" },
  { name: "From the Desk", slug: "from-the-desk" },
  { name: "From the CEO", slug: "from-the-ceo" },
];

export const getCategoryBySlug = (slug: string) => {
  return CATEGORIES.find(cat => cat.slug === slug);
};

export const getCategoryByName = (name: string) => {
  return CATEGORIES.find(cat => cat.name === name);
};
