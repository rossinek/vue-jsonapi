module.exports = {
  title: 'Vue JSON:API',
  description: 'Painless integration with well formatted API',
  base: '/vue-jsonapi/',
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
