import { fetchApiData, getImageUrl, richTextToPlainText } from './api';

export type Actualite = {
  id: number;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: unknown;
  imageUrl: string;
  imageAlt: string;
};

type StrapiActualite = {
  id: number;
  Titre?: string;
  Contenu?: unknown;
  DatePublication?: string | null;
  Image?: Array<{
    url?: string | null;
    alternativeText?: string | null;
  }> | null;
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

export async function fetchActualites(signal?: AbortSignal): Promise<Actualite[]> {
  const result = await fetchApiData<StrapiActualite[]>('/api/actualites?populate=*', signal);
  if (!Array.isArray(result)) {
    throw new Error('La réponse de Strapi ne contient pas de liste d’actualités.');
  }

  return result.map((item) => {
    if (typeof item.Titre !== 'string' || !item.Titre.trim()) {
      throw new Error('Une actualité de Strapi ne contient pas de titre.');
    }

    const content = item.Contenu ?? '';
    return {
      id: item.id,
      title: item.Titre,
      category: item.category?.Nom || 'Actualité',
      date: item.DatePublication || 'Date à compléter',
      summary: richTextToPlainText(content) || item.Titre,
      content,
      imageUrl: item.Image?.[0] ? getImageUrl(item.Image) : actualitePlaceholder,
      imageAlt: item.Image?.[0]?.alternativeText || '',
    };
  });
}
