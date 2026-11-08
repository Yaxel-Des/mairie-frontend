import { useState, type FormEvent } from 'react';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';

const unavailableMessage = 'Cette information sera bientôt disponible.';

const privacyConsent =
  "J'accepte que mes données soient traitées par la Mairie de Bingerville pour répondre à ma demande, conformément à la loi ivoirienne n°2013-450.";

export default function Contact() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submissionFailed, setSubmissionFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consentGiven) return;

    const form = event.currentTarget;
    setIsSubmitting(true);
    setSubmissionMessage('');
    setSubmissionFailed(false);

    try {
      const response = await fetch('https://formspree.io/f/mbggbwgd', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: new FormData(form),
      });

      if (!response.ok) {
        setSubmissionFailed(true);
        setSubmissionMessage('Une erreur est survenue, veuillez réessayer.');
        return;
      }

      form.reset();
      setConsentGiven(false);
      setSubmissionMessage(
        'Votre message a bien été envoyé. La Mairie vous répondra dans les plus brefs délais.',
      );
    } catch {
      setSubmissionFailed(true);
      setSubmissionMessage('Une erreur est survenue, veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Contactez la Mairie"
        intro="Écrivez-nous ou retrouvez les coordonnées et horaires de la Mairie de Bingerville."
      />

      <div className="wrap grid gap-8 py-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.85fr)] lg:gap-10">
        <section aria-labelledby="contact-form-heading" className="card p-6 sm:p-8">
          <h2
            id="contact-form-heading"
            className="font-serif text-2xl font-semibold text-mairie-brown"
          >
            Envoyer une demande
          </h2>
          <p className="mt-1 text-sm text-mairie-muted">Tous les champs sont obligatoires.</p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-mairie-brown" htmlFor="full-name">
                  Nom complet
                </label>
                <input
                  autoComplete="name"
                  className="field"
                  id="full-name"
                  name="fullName"
                  required
                  type="text"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-mairie-brown" htmlFor="email">
                  Adresse e-mail
                </label>
                <input
                  autoComplete="email"
                  className="field"
                  id="email"
                  name="email"
                  required
                  type="email"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-mairie-brown" htmlFor="message">
                Message
              </label>
              <textarea className="field" id="message" name="message" required rows={6} />
            </div>

            <div className="flex items-start gap-3 rounded-md bg-mairie-mist p-4">
              <input
                checked={consentGiven}
                className="mt-1 h-5 w-5 shrink-0 accent-mairie-brown"
                id="privacy-consent"
                name="privacyConsent"
                onChange={(event) => setConsentGiven(event.target.checked)}
                required
                type="checkbox"
              />
              <label className="text-sm leading-6 text-mairie-ink" htmlFor="privacy-consent">
                {privacyConsent}
              </label>
            </div>

            <button
              className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-mairie-line disabled:text-mairie-muted sm:w-auto"
              disabled={isSubmitting || !consentGiven}
              type="submit"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>

            {submissionMessage && (
              <p
                aria-live={submissionFailed ? 'assertive' : 'polite'}
                className={`flex items-start gap-2 rounded-md px-4 py-3 text-sm leading-6 ${
                  submissionFailed
                    ? 'bg-[#FBE9EA] text-[#7A1F2B]'
                    : 'bg-[#DFF2E8] text-[#0B5F3C]'
                }`}
                role={submissionFailed ? 'alert' : 'status'}
              >
                {!submissionFailed && <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0" />}
                {submissionMessage}
              </p>
            )}
          </form>
        </section>

        <aside
          aria-labelledby="contact-details-heading"
          className="rounded-lg bg-mairie-brown p-6 text-white sm:p-8 lg:self-start"
        >
          <h2
            id="contact-details-heading"
            className="font-serif text-2xl font-semibold text-mairie-gold"
          >
            Coordonnées
          </h2>
          <address className="mt-6 space-y-6 text-sm leading-6 not-italic">
            <div className="flex gap-3">
              <Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-mairie-gold" />
              <div>
                <h3 className="font-semibold">Adresse</h3>
                <p className="mt-1 text-base">{unavailableMessage}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0 text-mairie-gold" />
              <div>
                <h3 className="font-semibold">Téléphone</h3>
                <p className="mt-1 text-base">{unavailableMessage}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Icon name="clock" className="mt-0.5 h-5 w-5 shrink-0 text-mairie-gold" />
              <div>
                <h3 className="font-semibold">Horaires</h3>
                <p className="mt-1 text-base">{unavailableMessage}</p>
              </div>
            </div>
          </address>
          <p className="mt-7 border-t border-white/20 pt-4 text-base leading-6 text-white/90">
            {unavailableMessage}
          </p>
        </aside>
      </div>
    </>
  );
}
