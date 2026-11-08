import ApiError from '../components/ApiError';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import { getProjets, getProjetsParametres, getTextField, richTextToPlainText, sanitizeCmsHtml } from '../data/api';
import useApiResource from '../hooks/useApiResource';

const unavailableMessage = 'Cette information sera bientôt disponible.';
const statusStyle: Record<string, string> = {
  Prévu: 'border-mairie-gold',
  'En cours': 'border-mairie-brown',
  Terminé: 'border-mairie-green',
};

async function loadProjets(signal: AbortSignal) {
  const [settings, projects] = await Promise.all([
    getProjetsParametres(signal),
    getProjets(signal),
  ]);
  return { settings, projects };
}

export default function Projets() {
  const { data, isLoading, error } = useApiResource(loadProjets);
  const projects = data?.projects ?? [];
  const introduction = getTextField(data?.settings ?? null, 'Introduction');

  return (
    <>
      <PageHeader
        title="Projets communaux"
        intro={richTextToPlainText(introduction) || unavailableMessage}
      />

      <div className="wrap py-10">
        {isLoading ? <Loading /> : null}
        {error ? <ApiError message={error} /> : null}
        {!isLoading && !error && (
          <>
            {getTextField(data?.settings ?? null, 'TexteInvestir') && (
              <div
                className="mb-8 text-base leading-7 text-mairie-ink"
                dangerouslySetInnerHTML={{
                  __html: sanitizeCmsHtml(getTextField(data?.settings ?? null, 'TexteInvestir')),
                }}
              />
            )}
            {projects.length ? (
              <ul className="space-y-4">
                {projects.map((project) => {
                  const status = getTextField(project, 'Statut');
                  const border = statusStyle[status] ?? 'border-mairie-line';
                  const description = getTextField(project, 'Description');
                  return (
                    <li key={project.documentId || project.id} className={`card border-l-4 ${border} p-5 sm:p-6`}>
                      <article>
                        <h2 className="font-serif text-xl font-semibold leading-snug text-mairie-brown">
                          {getTextField(project, 'Titre')}
                        </h2>
                        {description ? (
                          <div
                            className="mt-2 text-base leading-7 text-mairie-ink"
                            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(description) }}
                          />
                        ) : (
                          <p className="mt-2 text-base text-mairie-muted">{unavailableMessage}</p>
                        )}
                        {status && (
                          <p className="mt-4 inline-flex min-h-11 items-center border-l-4 border-current px-3 font-semibold text-mairie-brown">
                            Statut : {status}
                          </p>
                        )}
                      </article>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-base text-mairie-muted" role="status">{unavailableMessage}</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
