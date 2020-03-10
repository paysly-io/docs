module.exports = {
  title: 'Paysly Docs',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: 'img/icon_black.png',
    sidebar: [
      ['overview', 'Overview'],
      {
        sidebarDepth: 3,
        title: 'Guides',
        children: [
          'guides/one-time-charges',
          'guides/recurring-charges',
          ['guides/verifying-a-payment', 'Verifying a Payment']
        ]
      },
      ['api', 'API']
    ]
  },
}
