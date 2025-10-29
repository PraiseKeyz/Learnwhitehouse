import {
  HeroContent,
  CoursesPageContent,
  FeaturedCoursesContent,
  CourseCategoriesContent,
  StatsContent,
  TestimonialsContent,
  FooterContent
} from './types'

export const heroContent: HeroContent = {
  title: "Transform Your Career With Expert-Led Courses",
  subtitle: "Access 500+ detailed, expert-written courses designed by industry professionals. Build practical skills with content recognized by leading organizations.",
  ctaPrimary: {
    text: "Explore All Courses",
    href: "/courses"
  },
  ctaSecondary: {
    text: "Request Brochure",
    href: "#"
  },
  stats: [
    { number: "500+", label: "Professional Courses", description: "Expert-written content" },
    { number: "50+", label: "Industry Experts", description: "Course development team" },
    { number: "50K+", label: "Active Students", description: "Learning worldwide" },
    { number: "24/7", label: "Course Access", description: "Learn at your own pace" }
  ],
  trustIndicators: [
    { icon: "Award", text: "Expert-written content" },
    { icon: "Users", text: "50+ Industry professionals" },
    { icon: "GraduationCap", text: "Certified courses" }
  ]
}

export const coursesPageContent: CoursesPageContent = {
  hero: {
    title: "Professional Development Courses",
    subtitle: "Choose from 500+ expert-led courses designed to advance your career. Learn from industry professionals and gain practical skills.",
    searchPlaceholder: "Search courses by title, instructor, or keyword..."
  },
  filters: {
    categoriesTitle: "Categories",
    levelsTitle: "Level",
    priceRangeTitle: "Price Range",
    searchTitle: "Search Courses",
    resultsText: (count: number) => `Showing ${count} courses`
  },
  emptyState: {
    title: "No courses found",
    message: "Try adjusting your filters or search query"
  },
  cta: {
    title: "Not sure which course to choose?",
    subtitle: "Our advisors can help you find the perfect course for your career goals.",
    buttonText: "Talk to an Advisor"
  }
}

export const featuredCoursesContent: FeaturedCoursesContent = {
  title: "Featured Professional Courses",
  subtitle: "Explore our most popular courses designed to enhance your skills and advance your career",
  viewAllText: "View All 500+ Courses",
  viewAllHref: "/courses"
}

export const courseCategoriesContent: CourseCategoriesContent = {
  title: "Explore Course Categories",
  subtitle: "Choose from our comprehensive range of professional development categories",
  categories: [
    { name: 'Marketing & Communication', count: 8, color: 'blue' },
    { name: 'Media & Journalism', count: 4, color: 'purple' },
    { name: 'Management', count: 4, color: 'green' },
    { name: 'Finance & Development', count: 4, color: 'yellow' },
    { name: 'Popular Courses', count: 4, color: 'red' }
  ]
}

export const statsContent: StatsContent = {
  title: "Professional Development That Delivers Results",
  subtitle: "Our courses are designed by industry professionals to provide practical, applicable knowledge that advances your career",
  stats: [
    {
      number: "500+",
      label: "Professional Courses",
      description: "Expert-written content",
      icon: "GraduationCap"
    },
    {
      number: "50+",
      label: "Industry Experts",
      description: "Course development team",
      icon: "TrendingUp"
    },
    {
      number: "50K+",
      label: "Active Students",
      description: "Learning worldwide",
      icon: "Users"
    },
    {
      number: "24/7",
      label: "Course Access",
      description: "Learn at your own pace",
      icon: "Clock"
    }
  ]
}

export const testimonialsContent: TestimonialsContent = {
  title: "What Our Students Say",
  subtitle: "Feedback from professionals who have taken our courses",
  testimonials: [
    {
      name: "Sarah Chen",
      role: "Marketing Professional",
      imageSrc: "/professional-woman-data-scientist-testimonial.jpg",
      quote: "The marketing communication course provided me with practical knowledge that I could immediately apply in my work. The content was well-structured and relevant to current industry practices."
    },
    {
      name: "Marcus Johnson",
      role: "Community Development Worker",
      imageSrc: "/professional-woman-with-glasses-smiling-confidentl.jpg",
      quote: "The community development course gave me valuable insights into sustainable development practices. The course materials were comprehensive and examples were practical and relevant."
    }
  ]
}

export const footerContent: FooterContent = {
  logo: {
    src: "/logo.jpeg",
    alt: "GPS360 Academy logo",
    name: "GPS360 Academy",
    tagline: "Global Platform for Success"
  },
  description: "Professional development courses designed by industry experts to help you advance your career with practical, applicable knowledge.",
  stats: [
    { title: "500+ Courses", subtitle: "Professional Development" },
    { title: "Expert Content", subtitle: "Industry Professionals" }
  ],
  sections: [
    {
      title: "Popular Courses",
      links: [
        { name: "Marketing", href: "/courses?category=Popular Courses" },
        { name: "Digital Marketing", href: "/courses?category=Marketing & Communication" },
        { name: "Strategic Marketing", href: "/courses?category=Management" },
        { name: "Marketing Communication", href: "/courses?category=Popular Courses" }
      ]
    },
    {
      title: "Programs & Services",
      links: [
        { name: "Media Management", href: "/courses?category=Media & Journalism" },
        { name: "Real Estate Management", href: "/courses?category=Management" },
        { name: "Micro Finance", href: "/courses?category=Finance & Development" },
        { name: "All Courses", href: "/courses" }
      ]
    },
    {
      title: "Support & About",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Course Certificates", href: "#" },
        { name: "Our Mission", href: "#" },
        { name: "Partnerships", href: "#" }
      ]
    }
  ],
  copyright: "© 2025 GPS360 Academy. All rights reserved.",
  legalLinks: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" }
  ]
}
