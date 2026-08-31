'use client'

import { useActionState, useEffect, useId, useRef } from 'react'

import type { Dictionary } from '@/i18n/dictionaries/en'
import type { Locale } from '@/i18n'

import { submitInquiry } from '../actions/submitInquiry'
import { initialInquiryState, type InquiryField, type InquirySource } from '../lib/inquiry'

type InquiryFormProps = {
  locale: Locale
  propertySlug?: string
  source: InquirySource
  t: Dictionary['inquiryForm']
}

export function InquiryForm({ locale, propertySlug, source, t }: InquiryFormProps) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialInquiryState)
  const formRef = useRef<HTMLFormElement>(null)
  const formId = useId()

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state.status])

  function error(field: InquiryField) {
    const message = state.errors?.[field]
    return message ? <span className="inquiry-form__error" id={`${formId}-${field}-error`}>{message}</span> : null
  }

  return (
    <form action={formAction} className="inquiry-form" ref={formRef}>
      <input name="locale" type="hidden" value={locale} />
      <input name="source" type="hidden" value={source} />
      {propertySlug ? <input name="propertySlug" type="hidden" value={propertySlug} /> : null}

      <label>
        <span>{t.name}</span>
        <input aria-describedby={state.errors?.name ? `${formId}-name-error` : undefined} autoComplete="name" maxLength={120} name="name" required />
        {error('name')}
      </label>
      <div className="inquiry-form__row">
        <label>
          <span>{t.email}</span>
          <input aria-describedby={state.errors?.email ? `${formId}-email-error` : undefined} autoComplete="email" maxLength={254} name="email" type="email" />
          {error('email')}
        </label>
        <label>
          <span>{t.phone}</span>
          <input aria-describedby={state.errors?.phone ? `${formId}-phone-error` : undefined} autoComplete="tel" maxLength={40} name="phone" type="tel" />
          {error('phone')}
        </label>
      </div>
      <label>
        <span>{t.dates}</span>
        <input aria-describedby={state.errors?.requestedDates ? `${formId}-requestedDates-error` : undefined} maxLength={120} name="requestedDates" placeholder={t.datesPlaceholder} />
        {error('requestedDates')}
      </label>
      <label>
        <span>{t.message}</span>
        <textarea aria-describedby={state.errors?.message ? `${formId}-message-error` : undefined} maxLength={3000} name="message" rows={4} />
        {error('message')}
      </label>
      <button className="button button--dark" disabled={pending} type="submit">
        {pending ? t.sending : t.submit}
      </button>
      {state.message ? (
        <p className={`inquiry-form__status inquiry-form__status--${state.status}`} role="status">
          {state.message}
        </p>
      ) : null}
      <small>{t.contactRequirement}</small>
    </form>
  )
}
