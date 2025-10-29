export interface HeroContent {
  title: string
  subtitle: string
  ctaPrimary: {
    text: string
    href: string
  }
  ctaSecondary: {
    text: string
    href: string
  }
  stats: Array<{
    number: string
    label: string
    description: string
  }>
  trustIndicators: Array<{
    icon: string
    text: string
  }>
}

export interface CoursesPageContent {
  hero: {
    title: string
    subtitle: string
    searchPlaceholder: string
  }
  filters: {
    categoriesTitle: string
    levelsTitle: string
    priceRangeTitle: string
    searchTitle: string
    resultsText: (count: number) => string
  }
  emptyState: {
    title: string
    message: string
  }
  cta: {
    title: string
    subtitle: string
    buttonText: string
  }
}

export interface FeaturedCoursesContent {
  title: string
  subtitle: string
  viewAllText: string
  viewAllHref: string
}

export interface CourseCategoriesContent {
  title: string
  subtitle: string
  categories: Array<{
    name: string
    count: number
    color: string
  }>
}

export interface StatsContent {
  title: string
  subtitle: string
  stats: Array<{
    number: string
    label: string
    description: string
    icon: string
  }>
}

export interface TestimonialsContent {
  title: string
  subtitle: string
  testimonials: Array<{
    name: string
    role: string
    imageSrc: string
    quote: string
  }>
}

export interface FooterContent {
  logo: {
    src: string
    alt: string
    name: string
    tagline: string
  }
  description: string
  stats: Array<{
    title: string
    subtitle: string
  }>
  sections: Array<{
    title: string
    links: Array<{
      name: string
      href: string
    }>
  }>
  copyright: string
  legalLinks: Array<{
    name: string
    href: string
  }>
}
