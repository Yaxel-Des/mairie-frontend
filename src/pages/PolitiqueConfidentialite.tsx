import ApiError from '../components/ApiError';
import ExpandableCmsContent from '../components/ExpandableCmsContent';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import { getCmsContentField, getPageLegale } from '../data/api';
import useApiResource from '../hooks/useApiResource';

const unavailableMessage = 'Cette information sera bientôt disponible.';

const privacySections = [
  {
    id: 'collected-data',
    title: 'Données collectées',
    fields: ['DonneesCollectees', 'DonnéesCollectées'],
  },
  {
    id: 'purposes',
    title: 'Finalités du traitement',
    fields: ['Finalites', 'Finalités'],
  },
  {
    id: 'retention',
    title: 'Durée de conservation',
    fields: ['DureeConservation', 'DuréeConservation'],
  },
  {
    id: 'users-rights',
    title: 'Droits des usagers',
    fields: ['DroitsUsagers', 'DroitsDesUsagers'],
  },
];

export default function PolitiqueConfidentialite() {
  const { data, isLoading, error } = useApiResource(getPageLegale);

  return (
    <>
      <PageHeader
        title="Politique de confidentialité"
        intro="Informations sur le traitement des données personnelles par la Mairie de Bingerville."
      />

      <article className="wrap max-w-4xl space-y-6 py-10">
        {isLoading ? <Loading /> : null}
        {error ? <ApiError message={error} /> : null}

        {!isLoading && !error && privacySections.map((section) => {
          const content = getCmsContentField(data, ...section.fields);
          return (
          <section
            key={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="card p-6 sm:p-8"
          >
            <h2
              id={`${section.id}-heading`}
              className="font-serif text-2xl font-semibold text-mairie-brown"
            >
              {section.title}
            </h2>
            {content ? (
              <div className="mt-3"><ExpandableCmsContent html={content} /></div>
            ) : (
              <p className="mt-3 text-base leading-7 text-mairie-ink">{unavailableMessage}</p>
            )}
          </section>
          );
        })}
      </article>
    </>
  );
}
