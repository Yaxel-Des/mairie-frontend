import ApiError from '../components/ApiError';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import {
  getAdjoints,
  getImageUrl,
  getMairieParametres,
  getTextField,
  sanitizeCmsHtml,
  type StrapiRecord,
} from '../data/api';
import useApiResource from '../hooks/useApiResource';

const unavailableMessage = 'Cette information sera bientôt disponible.';

async function loadMairie(signal: AbortSignal) {
  const [mairie, adjoints] = await Promise.all([
    getMairieParametres(signal),
    getAdjoints(signal),
  ]);
  return { mairie, adjoints };
}

function getCouncilMembers(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const getText = (node: unknown): string => {
    if (!node || typeof node !== 'object') return '';
    if ('text' in node && typeof node.text === 'string') return node.text;
    if ('children' in node && Array.isArray(node.children)) {
      return node.children.map(getText).join('');
    }
    return '';
  };

  return value.map(getText).map((text) => text.trim()).filter(Boolean);
}

export default function LaMairie() {
  const { data, isLoading, error } = useApiResource(loadMairie);
  const mairie = data?.mairie ?? null;
  const adjoints = data?.adjoints ?? [];
  const presentation = getTextField(mairie, 'Presentation');
  const history = getTextField(mairie, 'Histoire');
  const organization = getTextField(mairie, 'Organigramme');
  const council = getCouncilMembers(mairie?.ConseilMunicipal);

  return (
    <>
      <PageHeader
        title="La Mairie"
        intro="Présentation de l’institution municipale et de son organisation."
      />

      <div className="wrap space-y-12 py-10">
        {isLoading ? <Loading /> : error ? <ApiError message={error} /> : null}

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <section aria-labelledby="presentation-heading">
            <h2 id="presentation-heading" className="font-serif text-2xl font-semibold text-mairie-brown">
              Présentation de la Mairie
            </h2>
            {presentation ? (
              <div
                className="cms-content mt-4"
                dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(presentation) }}
              />
            ) : (
              <p className="mt-3 text-base text-mairie-muted">{unavailableMessage}</p>
            )}
          </section>

          <section aria-labelledby="organization-heading">
            <h2 id="organization-heading" className="font-serif text-2xl font-semibold text-mairie-brown">
              Histoire
            </h2>
            {history ? (
              <div
                className="cms-content mt-4"
                dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(history) }}
              />
            ) : (
              <p className="mt-3 text-base text-mairie-muted">{unavailableMessage}</p>
            )}
          </section>
        </div>

        <section aria-labelledby="council-heading" className="border-t border-mairie-line pt-8">
          <h2 id="council-heading" className="font-serif text-2xl font-semibold text-mairie-brown">
            Le Conseil Municipal
          </h2>
          {council.length ? (
            <ul className="card mt-4 divide-y divide-mairie-line overflow-hidden">
              {council.map((member, index) => (
                <li key={`${member}-${index}`} className="px-5 py-4 text-base text-mairie-ink">
                  {member}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-base text-mairie-muted">{unavailableMessage}</p>
          )}
        </section>

        <section aria-labelledby="organization-chart-heading" className="border-t border-mairie-line pt-8">
          <h2 id="organization-chart-heading" className="font-serif text-2xl font-semibold text-mairie-brown">
            L’Organigramme
          </h2>
          {organization ? (
            <div
              className="cms-content mt-4"
              dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(organization) }}
            />
          ) : (
            <p className="mt-3 text-base text-mairie-muted">{unavailableMessage}</p>
          )}
        </section>

        <section aria-labelledby="deputies-heading">
          <h2 id="deputies-heading" className="font-serif text-2xl font-semibold text-mairie-brown">
            Les Adjoints au Maire
          </h2>
          {adjoints.length ? (
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {adjoints.map((adjoint: StrapiRecord) => {
                const name = getTextField(adjoint, 'Nom');
                return (
                  <li key={adjoint.documentId || adjoint.id} className="card overflow-hidden">
                    <img
                      src={getImageUrl(adjoint.Photo)}
                      alt={name ? `Portrait de ${name}` : 'Portrait d’un adjoint au Maire'}
                      className="aspect-[4/3] w-full border-b border-mairie-line object-cover"
                      width="640"
                      height="480"
                      loading="lazy"
                    />
                    <div className="p-5">
                      {name && <h3 className="font-serif text-xl font-semibold text-mairie-brown">{name}</h3>}
                      <p className="mt-1 text-base text-mairie-muted">
                        {getTextField(adjoint, 'Poste') || unavailableMessage}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : !isLoading && !error ? (
            <p className="mt-3 text-base text-mairie-muted">{unavailableMessage}</p>
          ) : null}
        </section>
      </div>
    </>
  );
}
