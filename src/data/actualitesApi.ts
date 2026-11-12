import { fetchApiData, getMediaItems, richTextToPlainText } from './api';

export type Actualite = {
  id: number;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: unknown;
  images: unknown;
  imageUrl: string;
  imageAlt: string;
};

type StrapiActualite = {
  id: number;
  Titre?: string;
  Contenu?: unknown;
  DatePublication?: string | null;
  Image?: unknown;
  category?: {
    Nom?: string | null;
  } | null;
};

export const actualitePlaceholder = '/images/actualite-placeholder.svg';

export function truncateSummary(summary: string, maxLength = 150): string {
  const normalizedSummary = summary.trim().replace(/\s+/g, ' ');
  if (normalizedSummary.length <= maxLength) return normalizedSummary;
  return `${normalizedSummary.slice(0, maxLength - 3).trimEnd()}...`;
}

export function formatPublicationDate(date: string | null | undefined): string {
  if (!date?.trim()) return 'Date non spécifiée';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return 'Date non spécifiée';

  const parts = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Africa/Abidjan',
  }).formatToParts(parsedDate);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${value('day')} ${value('month')} ${value('year')} à ${value('hour')}h${value('minute')}`;
}

export async function fetchActualites(signal?: AbortSignal): Promise<Actualite[]> {
  const result = await fetchApiData<StrapiActualite[]>(
    '/api/actualites?populate=*&sort=DatePublication:desc',
    signal,
  );
  if (!Array.isArray(result)) {
    throw new Error('La réponse de Strapi ne contient pas de liste d’actualités.');
  }

  return result.map((item) => {
    if (typeof item.Titre !== 'string' || !item.Titre.trim()) {
      throw new Error('Une actualité de Strapi ne contient pas de titre.');
    }

    const content = item.Contenu ?? '';
    const images = getMediaItems(item.Image);
    const firstImage = images[0];
    return {
      id: item.id,
      title: item.Titre,
      category: item.category?.Nom || 'Actualité',
      date: item.DatePublication || '',
      summary: richTextToPlainText(content) || item.Titre,
      content,
      images: item.Image,
      imageUrl: firstImage?.url ?? actualitePlaceholder,
      imageAlt: firstImage?.alternativeText ?? '',
    };
  });
}
