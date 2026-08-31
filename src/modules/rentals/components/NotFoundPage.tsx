import Link from 'next/link'

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <p className="not-found-page__code">404</p>
      <div className="not-found-page__copy">
        <section lang="en">
          <p className="not-found-page__eyebrow">Lost in Costa Rica?</p>
          <h1>This page has wandered away.</h1>
          <p>The home or page you requested may have moved. Let’s return to somewhere familiar.</p>
          <div className="not-found-page__actions">
            <Link className="button button--dark" href="/en">
              Return home
            </Link>
            <Link className="button button--outline" href="/en/properties">
              Explore homes
            </Link>
          </div>
        </section>
        <section lang="es">
          <p className="not-found-page__eyebrow">¿Te perdiste en Costa Rica?</p>
          <h2>Esta página tomó otro camino.</h2>
          <p>La casa o página que buscas pudo haberse movido. Volvamos a un lugar conocido.</p>
          <div className="not-found-page__actions">
            <Link className="button button--dark" href="/es">
              Volver al inicio
            </Link>
            <Link className="button button--outline" href="/es/properties">
              Explorar casas
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
