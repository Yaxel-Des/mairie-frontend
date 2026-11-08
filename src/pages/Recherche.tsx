import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { mayorMessage, municipalDocuments, news, projects, services } from '../data/mockData';

type SearchResult = {
  title: string;
  description: string;
  url: string;
  kind: 'page' | 'démarche' | 'document PDF';
};

const pages: SearchResult[] = [
  { title: 'Accueil', description: 'Actualités, démarches et informations communales.', url: '/', kind: 'page' },
  { title: 'La Mairie', description: 'Mot du Maire, conseil municipal et organisation.', url: '/mairie', kind: 'page' },
  { title: 'Services municipaux', description: 'Les démarches administratives de la commune.', url: '/services', kind: 'page' },
  { title: 'Mot du Maire', description: mayorMessage, url: '/mairie', kind: 'page' },
  { title: 'Actualités', description: 'Actualités et annonces de la Mairie.', url: '/actualites', kind: 'page' },
  { title: 'Projets communaux', description: 'Les projets de développement de la commune.', url: '/projets', kind: 'page' },
  { title: 'Contact', description: 'Contacter la Mairie de Bingerville.', url: '/contact', kind: 'page' },
  { title: 'Découvrir Bingerville', description: 'Histoire et patrimoine de la commune.', url: '/decouvrir-bingerville', kind: 'page' },
  { title: 'Documents municipaux', description: 'Délibérations et arrêtés à télécharger.', url: '/documents', kind: 'page' },
  { title: 'Patrimoine de Bingerville', description: 'Histoire, jardin botanique, musée et lieux utiles.', url: '/decouvrir-bingerville', kind: 'page' },
];

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function scoreResult(query: string, result: SearchResult) {
  const normalizedTitle = normalize(result.title);
  const searchableText = normalize(`${result.title} ${result.description}`);
  if (normalizedTitle === query) return 1000;
  if (normalizedTitle.includes(query)) return 500;

  const words = query.split(' ').filter(Boolean);
  const matchedWords = words.filter((word) => searchableText.includes(word));
  return matchedWords.length === words.length ? 100 + matchedWords.length : matchedWords.length;
}

export default function Recherche() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  const normalizedQuery = normalize(query);
  const results: SearchResult[] = [
    ...pages,
    ...news.map((article) => ({
      title: article.title,
      description: `${article.category} ${article.summary}`,
      url: `/actualites/${article.id}`,
      kind: 'page' as const,
    })),
    ...projects.map((project) => ({
      title: project.title,
      description: project.summary,
      url: '/projets',
      kind: 'page' as const,
    })),
    ...services.map((service) => ({
      title: service.title,
      description: `${service.description} ${service.requiredDocuments.join(' ')} ${service.processingTime} ${service.cost} ${service.location}`,
      url: `/services?demarche=${encodeURIComponent(service.id)}`,
      kind: 'démarche' as const,
    })),
    {
      title: 'Formulaire de démarche (PDF)',
      description: 'Formulaire à télécharger pour les démarches municipales.',
      url: '/documents/formulaire-demarche.pdf',
      kind: 'document PDF' as const,
    },
    ...municipalDocuments.map((document) => ({
      title: document.title,
      description: `${document.category} ${document.year} ${document.fileName}`,
      url: `/documents/${document.fileName}`,
      kind: 'document PDF' as const,
    })),
  ]
    .map((result, index) => ({ result, index, score: scoreResult(normalizedQuery, result) }))
    .filter(({ score }) => normalizedQuery.length > 0 && score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ result }) => result);

  return (
    <>
      <PageHeader
        title="Recherche"
        intro={query ? `Résultats pour « ${query} »` : 'Saisissez un mot ou une expression dans le champ de recherche.'}
      />
      <section className="wrap py-8" aria-labelledby="search-results-heading">
        <h2 id="search-results-heading" className="sr-only">Résultats de recherche</h2>
        {query && results.length > 0 ? (
          <>
            <p className="mb-4 text-base text-mairie-muted">
              {results.length} résultat{results.length > 1 ? 's' : ''}
            </p>
            <ul className="card divide-y divide-mairie-line overflow-hidden">
              {results.map((result) => (
                <li key={`${result.kind}:${result.url}:${result.title}`} className="p-5">
                  <p className="text-sm font-semibold text-mairie-muted">{result.kind}</p>
                  <h3 className="mt-1 font-serif text-xl font-semibold text-mairie-brown">
                    {result.kind === 'document PDF' ? (
                      <a className="text-link inline-flex min-h-11 items-center" href={result.url} download>{result.title}</a>
                    ) : (
                      <Link className="text-link inline-flex min-h-11 items-center" to={result.url}>{result.title}</Link>
                    )}
                  </h3>
                  <p className="mt-1 text-base leading-7 text-mairie-ink">{result.description}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="todo-note" role="status">
            {query
              ? 'Aucun résultat trouvé. Essayez un autre terme ou vérifiez l’orthographe.'
              : 'Saisissez un terme pour rechercher dans les pages, les démarches et les documents PDF.'}
          </p>
        )}
      </section>
    </>
  );
}
