import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { FaFacebook, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import Icon from './Icon';
import SiteSearch from './SiteSearch';
import { mainNavigation } from './navigation';
import { homeAlert } from '../data/mockData';
import { getContactParametres, getTextField, type StrapiRecord } from '../data/api';

function navLinkClass(isActive: boolean) {
  return [
    'relative flex min-h-[2.75rem] items-center px-3 py-2 text-sm font-semibold transition-colors',
    'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:transition-colors',
    isActive
      ? 'text-mairie-brown after:bg-mairie-gold'
      : 'text-mairie-muted after:bg-transparent hover:text-mairie-lagoon hover:after:bg-mairie-line',
  ].join(' ');
}

const footerLinkClass =
  'inline-flex min-h-11 items-center text-white/85 underline-offset-4 transition-colors hover:text-mairie-gold hover:underline';

const socialNetworks: Array<{
  field: string;
  label: string;
  Icon: IconType;
}> = [
  { field: 'Facebook', label: 'Page Facebook de la Mairie', Icon: FaFacebook },
  { field: 'Whatsapp', label: 'WhatsApp de la Mairie', Icon: FaWhatsapp },
  { field: 'TwitterX', label: 'Compte X de la Mairie', Icon: FaXTwitter },
  { field: 'Youtube', label: 'Chaîne YouTube de la Mairie', Icon: FaYoutube },
];

function getSocialUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactParams, setContactParams] = useState<StrapiRecord | null>(null);
  const [contactParamsError, setContactParamsError] = useState('');
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const controller = new AbortController();
    getContactParametres(controller.signal)
      .then(setContactParams)
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setContactParamsError(
            cause instanceof Error
              ? cause.message
              : 'Impossible de charger les liens des réseaux sociaux.',
          );
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-mairie-mist font-sans text-mairie-ink">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-mairie-brown focus:shadow-lg"
      >
        Aller au contenu
      </a>

      <div aria-hidden="true" className="flex h-1.5">
        <span className="flex-1 bg-mairie-orange" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-mairie-green" />
      </div>
      <div className="bg-mairie-brown text-xs text-white/90">
        <div className="wrap flex items-center justify-between py-2">
          <span>République de Côte d’Ivoire</span>
          <span className="hidden sm:inline">Site officiel de la commune</span>
        </div>
      </div>

      {homeAlert.active && (
        <aside aria-label="Alerte municipale" className="bg-[#7A1F2B] text-white" role="alert">
          <div className="wrap py-3">
            <h2 className="font-serif text-base font-semibold">Alerte municipale</h2>
            <p className="mt-0.5 text-base leading-6">{homeAlert.message}</p>
          </div>
        </aside>
      )}

      <header className="sticky top-0 z-40 border-b border-mairie-line bg-white">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo.svg"
              alt=""
              width="432"
              height="304"
              className="h-12 w-auto sm:h-14"
            />
            <span className="leading-tight">
              <span className="block font-serif text-lg font-semibold text-mairie-brown sm:text-xl">
                Mairie de Bingerville
              </span>
              <span className="block text-xs text-mairie-muted">Site officiel</span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center lg:flex">
            <ul className="flex items-center">
              {mainNavigation.map(({ label, to }) => (
                <li key={to}>
                  <NavLink to={to} end={to === '/'} className={({ isActive }) => navLinkClass(isActive)}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn-primary ml-4">
              Contact
            </Link>
          </nav>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-mairie-line text-mairie-brown hover:bg-mairie-mist lg:hidden"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
        </div>

        <nav
          id="mobile-navigation"
          aria-label="Navigation principale (mobile)"
          className={`${menuOpen ? 'block' : 'hidden'} border-t border-mairie-line bg-white lg:hidden`}
        >
          <ul className="wrap py-2">
            {mainNavigation.map(({ label, to }) => (
              <li key={to} className="border-b border-mairie-line last:border-b-0">
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex min-h-[3rem] items-center px-1 text-base font-semibold ${
                      isActive ? 'text-mairie-brown' : 'text-mairie-muted'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden="true"
                        className={`mr-3 h-5 w-1 rounded-full ${isActive ? 'bg-mairie-gold' : 'bg-transparent'}`}
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            <li className="pb-2 pt-3">
              <Link to="/contact" className="btn-primary w-full">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <SiteSearch />
      </header>

      <main id="contenu" className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-mairie-brown text-white">
        <div className="wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_0.8fr]">
          <div>
            <div className="inline-block rounded-md bg-white p-2.5">
              <img src="/images/logo.svg" alt="Écusson de la commune de Bingerville" width="432" height="304" className="h-16 w-auto" loading="lazy" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/80">
              Mairie de Bingerville, au service des habitants, des entreprises et des visiteurs.
            </p>
          </div>

          <section aria-labelledby="footer-contact">
            <h2 id="footer-contact" className="font-serif text-lg font-semibold text-mairie-gold">
              Coordonnées
            </h2>
            <address className="mt-3 space-y-1.5 text-sm not-italic leading-6 text-white/85">
              <p>Mairie de Bingerville</p>
              <p className="todo-note">[À COMPLÉTER PAR LA MAIRIE : adresse complète.]</p>
              <p className="todo-note">[À COMPLÉTER PAR LA MAIRIE : téléphone.]</p>
              <p className="todo-note">[À COMPLÉTER PAR LA MAIRIE : e-mail.]</p>
            </address>
          </section>

          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className="font-serif text-lg font-semibold text-mairie-gold">
              Le site
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className={footerLinkClass} to="/services">Services municipaux</Link></li>
              <li><Link className={footerLinkClass} to="/actualites">Actualités</Link></li>
              <li><Link className={footerLinkClass} to="/projets">Projets communaux</Link></li>
              <li><Link className={footerLinkClass} to="/decouvrir-bingerville">Découvrir Bingerville</Link></li>
              <li><Link className={footerLinkClass} to="/documents">Documents municipaux</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="font-serif text-lg font-semibold text-mairie-gold">
              Informations
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className={footerLinkClass} to="/contact">Contact</Link></li>
              <li><Link className={footerLinkClass} to="/mentions-legales">Mentions légales</Link></li>
              <li><Link className={footerLinkClass} to="/politique-de-confidentialite">Politique de confidentialité</Link></li>
            </ul>
          </nav>

          <section aria-labelledby="footer-social">
            <h2 id="footer-social" className="font-serif text-lg font-semibold text-mairie-gold">
              Suivez-nous
            </h2>
            {contactParamsError ? (
              <p className="mt-3 text-sm leading-6 text-white/85" role="status">
                Les liens des réseaux sociaux ne sont pas disponibles.
              </p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {socialNetworks.map(({ field, label, Icon: SocialIcon }) => {
                  const rawUrl = getTextField(contactParams, field);
                  const url = rawUrl ? getSocialUrl(rawUrl) : null;
                  if (!url) return null;

                  return (
                    <li key={field}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-mairie-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mairie-gold"
                      >
                        <SocialIcon aria-hidden="true" className="h-6 w-6" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="border-t border-white/15">
          <div className="wrap flex flex-col gap-1 py-4 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Commune de Bingerville. Tous droits réservés.</p>
            <p>Devise de la commune : Union – Développement – Justice</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
