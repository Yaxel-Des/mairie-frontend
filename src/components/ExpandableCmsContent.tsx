import { useId, useState } from 'react';
import { sanitizeCmsHtml } from '../data/api';

type ExpandableCmsContentProps = {
  html: string;
};

const blockTags = new Set(['BLOCKQUOTE', 'H2', 'H3', 'H4', 'LI', 'OL', 'P', 'UL']);

function getPlainText(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html');
  let text = '';

  const collectText = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
      return;
    }

    if (!(node instanceof Element)) return;
    if (node.tagName === 'BR') {
      text += '\n';
      return;
    }

    node.childNodes.forEach(collectText);
    if (blockTags.has(node.tagName)) text += '\n';
  };

  document.body.childNodes.forEach(collectText);
  return text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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
  const plainText = getPlainText(html);
  const isTruncated = plainText.length > 300;

  return (
    <div className="max-w-prose">
      {expanded || !isTruncated ? (
        <div
          id={contentId}
          className="cms-content mx-0 max-w-prose"
          dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html) }}
        />
      ) : (
        <p id={contentId} className="whitespace-pre-line text-base leading-relaxed text-mairie-ink">
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
