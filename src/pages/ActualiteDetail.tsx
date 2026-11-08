import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';
import { fetchActualites, type Actualite } from '../data/actualitesApi';

const publicOrigin = 'https://www.mairie-bingerville.ci';

export default function ActualiteDetail() {
  const { id } = useParams();
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
              : 'Une erreur est survenue pendant le chargement de cette actualité.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const article = news.find((item) => item.id === Number(id));

  if (isLoading) {
    return <div className="wrap py-8" role="status">Chargement...</div>;
  }

  if (errorMessage || !article) {
    return (
      <>
        <PageHeader
          title={errorMessage ? 'Actualités indisponibles' : 'Actualité introuvable'}
          intro={errorMessage || 'Cette actualité n’est pas disponible.'}
        />
        <div className="wrap py-8">
          <Link className="text-link inline-flex min-h-11 items-center" to="/actualites">
            Retour aux actualités
          </Link>
        </div>
      </>
    );
  }

  const articlePath = `/actualites/${article.id}`;
  const articleUrl = `${publicOrigin}${articlePath}`;
  const shareText = `${article.title} — ${articleUrl}`;

  return (
    <>
      <title>{`${article.title} | Mairie de Bingerville`}</title>
      <meta name="description" content={article.summary} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.summary} />
      <meta property="og:url" content={articleUrl} />
      <meta property="og:image" content={article.imageUrl.startsWith('http') ? article.imageUrl : `${publicOrigin}${article.imageUrl}`} />
      <meta property="og:image:alt" content="Illustration de la Mairie de Bingerville" />

      <PageHeader title={article.title} intro={article.summary} />
      <article className="wrap py-8 sm:py-10">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2 text-sm font-semibold text-mairie-muted">
            <span className="rounded-full bg-mairie-lagoonSoft px-3 py-1 text-mairie-lagoonDeep">
              {article.category}
            </span>
            <span className="todo-note px-3 py-1">{article.date}</span>
          </div>
          <img
            src={article.imageUrl}
            alt={article.imageAlt || article.title}
            className="mt-6 aspect-[4/3] w-full rounded-lg border border-mairie-line object-cover sm:aspect-[16/9]"
            width="640"
            height="480"
          />
          <div className="mt-6 rounded-lg border border-mairie-line bg-white p-5 sm:p-7">
            <p className="whitespace-pre-line text-base leading-7 text-mairie-ink">
              {article.content || article.summary}
            </p>
          </div>

          <section aria-labelledby="share-article-heading" className="mt-7">
            <h2 id="share-article-heading" className="font-serif text-xl font-semibold text-mairie-brown">
              Partager cette actualité
            </h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              <li>
                <a
                  className="btn-primary"
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="message" className="h-5 w-5" />
                  WhatsApp
                  <span className="sr-only">(ouvre un nouvel onglet)</span>
                </a>
              </li>
              <li>
                <a
                  className="btn-primary"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                  <span className="sr-only">(ouvre un nouvel onglet)</span>
                </a>
              </li>
            </ul>
          </section>

          <Link className="text-link mt-7 inline-flex min-h-11 items-center" to="/actualites">
            Retour aux actualités
          </Link>
        </div>
      </article>
    </>
  );
}
