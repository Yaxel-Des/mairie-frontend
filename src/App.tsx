import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Actualites from './pages/Actualites';
import ActualiteDetail from './pages/ActualiteDetail';
import Contact from './pages/Contact';
import Decouvrir from './pages/Decouvrir';
import Documents from './pages/Documents';
import Home from './pages/Home';
import LaMairie from './pages/LaMairie';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Projets from './pages/Projets';
import Recherche from './pages/Recherche';
import Services from './pages/Services';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/mairie" element={<LaMairie />} />
        <Route path="/services" element={<Services />} />
        <Route path="/actualites/:id" element={<ActualiteDetail />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/projets" element={<Projets />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/decouvrir-bingerville" element={<Decouvrir />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/recherche" element={<Recherche />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route
          path="/politique-de-confidentialite"
          element={<PolitiqueConfidentialite />}
        />
      </Route>
    </Routes>
  );
}
