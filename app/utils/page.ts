export const findPageHeadline = (page: any) => {
  return page.headline || page.description || page.title
} 