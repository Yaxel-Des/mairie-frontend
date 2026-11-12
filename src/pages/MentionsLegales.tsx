import ApiError from '../components/ApiError';
import ExpandableCmsContent from '../components/ExpandableCmsContent';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import { getCmsContentField, getPageLegale } from '../data/api';
import useApiResource from '../hooks/useApiResource';

export default function MentionsLegales() {
  const { data, isLoading, error } = useApiResource(getPageLegale);
  const content = getCmsContentField(data, 'MentionsLegales');

  return (
    <>
      <PageHeader
        title="Mentions légales"
        intro="Informations relatives à l’édition et à l’hébergement du site."
      />

      <article className="wrap max-w-4xl space-y-6 py-10">
        {isLoading ? <Loading /> : null}
        {error ? <ApiError message={error} /> : null}

        {!isLoading && !error && content ? (
          <section aria-label="Mentions légales" className="card p-6 sm:p-8">
            <ExpandableCmsContent html={content} />
          </section>
        ) : null}
      </article>
    </>
  );
}
