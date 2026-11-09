import ApiError from '../components/ApiError';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import { getPageLegale, getTextField, sanitizeCmsHtml } from '../data/api';
import useApiResource from '../hooks/useApiResource';

const unavailableMessage = 'Cette information sera bientôt disponible.';

const legalSections = [
  {
    id: 'publication-heading',
    title: 'Directeur de publication',
    fields: ['DirecteurPublication', 'DirecteurDePublication'],
  },
  {
    id: 'hosting-heading',
    title: 'Hébergeur',
    fields: ['Hebergeur', 'Hébergeur'],
  },
  {
    id: 'legal-content-heading',
    title: 'Contenus et propriété',
    fields: ['ContenusEtPropriete', 'ConditionsUtilisation', 'ProprieteIntellectuelle'],
  },
];

export default function MentionsLegales() {
  const { data, isLoading, error } = useApiResource(getPageLegale);
  const address = getTextField(data, 'Adresse');
  const phone = getTextField(data, 'Telephone', 'Téléphone');
  const email = getTextField(data, 'Email', 'E-mail');

  return (
    <>
      <PageHeader
        title="Mentions légales"
        intro="Informations relatives à l’édition et à l’hébergement du site."
      />

      <article className="wrap max-w-4xl space-y-6 py-10">
        {isLoading ? <Loading /> : null}
        {error ? <ApiError message={error} /> : null}

        {!isLoading && !error && (
          <>
            <section aria-labelledby="publisher-heading" className="card p-6 sm:p-8">
              <h2 id="publisher-heading" className="font-serif text-2xl font-semibold text-mairie-brown">
                Éditeur du site
              </h2>
              <h3 className="mt-3 font-semibold text-mairie-brown">
                {getTextField(data, 'Editeur', 'Éditeur') || 'Mairie de Bingerville'}
              </h3>
              <div className="mt-3 space-y-2 text-base leading-7 text-mairie-ink">
                <p>Adresse : {address || unavailableMessage}</p>
                <p>Téléphone : {phone || unavailableMessage}</p>
                <p>Adresse e-mail : {email || unavailableMessage}</p>
              </div>
            </section>

            {legalSections.map((section) => (
              <section key={section.id} aria-labelledby={section.id} className="card p-6 sm:p-8">
                <h2 id={section.id} className="font-serif text-2xl font-semibold text-mairie-brown">
                  {section.title}
                </h2>
                {getTextField(data, ...section.fields) ? (
                  <div
                    className="cms-content mt-3"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeCmsHtml(getTextField(data, ...section.fields)),
                    }}
                  />
                ) : (
                  <p className="mt-3 text-base leading-7 text-mairie-ink">{unavailableMessage}</p>
                )}
              </section>
            ))}
          </>
        )}
      </article>
    </>
  );
}
