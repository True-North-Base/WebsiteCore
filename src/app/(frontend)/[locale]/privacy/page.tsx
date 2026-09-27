import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getDictionary, isLocale } from '@/i18n'
import { localizedAlternates } from '@/modules/rentals/lib/seo'

const content = {
  en: {
    intro:
      'This notice explains how CR Mariposa Rentals uses the personal information you choose to send through this website.',
    sections: [
      {
        heading: 'Who is responsible',
        paragraphs: [
          'CR Mariposa Rentals is responsible for the inquiry information collected on this website. Privacy requests may be sent to mariposacrtravel@gmail.com.',
        ],
      },
      {
        heading: 'Information we collect and why',
        paragraphs: [
          'When you submit an inquiry, we collect your name, at least one reply channel, and any dates or message you provide. We use it only to answer your request, recommend a suitable home, and follow up about a possible or confirmed stay.',
          'The form also stores a non-reversible technical identifier with the inquiry. It is used only to limit repeated submissions within a 15-minute window and is deleted with the inquiry. It does not store your raw network address.',
        ],
      },
      {
        heading: 'Consent and sharing',
        paragraphs: [
          'Submitting the form requires your express consent to use the information for the purposes above. You may withdraw that consent by contacting us. We do not sell your information.',
          'Our website, database, media, and inquiry-email delivery providers may process information only as needed to operate and secure the service and notify the family of your request. We disclose information to another party only when you authorize it or when the law requires it.',
        ],
      },
      {
        heading: 'Retention',
        paragraphs: [
          'An inquiry is reviewed for deletion 24 months after it is received. We may keep information longer only while there is an active stay or business relationship, when you ask us to, or when a legal obligation requires it.',
        ],
      },
      {
        heading: 'Analytics and browser storage',
        paragraphs: [
          'Google Analytics is optional. It is not loaded unless you select “Allow analytics.” Your choice is stored in your browser. The public website does not use advertising cookies.',
        ],
      },
      {
        heading: 'Your choices and rights',
        paragraphs: [
          'You may ask what information we hold about you and request access, correction, deletion, or withdrawal of consent. Contact mariposacrtravel@gmail.com and provide enough detail for us to identify the inquiry safely.',
        ],
      },
    ],
    back: 'Back to CR Mariposa',
  },
  es: {
    intro:
      'Este aviso explica cómo CR Mariposa Rentals utiliza la información personal que decides enviar mediante este sitio web.',
    sections: [
      {
        heading: 'Quién es responsable',
        paragraphs: [
          'CR Mariposa Rentals es responsable de la información de consultas recopilada en este sitio. Puedes enviar solicitudes de privacidad a mariposacrtravel@gmail.com.',
        ],
      },
      {
        heading: 'Información que recopilamos y finalidad',
        paragraphs: [
          'Cuando envías una consulta, recopilamos tu nombre, al menos un medio de respuesta y las fechas o el mensaje que proporciones. Los usamos únicamente para responder, recomendar una vivienda adecuada y dar seguimiento a una estadía posible o confirmada.',
          'El formulario también conserva con la consulta un identificador técnico no reversible. Se utiliza únicamente para limitar envíos repetidos durante un periodo de 15 minutos y se elimina junto con la consulta. No almacena tu dirección de red original.',
        ],
      },
      {
        heading: 'Consentimiento y divulgación',
        paragraphs: [
          'Para enviar el formulario debes aceptar expresamente el uso de tus datos para los fines anteriores. Puedes retirar ese consentimiento contactándonos. No vendemos tu información.',
          'Los proveedores del sitio web, base de datos, almacenamiento de medios y entrega de correos de consultas pueden procesar información únicamente cuando sea necesario para operar y proteger el servicio y avisar a la familia sobre tu solicitud. Solo comunicamos información a otra parte con tu autorización o cuando la ley lo exige.',
        ],
      },
      {
        heading: 'Conservación',
        paragraphs: [
          'Cada consulta se revisa para su eliminación 24 meses después de recibirse. Podemos conservarla por más tiempo únicamente mientras exista una estadía o relación comercial activa, si nos lo solicitas o si una obligación legal lo exige.',
        ],
      },
      {
        heading: 'Analítica y almacenamiento del navegador',
        paragraphs: [
          'Google Analytics es opcional. No se carga a menos que selecciones “Permitir analítica”. Tu elección se guarda en el navegador. El sitio público no utiliza cookies publicitarias.',
        ],
      },
      {
        heading: 'Tus opciones y derechos',
        paragraphs: [
          'Puedes preguntar qué información conservamos y solicitar acceso, corrección, eliminación o retiro del consentimiento. Escribe a mariposacrtravel@gmail.com e incluye datos suficientes para que podamos identificar la consulta de forma segura.',
        ],
      },
    ],
    back: 'Volver a CR Mariposa',
  },
} as const

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return {
    title: t.privacy.title,
    description: content[locale].intro,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: localizedAlternates('privacy'),
    },
  }
}

export default async function PrivacyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const page = content[locale]

  return (
    <main className="privacy-page">
      <div className="privacy-page__content">
        <Link className="privacy-page__back" href={`/${locale}`}>
          ← {page.back}
        </Link>
        <h1>{t.privacy.title}</h1>
        <p className="privacy-page__updated">{t.privacy.updated}</p>
        <p className="privacy-page__intro">{page.intro}</p>
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </main>
  )
}
