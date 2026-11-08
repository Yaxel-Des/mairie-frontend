import PageHeader from '../components/PageHeader';

const unavailableMessage = 'Cette information sera bientôt disponible.';

const privacySections = [
  {
    id: 'collected-data',
    title: 'Données collectées',
  },
  {
    id: 'purposes',
    title: 'Finalités du traitement',
  },
  {
    id: 'retention',
    title: 'Durée de conservation',
  },
  {
    id: 'users-rights',
    title: 'Droits des usagers',
  },
];

export default function PolitiqueConfidentialite() {
  return (
    <>
      <PageHeader
        title="Politique de confidentialité"
        intro="Informations sur le traitement des données personnelles par la Mairie de Bingerville."
      />

      <article className="wrap max-w-4xl space-y-6 py-10">
        <p className="rounded-md border-l-4 border-mairie-gold bg-white px-5 py-4 text-base leading-7 text-mairie-ink">
          {unavailableMessage}
        </p>

        {privacySections.map((section) => (
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
            <p className="mt-3 text-base leading-7 text-mairie-ink">{unavailableMessage}</p>
          </section>
        ))}
      </article>
    </>
  );
}
