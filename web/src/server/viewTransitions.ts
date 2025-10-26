export default {
  BLOG: {
    TITLE: (b: string) => `BLOG-TITLE-${b}`,
    DESCRIPTION: (b: string) => `BLOG-DESCRIPTION-${b}`,
    IMAGE: (b: string) => `BLOG-IMAGE-${b}`,
  },
} as const;
