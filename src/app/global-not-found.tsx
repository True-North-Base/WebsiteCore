import type { Metadata } from 'next'
import { Archivo, Cormorant_Garamond } from 'next/font/google'

import { NotFoundPage } from '@/modules/rentals/components/NotFoundPage'
import './(frontend)/styles.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Page not found · Página no encontrada · CR Mariposa',
  description: 'Return to CR Mariposa Rentals in English or Spanish.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${cormorant.variable} ${archivo.variable}`}>
      <body>
        <NotFoundPage />
      </body>
    </html>
  )
}
