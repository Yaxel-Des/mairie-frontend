import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import LoadingSkeleton from '../components/LoadingSkeleton';
import PageHeader from '../components/PageHeader';
import {
  fetchActualites,
  formatPublicationDate,
  truncateSummary,
  type Actualite,
} from '../data/actualitesApi';

export default function Actualites() {
  const [news, setNews] = useState<Actualite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetchActualites(controller.signal)
      .then(setNews)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Une erreur est survenue pendant le chargement des actualités.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      <PageHeader
        title="Actualités"
        intro="Informations et annonces de la Mairie de Bingerville."
      />

      <div className="wrap py-10">
        {isLoading ? (
          <LoadingSkeleton variant="cards" count={6} />
        ) : errorMessage ? (
          <p className="todo-note" role="alert">{errorMessage}</p>
        ) : news.length === 0 ? (
          <p className="todo-note" role="status">Aucune actualité n’est disponible pour le moment.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <li
                key={item.id}
                className="card group relative h-full overflow-hidden transition-colors hover:border-mairie-lagoon"
              >
                <article className="flex h-full flex-col">
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    className="aspect-[4/3] w-full border-b border-mairie-line object-cover"
                    width="640"
                    height="480"
                    loading="lazy"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap gap-2 text-sm font-semibold text-mairie-muted">
                      <span className="rounded-full bg-mairie-lagoonSoft px-2.5 py-1 text-mairie-lagoonDeep">
                        {item.category}
                      </span>
                      <span className="todo-note px-2.5 py-1">{formatPublicationDate(item.date)}</span>
                    </div>
                    <h2 className="mt-3 font-serif text-xl font-semibold leading-snug text-mairie-brown">
                      {item.title}
                    </h2>
                    <p className="mt-2 min-h-[4.5rem] line-clamp-3 text-sm leading-6 text-mairie-muted">
                      {truncateSummary(item.summary)}
                    </p>
                    <Link
                      className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-semibold text-mairie-lagoon after:absolute after:inset-0 group-hover:text-mairie-lagoonDeep"
                      to={`/actualites/${item.id}`}
                    >
                      Lire l’actualité
                      <span className="sr-only"> : {item.title}</span>
                      <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
