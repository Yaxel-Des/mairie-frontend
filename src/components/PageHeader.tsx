import { Link, useLocation } from 'react-router-dom';
import { pageLabels } from './navigation';

type PageHeaderProps = {
  title: string;
  intro: string;
};

export default function PageHeader({ title, intro }: PageHeaderProps) {
  const { pathname } = useLocation();
  const currentLabel = pageLabels[pathname] ?? title;

  return (
    <div className="border-b border-mairie-line bg-white">
      <div className="wrap py-8 sm:py-10">
        <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-mairie-muted">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link className="inline-flex min-h-11 items-center underline-offset-4 hover:text-mairie-lagoon hover:underline" to="/">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true" className="text-mairie-line">
              /
            </li>
            <li aria-current="page" className="font-semibold text-mairie-brown">
              {currentLabel}
            </li>
          </ol>
        </nav>
        <div className="flex items-stretch gap-4 sm:gap-5">
          <span aria-hidden="true" className="w-1 shrink-0 rounded-full bg-mairie-gold" />
          <div>
            <h1 className="font-serif text-3xl font-semibold leading-tight text-mairie-brown sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-mairie-muted">{intro}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
