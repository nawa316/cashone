import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cashone — Personal Finance & Ledger Tracker',
    short_name: 'Cashone',
    description: 'High-performance multi-account cashflow tracker with atomic double-entry ledger integrity, category analytics, and receipt storage.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0F19',
    theme_color: '#0E1526',
    orientation: 'portrait-primary',
    categories: ['finance', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
