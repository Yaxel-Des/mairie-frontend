import ApiError from '../components/ApiError';
import ExpandableCmsContent from '../components/ExpandableCmsContent';
import LoadingSkeleton from '../components/LoadingSkeleton';
import PageHeader from '../components/PageHeader';
import ProjectImageCarousel from '../components/ProjectImageCarousel';
import { getCmsContentField, getProjets, getProjetsParametres, getTextField } from '../data/api';
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
  const projects = [...(data?.projects ?? [])].sort((a, b) => {
    const dateA = Date.parse(typeof a.createdAt === 'string' ? a.createdAt : '');
    const dateB = Date.parse(typeof b.createdAt === 'string' ? b.createdAt : '');
    const hasDateA = Number.isFinite(dateA);
    const hasDateB = Number.isFinite(dateB);

    if (!hasDateA && !hasDateB) return 0;
    if (!hasDateA) return 1;
    if (!hasDateB) return -1;
    return dateB - dateA;
  });
  const introduction = getCmsContentField(data?.settings ?? null, 'Introduction');

  return (
    <>
      <PageHeader
        title="Projets communaux"
        intro="Découvrez les projets communaux et leur état d’avancement."
      />

      <div className="wrap py-10">
        {isLoading ? (
          <LoadingSkeleton count={4} />
        ) : error ? (
          <ApiError message={error} />
        ) : (
          <>
            {introduction && (
              <div className="mb-8">
                <ExpandableCmsContent html={introduction} />
              </div>
            )}
            {getCmsContentField(data?.settings ?? null, 'TexteInvestir') && (
              <div className="mb-8">
                <ExpandableCmsContent html={getCmsContentField(data?.settings ?? null, 'TexteInvestir')} />
              </div>
            )}
            {projects.length ? (
              <ul className="space-y-4">
                {projects.map((project) => {
                  const status = getTextField(project, 'Statut');
                  const border = statusStyle[status] ?? 'border-mairie-line';
                  const description = getCmsContentField(project, 'Description');
                  return (
                    <li key={project.documentId || project.id} className={`card border-l-4 ${border} p-5 sm:p-6`}>
                      <article>
                        <ProjectImageCarousel
                          images={project.Image}
                          projectTitle={getTextField(project, 'Titre')}
                        />
                        <h2 className="font-serif text-xl font-semibold leading-snug text-mairie-brown">
                          {getTextField(project, 'Titre')}
                        </h2>
                        {description ? (
                          <div className="mt-2">
                            <ExpandableCmsContent html={description} />
                          </div>
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
