import { useState } from 'react';
import ApiError from '../components/ApiError';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import { getDocuments, getMediaFileUrl, getRecordKey, getTextField } from '../data/api';
import useApiResource from '../hooks/useApiResource';

const unavailableMessage = 'Cette information sera bientôt disponible.';

const categoryStyle: Record<string, string> = {
  Délibération: 'bg-mairie-lagoonSoft text-mairie-lagoonDeep',
  Arrêté: 'bg-mairie-goldSoft text-mairie-goldDeep',
};

export default function Documents() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const { data: documents, isLoading, error } = useApiResource(getDocuments);
  const documentItems = (documents ?? []).map((document) => {
    const rawYear = document.Annee;
    const parsedYear =
      rawYear === null || rawYear === undefined || rawYear === ''
        ? Number.NaN
        : typeof rawYear === 'number'
          ? rawYear
          : Number(rawYear);
    const rawType = document.Type ?? document.TypeDocument;
    const type =
      typeof rawType === 'string'
        ? rawType
        : rawType && typeof rawType === 'object' && 'Nom' in rawType && typeof rawType.Nom === 'string'
          ? rawType.Nom
          : 'Document';
    const date = getTextField(document, 'DatePublication', 'Date', 'DateDocument');
    return {
      id: getRecordKey(document),
      title: getTextField(document, 'Titre', 'Nom') || 'Document municipal',
      type,
      year: Number.isFinite(parsedYear) ? parsedYear : null,
      date: date || (Number.isFinite(parsedYear) ? String(parsedYear) : unavailableMessage),
      url: getMediaFileUrl(document.Pdf ?? document.FichierPDF ?? document.Fichier),
    };
  });
  const documentTypes = [...new Set(documentItems.map(({ type }) => type))].sort();
  const documentYears = [
    ...new Set(documentItems.map(({ year }) => year).filter((year): year is number => year !== null)),
  ].sort((a, b) => b - a);
  const filteredDocuments = documentItems.filter((document) => {
    const typeMatches = selectedType === 'all' || document.type === selectedType;
    const yearMatches = selectedYear === 'all' || document.year === Number(selectedYear);
    return typeMatches && yearMatches;
  });

  return (
    <>
      <PageHeader
        title="Documents municipaux"
        intro="Consultez et téléchargez les documents officiels publiés par la Mairie."
      />

      <div className="wrap py-10">
        {isLoading ? <Loading /> : null}
        {error ? <ApiError message={error} /> : null}
        <div className="mb-6 grid gap-4 sm:grid-cols-2" role="group" aria-label="Filtres des documents">
          <div>
            <label className="mb-1.5 block text-base font-semibold text-mairie-brown" htmlFor="document-type">
              Type de document
            </label>
            <select
              className="field"
              id="document-type"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              <option value="all">Tous les types</option>
              {documentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-base font-semibold text-mairie-brown" htmlFor="document-year">
              Année
            </label>
            <select
              className="field"
              id="document-year"
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              <option value="all">Toutes les années</option>
              {documentYears.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>

        {!isLoading && !error && filteredDocuments.length > 0 ? (
          <ul className="card divide-y divide-mairie-line overflow-hidden">
            {filteredDocuments.map((document) => (
            <li
              key={document.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-mairie-mist text-mairie-brown">
                  <Icon name="document" className="h-5 w-5" />
                </span>
                <div>
                  <p
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      categoryStyle[document.type] ?? 'bg-mairie-mist text-mairie-muted'
                    }`}
                  >
                    {document.type}
                  </p>
                  <h2 className="mt-1.5 font-serif text-lg font-semibold leading-snug text-mairie-brown">
                    {document.title}
                  </h2>
                  <p className="mt-2 text-base text-mairie-muted">{document.date}</p>
                </div>
              </div>
              {document.url ? (
                <a className="btn-primary shrink-0" href={document.url} target="_blank" rel="noreferrer">
                  <Icon name="download" className="h-4 w-4" />
                  Télécharger (PDF)
                  <span className="sr-only"> : {document.title}</span>
                </a>
              ) : (
                <p className="text-base text-mairie-muted">{unavailableMessage}</p>
              )}
            </li>
          ))}
          </ul>
        ) : !isLoading && !error ? (
          <p className="todo-note" role="status">Aucun document ne correspond à ces filtres.</p>
        ) : null}
      </div>
    </>
  );
}
