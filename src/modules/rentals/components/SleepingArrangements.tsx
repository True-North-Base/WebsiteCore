import Image from 'next/image'

import type { SleepingArrangement } from '../lib/phase2-content'

type SleepingArrangementsProps = {
  arrangements: SleepingArrangement[]
  heading: string
}

export function SleepingArrangements({ arrangements, heading }: SleepingArrangementsProps) {
  if (!arrangements.length) return null

  return (
    <section className="sleeping-section">
      <h2>{heading}</h2>
      <div aria-label={heading} className="sleeping-track">
        {arrangements.map((arrangement, index) => (
          <article className="sleeping-card" key={`${arrangement.roomName}-${index}`}>
            <div className="sleeping-card__image">
              <Image
                alt={arrangement.image.alt}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1040px) 42vw, 360px"
                src={arrangement.image.src}
              />
            </div>
            <h3>{arrangement.roomName}</h3>
            <p>{arrangement.bedSummary}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
