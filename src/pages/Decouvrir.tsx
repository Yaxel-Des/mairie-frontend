import ApiError from '../components/ApiError';
import ExpandableCmsContent from '../components/ExpandableCmsContent';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import PageHeader from '../components/PageHeader';
import { getDecouvrirParametres, getTextField } from '../data/api';
import useApiResource from '../hooks/useApiResource';

const unavailableMessage = 'Cette information sera bientôt disponible.';

export default function Decouvrir() {
  const { data, isLoading, error } = useApiResource(getDecouvrirParametres);
  const history = getTextField(data, 'Histoire');
  const heritage = getTextField(data, 'Patrimoine');
  const facilities = getTextField(data, 'Equipements');

  return (
    <>
      <PageHeader
        title="Découvrir Bingerville"
        intro="Repères historiques et patrimoine de la commune."
      />

      <div className="wrap space-y-12 py-10">
        {isLoading ? <Loading /> : error ? <ApiError message={error} /> : null}

        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="flex items-center gap-3 font-serif text-2xl font-semibold text-mairie-brown">
            <Icon name="book" className="h-6 w-6 text-mairie-lagoon" />
            Histoire de Bingerville
          </h2>
          {history ? (
            <div className="mt-4"><ExpandableCmsContent html={history} /></div>
          ) : (
            <p className="mt-4 max-w-3xl text-base text-mairie-muted">
              {unavailableMessage}
            </p>
          )}
        </section>

        <section aria-labelledby="heritage-heading">
          <h2 id="heritage-heading" className="font-serif text-2xl font-semibold text-mairie-brown">
            Patrimoine
          </h2>
          {heritage ? (
            <div className="mt-4"><ExpandableCmsContent html={heritage} /></div>
          ) : (
            <p className="mt-3 text-base text-mairie-muted">
              {unavailableMessage}
            </p>
          )}
        </section>

        <section aria-labelledby="facilities-heading">
          <h2 id="facilities-heading" className="flex items-center gap-3 font-serif text-2xl font-semibold text-mairie-brown">
            <Icon name="columns" className="h-6 w-6 text-mairie-lagoon" />
            Équipements et lieux de visite
          </h2>
          {facilities ? (
            <div className="mt-4"><ExpandableCmsContent html={facilities} /></div>
          ) : (
            <p className="mt-3 text-base text-mairie-muted">
              {unavailableMessage}
            </p>
          )}
        </section>
      </div>
    </>
  );
}
