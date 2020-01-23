module.exports = {
  title: 'Vue JSON:API',
  description: 'Painless integration with well formatted API',
  base: '/vue-jsonapi/',
  head: [
    ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png"}],
    ['link', { rel: "manifest", href: "/site.webmanifest"}],
    ['link', { rel: "shortcut icon", href: "/favicon.ico"}],
    ['meta', { name: "theme-color", content: "#ffffff"}],
  ],
  themeConfig: {
    logo: '/logo.png',
    smoothScroll: true,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Github', link: 'https://github.com/rossinek/vue-jsonapi' },
    ],
    sidebar: {
      '/guide/': [
        '',
        'installation',
        'normalization',
        {
          title: 'Basic usage',
          collapsable: false,
          sidebarDepth: 3,
          children: [
            'basic-usage/',
            'basic-usage/fetching-data',
            'basic-usage/creating-updating-deleting-data',
          ],
        },
        'good-practices',
      ],
      '/api/': [
        'dollar-jsonapi',
        'smart-query',
        'cache',
      ],
    },
  },
}
