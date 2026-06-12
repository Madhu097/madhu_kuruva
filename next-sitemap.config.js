/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://madhukuruva.vercel.app/',
  generateRobotsTxt: true,
  outDir: 'dist',
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
}