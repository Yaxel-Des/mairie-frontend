import ReactMarkdown from 'react-markdown';
import { getCmsMarkdown, richTextToHtml } from '../data/api';

type CmsContentProps = {
  content: unknown;
};

export default function CmsContent({ content }: CmsContentProps) {
  const markdown = getCmsMarkdown(content);
  const safeHtml = richTextToHtml(content);

  return markdown !== null ? (
    <div className="cms-content mx-0 max-w-prose space-y-4 leading-relaxed">
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
    </div>
  ) : (
    <div
      className="cms-content mx-0 max-w-prose space-y-4 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
