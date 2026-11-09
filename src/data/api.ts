export type StrapiRecord = Record<string, unknown> & {
  id: number;
  documentId?: string;
};

type StrapiResponse<T> = {
  data: T;
};

const apiOrigin = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
const actualitePlaceholder = '/images/actualite-placeholder.svg';

export async function fetchApiData<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (!apiOrigin) {
    throw new Error('La variable VITE_API_URL doit être définie pour charger les contenus.');
  }

  const response = await fetch(`${apiOrigin}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`Impossible de charger les contenus (HTTP ${response.status}).`);
  }

  const result: StrapiResponse<T> = await response.json();
  return result.data;
}

function isStrapiRecord(value: unknown): value is StrapiRecord {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      'id' in value &&
      typeof value.id === 'number',
  );
}

async function getSingle(path: string, signal?: AbortSignal): Promise<StrapiRecord | null> {
  const data = await fetchApiData<unknown>(path, signal);
  if (data === null) return null;
  if (!isStrapiRecord(data)) {
    throw new Error('La réponse de Strapi ne contient pas un contenu individuel valide.');
  }
  return data;
}

async function getCollection(path: string, signal?: AbortSignal): Promise<StrapiRecord[]> {
  const data = await fetchApiData<unknown>(path, signal);
  if (!Array.isArray(data)) {
    throw new Error('La réponse de Strapi ne contient pas une liste de contenus valide.');
  }
  const records = data.filter(isStrapiRecord);
  if (records.length !== data.length) {
    throw new Error('La réponse de Strapi ne contient pas une liste de contenus valide.');
  }
  return records;
}

export function getAccueilParametres(signal?: AbortSignal): Promise<StrapiRecord | null> {
  return getSingle('/api/accueil-parametre?populate=*', signal);
}

export function getMairieParametres(signal?: AbortSignal): Promise<StrapiRecord | null> {
  return getSingle('/api/mairie-parametre?populate=*', signal);
}

export function getDecouvrirParametres(signal?: AbortSignal): Promise<StrapiRecord | null> {
  return getSingle('/api/decouvrir-parametre?populate=*', signal);
}

export function getAdjoints(signal?: AbortSignal): Promise<StrapiRecord[]> {
  return getCollection('/api/adjoints?populate=*&sort=OrdreAffichage:asc', signal);
}

export function getDemarches(signal?: AbortSignal): Promise<StrapiRecord[]> {
  return getCollection('/api/demarches?populate=*', signal);
}

export function getDocuments(signal?: AbortSignal): Promise<StrapiRecord[]> {
  return getCollection('/api/document-officiels?populate=*&sort=Annee:desc', signal);
}

export function getProjets(signal?: AbortSignal): Promise<StrapiRecord[]> {
  return getCollection('/api/projets?populate=*', signal);
}

export function getProjetsParametres(signal?: AbortSignal): Promise<StrapiRecord | null> {
  return getSingle('/api/rojets-parametre?populate=*', signal);
}

export function getPageLegale(signal?: AbortSignal): Promise<StrapiRecord | null> {
  return getSingle('/api/page-legale?populate=*', signal);
}

export function getContactParametres(signal?: AbortSignal): Promise<StrapiRecord | null> {
  return getSingle('/api/contact-parametres?populate=*', signal);
}

export function getImageUrl(
  imageArray: unknown,
): string {
  const image = Array.isArray(imageArray) ? imageArray[0] : imageArray;
  if (!image || typeof image !== 'object' || !('url' in image) || typeof image.url !== 'string') {
    return actualitePlaceholder;
  }
  if (/^https?:\/\//i.test(image.url)) return image.url;
  return `${apiOrigin ?? ''}${image.url}`;
}

export function getMediaFileUrl(value: unknown): string | null {
  const media = Array.isArray(value) ? value[0] : value;
  if (!media || typeof media !== 'object' || !('url' in media) || typeof media.url !== 'string') {
    return null;
  }
  return /^https?:\/\//i.test(media.url) ? media.url : `${apiOrigin ?? ''}${media.url}`;
}

export function getTextField(record: StrapiRecord | null, ...keys: string[]): string {
  if (!record) return '';
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}

export function getRecordKey(record: StrapiRecord): string {
  return record.documentId || String(record.id);
}

export function sanitizeCmsHtml(html: string): string {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const allowedTags = new Set([
    'A',
    'BLOCKQUOTE',
    'BR',
    'EM',
    'H2',
    'H3',
    'H4',
    'I',
    'LI',
    'OL',
    'P',
    'STRONG',
    'UL',
  ]);
  const escapeHtml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const cleanNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent ?? '');
    if (!(node instanceof Element)) return '';

    const children = Array.from(node.childNodes, cleanNode).join('');
    if (!allowedTags.has(node.tagName)) return children;

    if (node.tagName === 'A') {
      const href = node.getAttribute('href');
      if (href) {
        try {
          const url = new URL(href, window.location.origin);
          if (['http:', 'https:', 'mailto:'].includes(url.protocol)) {
            const safeHref = escapeHtml(url.href);
            return `<a href="${safeHref}" rel="noopener noreferrer">${children}</a>`;
          }
        } catch {
          return children;
        }
      }
    }

    const tag = node.tagName.toLowerCase();
    return `<${tag}>${children}</${tag}>`;
  };

  return Array.from(parsed.body.childNodes, cleanNode).join('');
}

export function richTextToPlainText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return new DOMParser().parseFromString(value, 'text/html').body.textContent?.trim() ?? '';
}
