export default function manifest() {
  return {
    name: 'Ben Yedder Parfums',
    short_name: 'BYP',
    description: 'Parfums de qualité premium en Tunisie - Chanel, Givenchy, YSL, Lancôme',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8DC63F',
    icons: [
      {
        src: '/byp-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
  }
}
