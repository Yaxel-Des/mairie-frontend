import { useId, useState } from 'react';
import { richTextToHtml } from '../data/api';

type ExpandableCmsContentProps = {
  html: unknown;
};

function getPlainText(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html');
  return document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

function truncateText(text: string, limit: number): string {
  const cutoff = Math.max(0, limit - 3);
  let excerpt = text.slice(0, cutoff);
  const lastSpace = excerpt.lastIndexOf(' ');
  if (lastSpace > cutoff - 30) excerpt = excerpt.slice(0, lastSpace);
  return `${excerpt.trimEnd()}...`;
}

export default function ExpandableCmsContent({ html }: ExpandableCmsContentProps) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const safeHtml = richTextToHtml(html);
  const plainText = getPlainText(safeHtml);
  const isTruncated = plainText.length > 300;

  return (
    <div className="max-w-prose">
      {expanded || !isTruncated ? (
        <div
          id={contentId}
          className="cms-content mx-0 max-w-prose"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      ) : (
        <p id={contentId} className="text-base leading-relaxed text-mairie-ink">
          {truncateText(plainText, 300)}
        </p>
      )}
      {isTruncated && (
        <button
          type="button"
          className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-mairie-brown underline underline-offset-4 hover:text-mairie-lagoon"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Réduire' : 'Lire la suite'}
          <span aria-hidden="true">{expanded ? '↑' : '→'}</span>
        </button>
      )}
    </div>
  );
}
