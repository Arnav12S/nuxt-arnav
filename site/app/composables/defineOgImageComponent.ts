export const defineOgImageComponent = (name: string) => {
  useHead({
    meta: [{
      property: 'og:image:component',
      content: name
    }]
  })
} 