import { Link, useSearchParams } from 'react-router-dom';
import ApiError from '../components/ApiError';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import {
  getDemarches,
  getDocuments,
  getMediaFileUrl,
  getRecordKey,
  getTextField,
  type StrapiRecord,
} from '../data/api';
import { fetchActualites } from '../data/actualitesApi';
import useApiResource from '../hooks/useApiResource';

type SearchResult = {
  title: string;
  description: string;
  url: string;
  kind: 'page' | 'démarche' | 'document PDF';
};

const pages: SearchResult[] = [
  { title: 'Accueil', description: 'Actualités, démarches et informations communales.', url: '/', kind: 'page' },
  { title: 'La Mairie', description: 'Conseil municipal et organisation de la Mairie.', url: '/mairie', kind: 'page' },
  { title: 'Services municipaux', description: 'Les démarches administratives de la commune.', url: '/services', kind: 'page' },
  { title: 'Actualités', description: 'Actualités et annonces de la Mairie.', url: '/actualites', kind: 'page' },
  { title: 'Projets communaux', description: 'Les projets de développement de la commune.', url: '/projets', kind: 'page' },
  { title: 'Contact', description: 'Contacter la Mairie de Bingerville.', url: '/contact', kind: 'page' },
  { title: 'Découvrir Bingerville', description: 'Histoire et patrimoine de la commune.', url: '/decouvrir-bingerville', kind: 'page' },
  { title: 'Documents municipaux', description: 'Délibérations et arrêtés à télécharger.', url: '/documents', kind: 'page' },
  { title: 'Politique de confidentialité', description: 'Protection des données personnelles.', url: '/politique-de-confidentialite', kind: 'page' },
  { title: 'Mentions légales', description: 'Informations légales du site.', url: '/mentions-legales', kind: 'page' },
];

type SearchData = {
  actualites: Awaited<ReturnType<typeof fetchActualites>>;
  demarches: StrapiRecord[];
  documents: StrapiRecord[];
};

async function loadSearchData(signal: AbortSignal): Promise<SearchData> {
  const [actualites, demarches, documents] = await Promise.all([
    fetchActualites(signal),
    getDemarches(signal),
    getDocuments(signal),
  ]);
  return { actualites, demarches, documents };
}

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
  const { data, isLoading, error } = useApiResource(loadSearchData);
  const dynamicResults: SearchResult[] = data
    ? [
        ...data.actualites.map((article) => ({
          title: article.title,
          description: `${article.category} ${article.summary}`,
          url: `/actualites/${article.id}`,
          kind: 'page' as const,
        })),
        ...data.demarches.map((demarche) => {
          const id = getRecordKey(demarche);
          return {
            title: getTextField(demarche, 'Titre', 'Nom') || 'Démarche municipale',
            description: [
              getTextField(demarche, 'Description'),
              getTextField(demarche, 'Pieces'),
              getTextField(demarche, 'Delai', 'Délai'),
              getTextField(demarche, 'Cout', 'Coût'),
              getTextField(demarche, 'Lieu'),
            ].filter(Boolean).join(' '),
            url: `/services?demarche=${encodeURIComponent(id)}`,
            kind: 'démarche' as const,
          };
        }),
        ...data.documents.map((document) => {
          const fileUrl = getMediaFileUrl(document.Pdf ?? document.FichierPDF ?? document.Fichier);
          return {
            title: getTextField(document, 'Titre', 'Nom') || 'Document municipal',
            description: `${getTextField(document, 'Type', 'TypeDocument')} ${getTextField(document, 'Annee', 'DatePublication')}`,
            url: fileUrl || '/documents',
            kind: fileUrl ? 'document PDF' as const : 'page' as const,
          };
        }),
      ]
    : [];
  const results: SearchResult[] = [...pages, ...dynamicResults]
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
        {isLoading ? <Loading /> : null}
        {error ? <ApiError message={error} /> : null}
        {!isLoading && !error && query && results.length > 0 ? (
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
        ) : !isLoading && !error ? (
          <p className="todo-note" role="status">
            {query
              ? 'Aucun résultat trouvé. Essayez un autre terme ou vérifiez l’orthographe.'
              : 'Saisissez un terme pour rechercher dans les pages, les démarches et les documents PDF.'}
          </p>
        ) : null}
      </section>
    </>
  );
}
