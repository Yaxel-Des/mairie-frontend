import { useSearchParams } from 'react-router-dom';
import ApiError from '../components/ApiError';
import ExpandableCmsContent from '../components/ExpandableCmsContent';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import { getCmsContentField, getDemarches, getMediaFileUrl, getRecordKey, getTextField } from '../data/api';
import { procedureIcons } from '../components/procedureIcons';
import useApiResource from '../hooks/useApiResource';

const unavailableMessage = 'Cette information sera bientôt disponible.';

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: services, isLoading, error } = useApiResource(getDemarches);
  const requestedId = searchParams.get('demarche');
  const selectedService =
    services?.find((service) => getRecordKey(service) === requestedId || String(service.id) === requestedId) ??
    services?.[0] ??
    null;
  const selectedId = selectedService ? getRecordKey(selectedService) : '';
  const requiredDocuments = selectedService
    ? selectedService.Pieces ?? selectedService.PiecesAFournir ?? selectedService.DocumentsRequis
    : null;
  const pdfUrl = selectedService
    ? getMediaFileUrl(selectedService.Pdf ?? selectedService.FichierPDF ?? selectedService.Fichier)
    : null;

  return (
    <>
      <PageHeader
        title="Services municipaux"
        intro="Sélectionnez une démarche pour consulter les pièces à fournir, le délai, le coût et le lieu."
      />

      <div className="wrap grid gap-8 py-10 md:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.7fr)] md:items-start md:gap-10">
        {isLoading ? <Loading /> : null}
        {error ? <ApiError message={error} /> : null}
        <nav aria-label="Liste des démarches" className="md:sticky md:top-28">
          <h2 className="mb-3 font-serif text-xl font-semibold text-mairie-brown">Démarches</h2>
          <ul className="card divide-y divide-mairie-line overflow-hidden">
            {(services ?? []).map((service) => {
              const serviceId = getRecordKey(service);
              const isSelected = serviceId === selectedId;
              return (
                <li key={serviceId}>
                  <button
                    type="button"
                    aria-current={isSelected ? 'true' : undefined}
                    className={`flex min-h-[3.25rem] w-full items-center gap-3 border-l-4 px-4 py-3 text-left text-sm leading-5 transition-colors ${
                      isSelected
                        ? 'border-mairie-gold bg-mairie-lagoonSoft font-semibold text-mairie-brown'
                        : 'border-transparent text-mairie-ink hover:bg-mairie-mist'
                    }`}
                    onClick={() => setSearchParams({ demarche: serviceId }, { replace: true })}
                  >
                    <Icon
                      name={procedureIcons[String(service.id)] ?? 'document'}
                      className={`h-5 w-5 shrink-0 ${isSelected ? 'text-mairie-lagoon' : 'text-mairie-muted'}`}
                    />
                    {getTextField(service, 'Titre', 'Nom') || unavailableMessage}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section
          aria-live="polite"
          aria-labelledby="service-detail-heading"
          className="card overflow-hidden"
        >
          {!isLoading && !error && selectedService ? (
            <>
              <div className="border-b border-mairie-line px-6 py-6 sm:px-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mairie-lagoonSoft text-mairie-lagoon">
                    <Icon name={procedureIcons[String(selectedService.id)] ?? 'document'} className="h-6 w-6" />
                  </span>
                  <div>
                    <h2
                      id="service-detail-heading"
                      className="font-serif text-2xl font-semibold leading-tight text-mairie-brown"
                    >
                      {getTextField(selectedService, 'Titre', 'Nom') || unavailableMessage}
                    </h2>
                    <div className="mt-2">
                      <ExpandableCmsContent
                        html={getCmsContentField(selectedService, 'Description') || unavailableMessage}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <dl className="grid gap-px bg-mairie-line sm:grid-cols-3">
                {[
                  { label: 'Délai', value: getTextField(selectedService, 'Delai', 'Délai') || unavailableMessage, icon: 'clock' as const },
                  { label: 'Coût', value: getTextField(selectedService, 'Cout', 'Coût') || unavailableMessage, icon: 'coin' as const },
                  { label: 'Lieu', value: getTextField(selectedService, 'Lieu') || unavailableMessage, icon: 'pin' as const },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-white px-6 py-5">
                    <dt className="flex items-center gap-2 text-sm font-semibold text-mairie-brown">
                      <Icon name={icon} className="h-4 w-4 text-mairie-lagoon" />
                      {label}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-6 text-mairie-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="px-6 py-6 sm:px-8">
                <h3 className="font-serif text-lg font-semibold text-mairie-brown">Pièces à fournir</h3>
                {requiredDocuments ? (
                  <div className="mt-3">
                    <ExpandableCmsContent html={requiredDocuments} />
                  </div>
                ) : (
                  <p className="mt-3 text-base text-mairie-muted">{unavailableMessage}</p>
                )}

                <div className="mt-7 flex flex-col gap-2 border-t border-mairie-line pt-6">
                  {pdfUrl ? (
                    <a className="btn-primary" href={pdfUrl} download>
                      <Icon name="download" className="h-4 w-4" />
                      Télécharger le formulaire (PDF)
                    </a>
                  ) : (
                    <p className="text-base text-mairie-muted">{unavailableMessage}</p>
                  )}
                </div>
              </div>
            </>
          ) : !isLoading && !error ? (
            <p className="p-6 text-base text-mairie-ink" role="status">Aucune démarche n’est actuellement disponible.</p>
          ) : null}
        </section>
      </div>
    </>
  );
}
