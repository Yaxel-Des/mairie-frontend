import { useId, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getCmsMarkdown, richTextToHtml, richTextToPlainText } from '../data/api';

type ExpandableCmsContentProps = {
  html: unknown;
};

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
  const markdown = getCmsMarkdown(html);
  const safeHtml = richTextToHtml(html);
  const plainText = richTextToPlainText(html);
  const isTruncated = plainText.length > 300;

  return (
    <div className="max-w-prose">
      {expanded || !isTruncated ? (
        <div id={contentId} className="cms-content mx-0 max-w-prose">
          {markdown !== null ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h2>{children}</h2>,
                h2: ({ children }) => <h2>{children}</h2>,
                h3: ({ children }) => <h3>{children}</h3>,
                h4: ({ children }) => <h4>{children}</h4>,
              }}
            >
              {markdown}
            </ReactMarkdown>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
          )}
        </div>
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
