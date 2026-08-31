import type { Dictionary } from '@/i18n/dictionaries/en'

export function MobileContactBar({
  phoneHref,
  t,
  whatsappHref,
}: {
  phoneHref: string
  t: Dictionary
  whatsappHref: string
}) {
  return (
    <aside aria-label={`${t.cta.whatsapp} / ${t.cta.call}`} className="mobile-contact-bar">
      <a className="button button--dark" href={whatsappHref} rel="noreferrer" target="_blank">
        {t.cta.whatsapp}
      </a>
      <a className="button button--outline" href={phoneHref}>
        {t.cta.call}
      </a>
    </aside>
  )
}
