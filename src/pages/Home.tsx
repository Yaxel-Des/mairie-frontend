import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import LagoonArch from '../components/LagoonArch';
import Loading from '../components/Loading';
import ApiError from '../components/ApiError';
import ExpandableCmsContent from '../components/ExpandableCmsContent';
import { procedureIcons } from '../components/procedureIcons';
import {
  getAccueilParametres,
  getCmsContentField,
  getImageUrl,
  getTextField,
} from '../data/api';
import { fetchActualites, truncateSummary, type Actualite } from '../data/actualitesApi';
import { quickLinks } from '../data/mockData';
import useApiResource from '../hooks/useApiResource';


export default function Home() {
  const {
    data: accueil,
    isLoading: isAccueilLoading,
    error: accueilError,
  } = useApiResource(getAccueilParametres);
  const [news, setNews] = useState<Actualite[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetchActualites(controller.signal)
      .then(setNews)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setNewsError(
            error instanceof Error
              ? error.message
              : 'Une erreur est survenue pendant le chargement des actualités.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsNewsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const latestNews = [...news]
    .sort((a, b) => {
      const dateA = Date.parse(a.date);
      const dateB = Date.parse(b.date);
      return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
    })
    .slice(0, 3);
  const mayorMessage = getCmsContentField(accueil, 'MotDuMaire');
  const mayorName = getTextField(accueil, 'NomMaire') || 'Le Maire de Bingerville';
  const mayorPhoto = getImageUrl(accueil?.PhotoMaire);

  return (
    <>
      <section aria-labelledby="hero-heading" className="overflow-hidden bg-mairie-brown text-white">
        <div className="wrap grid items-end gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-12">
          <div className="py-12 sm:py-16 lg:pb-20 lg:pt-20">
            <h1
              id="hero-heading"
              className="max-w-2xl font-serif text-4xl font-semibold leading-[1.1] sm:text-5xl"
            >
              La Mairie de Bingerville, au service de ses habitants
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">
              État civil, urbanisme, actualités et projets de la commune : retrouvez les pièces à fournir, les délais et le lieu de chaque démarche.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-gold" to="/services">
                Voir les démarches
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link className="btn-outline-light" to="/contact">
                Contacter la Mairie
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[19rem] self-end sm:max-w-sm lg:mx-0 lg:ml-auto lg:pt-12">
            <LagoonArch className="block h-auto w-full" />
          </div>
        </div>
      </section>

      <section aria-labelledby="quick-links-heading" className="py-12 sm:py-16">
        <div className="wrap">
          <h2
            id="quick-links-heading"
            className="font-serif text-2xl font-semibold text-mairie-brown sm:text-3xl"
          >
            Démarches les plus demandées
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-mairie-muted">
            Choisissez une démarche pour connaître les pièces à fournir, le délai et le lieu où vous rendre.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((item) => (
              <li
                key={item.id}
                className="card group relative flex gap-4 p-5 transition-colors hover:border-mairie-lagoon"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mairie-lagoonSoft text-mairie-lagoon">
                  <Icon name={procedureIcons[item.id] ?? 'document'} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold leading-snug text-mairie-brown">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-mairie-muted">{item.description}</p>
                  <Link
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-mairie-lagoon after:absolute after:inset-0 group-hover:text-mairie-lagoonDeep"
                    to={item.to}
                  >
                    Voir la démarche
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="mayor-message-heading" className="border-y border-mairie-line bg-white py-12 sm:py-16">
        <div className="wrap grid gap-8 md:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] md:gap-14">
          <div>
            <h2
              id="mayor-message-heading"
              className="font-serif text-3xl font-semibold text-mairie-brown sm:text-4xl"
            >
              Mot du Maire
            </h2>
          </div>
          <div className="border-l-4 border-mairie-gold pl-5 sm:pl-7">
            {isAccueilLoading ? (
              <Loading />
            ) : accueilError ? (
              <ApiError message={accueilError} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_12rem]">
                <div>
                  {mayorMessage ? (
                    <ExpandableCmsContent html={mayorMessage} />
                  ) : (
                    <p className="text-base text-mairie-muted">Cette information sera bientôt disponible.</p>
                  )}
                  {getTextField(accueil, 'NomMaire') && (
                    <p className="mt-6 font-semibold text-mairie-brown">{mayorName}</p>
                  )}
                </div>
                <img
                  src={mayorPhoto}
                  alt={`Portrait de ${mayorName}`}
                  className="aspect-[4/5] w-full rounded-md border border-mairie-line object-cover"
                  width="480"
                  height="600"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="latest-news-heading" className="py-12 sm:py-16">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="latest-news-heading"
                className="font-serif text-2xl font-semibold text-mairie-brown sm:text-3xl"
              >
                Dernières actualités
              </h2>
              <p className="mt-2 text-base leading-7 text-mairie-muted">
                Les informations récentes de la commune.
              </p>
            </div>
            <Link className="text-link inline-flex min-h-11 items-center gap-1.5 text-sm" to="/actualites">
              Toutes les actualités
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          {isNewsLoading ? (
            <div className="mt-8"><Loading /></div>
          ) : newsError ? (
            <p className="todo-note mt-8" role="alert">{newsError}</p>
          ) : latestNews.length === 0 ? (
            <p className="todo-note mt-8" role="status">Aucune actualité n’est disponible pour le moment.</p>
          ) : (
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {latestNews.map((item) => (
              <li key={item.id} className="card group relative h-full overflow-hidden transition-colors hover:border-mairie-lagoon">
                <article className="flex h-full flex-col">
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    className="aspect-[4/3] w-full border-b border-mairie-line object-cover"
                    loading="lazy"
                    width="640"
                    height="480"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <span className="rounded-full bg-mairie-lagoonSoft px-2.5 py-1 text-sm font-semibold text-mairie-lagoonDeep">
                      {item.category}
                    </span>
                    <p className="todo-note inline-block px-2.5 py-1 font-semibold">
                      {item.date}
                    </p>
                    <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-mairie-brown">
                      {item.title}
                    </h3>
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
      </section>

      <section aria-labelledby="discover-heading" className="bg-mairie-lagoonDeep py-12 text-white sm:py-14">
        <div className="wrap flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 id="discover-heading" className="font-serif text-2xl font-semibold sm:text-3xl">
              Découvrir Bingerville
            </h2>
            <p className="mt-2 text-base leading-7 text-white/85">
              Repères historiques, jardin botanique et musée : préparez votre visite de la commune.
            </p>
          </div>
          <ul className="flex flex-wrap gap-3">
            {[
              { label: 'Histoire', icon: 'book' as const },
              { label: 'Jardin botanique', icon: 'leafy' as const },
              { label: 'Musée', icon: 'columns' as const },
            ].map(({ label, icon }) => (
              <li key={label}>
                <Link
                  className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-mairie-gold hover:bg-white/10"
                  to="/decouvrir-bingerville"
                >
                  <Icon name={icon} className="h-4 w-4 text-mairie-gold" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
