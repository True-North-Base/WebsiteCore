'use client'

import { useActionState, useEffect, useId, useRef } from 'react'
import Link from 'next/link'

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
  const contactHelpId = `${formId}-contact-help`

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state.status])

  function error(field: InquiryField) {
    const message = state.errors?.[field]
    return message ? (
      <span className="inquiry-form__error" id={`${formId}-${field}-error`}>
        {message}
      </span>
    ) : null
  }

  function describedBy(field: InquiryField, includeContactHelp = false) {
    return (
      [
        includeContactHelp ? contactHelpId : undefined,
        state.errors?.[field] ? `${formId}-${field}-error` : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined
    )
  }

  return (
    <form action={formAction} className="inquiry-form" ref={formRef}>
      <input name="locale" type="hidden" value={locale} />
      <input name="source" type="hidden" value={source} />
      {propertySlug ? <input name="propertySlug" type="hidden" value={propertySlug} /> : null}
      <div aria-hidden="true" className="inquiry-form__honeypot">
        <label htmlFor={`${formId}-website`}>{t.honeypot}</label>
        <input
          autoComplete="off"
          id={`${formId}-website`}
          name="website"
          tabIndex={-1}
          type="text"
        />
      </div>

      <label>
        <span>{t.name}</span>
        <input
          aria-describedby={describedBy('name')}
          aria-invalid={Boolean(state.errors?.name)}
          autoComplete="name"
          maxLength={120}
          name="name"
          required
        />
        {error('name')}
      </label>
      <div className="inquiry-form__row">
        <label>
          <span>{t.email}</span>
          <input
            aria-describedby={describedBy('email', true)}
            aria-invalid={Boolean(state.errors?.email)}
            autoComplete="email"
            maxLength={254}
            name="email"
            type="email"
          />
          {error('email')}
        </label>
        <label>
          <span>{t.phone}</span>
          <input
            aria-describedby={describedBy('phone', true)}
            aria-invalid={Boolean(state.errors?.phone)}
            autoComplete="tel"
            maxLength={40}
            name="phone"
            type="tel"
          />
          {error('phone')}
        </label>
      </div>
      <label>
        <span>{t.dates}</span>
        <input
          aria-describedby={describedBy('requestedDates')}
          aria-invalid={Boolean(state.errors?.requestedDates)}
          maxLength={120}
          name="requestedDates"
          placeholder={t.datesPlaceholder}
        />
        {error('requestedDates')}
      </label>
      <label>
        <span>{t.message}</span>
        <textarea
          aria-describedby={describedBy('message')}
          aria-invalid={Boolean(state.errors?.message)}
          maxLength={3000}
          name="message"
          rows={4}
        />
        {error('message')}
      </label>
      <label className="inquiry-form__consent">
        <input name="privacyConsent" required type="checkbox" value="accepted" />
        <span>
          {t.privacyConsent}{' '}
          <Link href={`/${locale}/privacy`} target="_blank">
            {t.privacyLink}
          </Link>
        </span>
        {error('privacyConsent')}
      </label>
      <button className="button button--dark" disabled={pending} type="submit">
        {pending ? t.sending : t.submit}
      </button>
      {state.message ? (
        <p className={`inquiry-form__status inquiry-form__status--${state.status}`} role="status">
          {state.message}
        </p>
      ) : null}
      <small id={contactHelpId}>{t.contactRequirement}</small>
    </form>
  )
}
