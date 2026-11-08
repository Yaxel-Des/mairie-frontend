import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SiteSearch() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/recherche?q=${encodeURIComponent(trimmedQuery)}`);
    }
  }

  return (
    <form
      role="search"
      aria-label="Recherche sur le site"
      className="wrap flex gap-2 py-3"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="site-search">
        Rechercher une page, une démarche ou un document
      </label>
      <input
        id="site-search"
        className="field flex-1"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher une page, une démarche ou un document"
      />
      <button className="btn-primary shrink-0" type="submit">
        Rechercher
      </button>
    </form>
  );
}
