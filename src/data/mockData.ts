import newsData from './news.json';

export type NewsItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  summary: string;
};

export type Procedure = {
  id: string;
  title: string;
  description: string;
  requiredDocuments: string[];
  processingTime: string;
  cost: string;
  location: string;
};

export type Project = {
  id: number;
  title: string;
  summary: string;
  status: 'Prévu' | 'En cours' | 'Terminé';
};

export type MunicipalDocument = {
  id: number;
  title: string;
  category: 'Délibération' | 'Arrêté';
  date: string;
  year: number;
  fileName: string;
};

export const homeAlert = {
  active: false,
  message: 'Aucune alerte municipale en cours.',
};

export const mayorMessage =
  'La Mairie de Bingerville œuvre au quotidien pour améliorer le cadre de vie, faciliter l’accès aux services municipaux et accompagner le développement de notre commune. Ce site vous permet de retrouver les informations et démarches utiles à vos échanges avec l’administration communale.';

export const news: NewsItem[] = newsData;

export const procedures: Procedure[] = [
  {
    id: 'acte-naissance',
    title: 'Acte de naissance',
    description: 'Demande de copie ou d’extrait d’acte de naissance.',
    requiredDocuments: ['Référence de l’acte ou informations d’état civil'],
    processingTime: 'À confirmer auprès du service d’état civil',
    cost: 'À confirmer auprès de la Mairie',
    location: 'Service d’état civil, Mairie de Bingerville',
  },
  {
    id: 'mariage',
    title: 'Dossier de mariage',
    description: 'Informations sur la constitution d’un dossier de mariage civil.',
    requiredDocuments: ['Pièces d’identité des futurs époux'],
    processingTime: 'À confirmer auprès du service d’état civil',
    cost: 'À confirmer auprès de la Mairie',
    location: 'Service d’état civil, Mairie de Bingerville',
  },
  {
    id: 'deces',
    title: 'Acte de décès',
    description: 'Demande de copie ou d’extrait d’acte de décès.',
    requiredDocuments: ['Référence de l’acte ou informations d’état civil'],
    processingTime: 'À confirmer auprès du service d’état civil',
    cost: 'À confirmer auprès de la Mairie',
    location: 'Service d’état civil, Mairie de Bingerville',
  },
  {
    id: 'urbanisme',
    title: 'Autorisation d’urbanisme',
    description: 'Renseignements préalables pour les démarches d’urbanisme.',
    requiredDocuments: ['Dossier à définir selon la nature du projet'],
    processingTime: 'À confirmer auprès du service de l’urbanisme',
    cost: 'À confirmer auprès de la Mairie',
    location: 'Service de l’urbanisme, Mairie de Bingerville',
  },
  {
    id: 'legalisation',
    title: 'Légalisation de document',
    description: 'Renseignements sur la légalisation de documents administratifs.',
    requiredDocuments: ['Document original concerné', 'Pièce d’identité'],
    processingTime: 'À confirmer auprès du service compétent',
    cost: 'À confirmer auprès de la Mairie',
    location: 'Accueil de la Mairie de Bingerville',
  },
  {
    id: 'reclamation',
    title: 'Réclamation et demande',
    description: 'Transmettre une demande ou une réclamation à la commune.',
    requiredDocuments: ['Description de la demande', 'Coordonnées du demandeur'],
    processingTime: 'Selon la nature de la demande',
    cost: 'Sans frais',
    location: 'Accueil de la Mairie ou formulaire de contact',
  },
];

export const quickLinks = procedures.map(({ id, title, description }) => ({
  id,
  title,
  description,
  to: `/services?demarche=${id}`,
}));

export const services = procedures;

export const mairieContact = {
  address: '[À COMPLÉTER PAR LA MAIRIE : adresse postale complète.]',
  hours: '[À COMPLÉTER PAR LA MAIRIE : horaires d’ouverture.]',
};

export const projects: Project[] = [
  {
    id: 1,
    title: 'Amélioration des services municipaux',
    summary: 'Informations détaillées sur le projet à compléter par la Mairie.',
    status: 'En cours',
  },
  {
    id: 2,
    title: 'Aménagement du cadre de vie',
    summary: 'Informations détaillées sur le projet à compléter par la Mairie.',
    status: 'Prévu',
  },
  {
    id: 3,
    title: 'Développement des équipements communaux',
    summary: 'Informations détaillées sur le projet à compléter par la Mairie.',
    status: 'Terminé',
  },
];

export const municipalDocuments: MunicipalDocument[] = [
  {
    id: 1,
    title: 'Délibération municipale — document fictif',
    category: 'Délibération',
    date: 'Date à compléter',
    year: 2026,
    fileName: 'deliberation-fictive.pdf',
  },
  {
    id: 2,
    title: 'Arrêté municipal — document fictif',
    category: 'Arrêté',
    date: 'Date à compléter',
    year: 2025,
    fileName: 'arrete-fictif.pdf',
  },
  {
    id: 3,
    title: 'Délibération relative à un projet communal — document fictif',
    category: 'Délibération',
    date: 'Date à compléter',
    year: 2024,
    fileName: 'deliberation-projet-fictive.pdf',
  },
];
