import type { KnowledgeIconName, ThingsToKnowContent } from '../lib/phase2-content'

function KnowledgeIcon({ name }: { name: KnowledgeIconName }) {
  const props = {
    'aria-hidden': true,
    fill: 'none',
    height: 22,
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.5,
    viewBox: '0 0 24 24',
    width: 22,
  }

  if (name === 'check') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </svg>
    )
  }

  if (name === 'clock') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.2 2" />
      </svg>
    )
  }

  if (name === 'guests') {
    return (
      <svg {...props}>
        <circle cx="8" cy="9" r="2.5" />
        <circle cx="16.5" cy="10" r="2" />
        <path d="M3.5 18c.6-3 2.2-4.5 4.8-4.5S12.5 15 13 18M14 14.5c2.9-.7 5.2.5 6 3" />
      </svg>
    )
  }

  if (name === 'pets') {
    return (
      <svg {...props}>
        <circle cx="7" cy="8" r="1.7" />
        <circle cx="12" cy="6.5" r="1.7" />
        <circle cx="17" cy="8" r="1.7" />
        <path d="M7.5 15.5c0-3 2-5 4.5-5s4.5 2 4.5 5c0 2-1.4 3-3.1 2.1a3 3 0 0 0-2.8 0c-1.7.9-3.1-.1-3.1-2.1Z" />
      </svg>
    )
  }

  if (name === 'smoking') {
    return (
      <svg {...props}>
        <path d="M4 14h11v4H4zM18 14v4M21 14v4M14 9c2.5 0 2-3 0-3M18 10c3 0 3-5 0-5" />
        <path d="m4 4 16 16" />
      </svg>
    )
  }

  if (name === 'events') {
    return (
      <svg {...props}>
        <path d="m4 16 9-9 4 4-9 9H4v-4Z" />
        <path d="m12 8 4 4M15 5l1-2M19 8l2-1M12 4l-1-2" />
      </svg>
    )
  }

  return (
    <svg {...props}>
      <rect height="15" rx="1.5" width="18" x="3" y="5" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  )
}

function MoreDetails({ children, label }: { children?: string; label: string }) {
  if (!children) return null
  return (
    <details className="things-more">
      <summary>{label}</summary>
      <p>{children}</p>
    </details>
  )
}

export function ThingsToKnow({
  content,
  heading,
}: {
  content: ThingsToKnowContent
  heading: string
}) {
  return (
    <section className="things-section">
      <h2>{heading}</h2>
      <div className="things-grid">
        <article>
          <h3>
            <KnowledgeIcon name="check" />
            <span>{content.cancellation.title}</span>
          </h3>
          <p>{content.cancellation.summary}</p>
          <MoreDetails label={content.readMore}>{content.cancellation.details}</MoreDetails>
        </article>

        {content.rules.items.length || content.rules.details ? (
          <article>
            <h3>{content.rules.title}</h3>
            <ul>
              {content.rules.items.map((item) => (
                <li key={`${item.icon}-${item.text}`}>
                  <KnowledgeIcon name={item.icon} />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <MoreDetails label={content.readMore}>{content.rules.details}</MoreDetails>
          </article>
        ) : null}

        {content.stay.items.length ? (
          <article>
            <h3>{content.stay.title}</h3>
            <ul>
              {content.stay.items.map((item) => (
                <li key={`${item.icon}-${item.text}`}>
                  <KnowledgeIcon name={item.icon} />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </article>
        ) : null}
      </div>
    </section>
  )
}
