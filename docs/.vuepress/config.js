module.exports = {
  title: 'Vue JSON:API',
  description: 'Painless integration with well formatted API',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Github', link: 'https://github.com/rossinek/vue-jsonapi' },
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '',
            'installation',
            'basic-usage',
          ]
        },
      ],
    }
  }
}
