import type { CEFRLevel, VocabularyWord, Topic, GrammarRule } from '../types';

export const TOPICS_BY_LEVEL: Record<CEFRLevel, Topic[]> = {
  A1: [
    { id: 'a1-intro', name: 'Se présenter', level: 'A1', description: 'הצגה עצמית - שם, גיל, לאום', vocabulary_count: 25 },
    { id: 'a1-family', name: 'La famille', level: 'A1', description: 'Parents, frères, sœurs', vocabulary_count: 30 },
    { id: 'a1-numbers', name: 'Les nombres', level: 'A1', description: '0-100, l\'heure', vocabulary_count: 20 },
    { id: 'a1-colors', name: 'Les couleurs', level: 'A1', description: 'Couleurs de base', vocabulary_count: 15 },
    { id: 'a1-food', name: 'La nourriture', level: 'A1', description: 'Aliments de base', vocabulary_count: 35 }
  ],
  A2: [
    { id: 'a2-daily', name: 'Routine quotidienne', level: 'A2', description: 'Activités journalières', vocabulary_count: 40 },
    { id: 'a2-shopping', name: 'Les achats', level: 'A2', description: 'Magasins, prix, vêtements', vocabulary_count: 45 },
    { id: 'a2-transport', name: 'Les transports', level: 'A2', description: 'Bus, train, avion', vocabulary_count: 30 },
    { id: 'a2-weather', name: 'La météo', level: 'A2', description: 'Temps, saisons', vocabulary_count: 25 },
    { id: 'a2-hobbies', name: 'Les loisirs', level: 'A2', description: 'Sport, musique, lecture', vocabulary_count: 50 }
  ],
  B1: [
    { id: 'b1-work', name: 'Le travail', level: 'B1', description: 'Professions, bureau', vocabulary_count: 60 },
    { id: 'b1-health', name: 'La santé', level: 'B1', description: 'Médecin, symptômes', vocabulary_count: 45 },
    { id: 'b1-travel', name: 'Les voyages', level: 'B1', description: 'Hôtel, réservation', vocabulary_count: 55 },
    { id: 'b1-technology', name: 'La technologie', level: 'B1', description: 'Internet, ordinateur', vocabulary_count: 40 },
    { id: 'b1-environment', name: 'L\'environnement', level: 'B1', description: 'Nature, pollution', vocabulary_count: 50 }
  ],
  B2: [
    { id: 'b2-politics', name: 'La politique', level: 'B2', description: 'Gouvernement, élections', vocabulary_count: 70 },
    { id: 'b2-culture', name: 'La culture', level: 'B2', description: 'Art, littérature, théâtre', vocabulary_count: 65 },
    { id: 'b2-economy', name: 'L\'économie', level: 'B2', description: 'Banque, investissement', vocabulary_count: 60 },
    { id: 'b2-science', name: 'Les sciences', level: 'B2', description: 'Recherche, innovation', vocabulary_count: 55 },
    { id: 'b2-society', name: 'La société', level: 'B2', description: 'Problèmes sociaux', vocabulary_count: 75 }
  ]
};

export const SAMPLE_VOCABULARY: VocabularyWord[] = [
  // A1 Level
  { id: '1', french: 'bonjour', english: 'hello', level: 'A1', topic: 'Se présenter', difficulty: 1 },
  { id: '2', french: 'au revoir', english: 'goodbye', level: 'A1', topic: 'Se présenter', difficulty: 1 },
  { id: '3', french: 'merci', english: 'thank you', level: 'A1', topic: 'Se présenter', difficulty: 1 },
  { id: '4', french: 'famille', english: 'family', level: 'A1', topic: 'La famille', difficulty: 1 },
  { id: '5', french: 'mère', english: 'mother', level: 'A1', topic: 'La famille', difficulty: 1 },
  
  // A2 Level
  { id: '6', french: 'quotidien', english: 'daily', level: 'A2', topic: 'Routine quotidienne', difficulty: 2 },
  { id: '7', french: 'acheter', english: 'to buy', level: 'A2', topic: 'Les achats', difficulty: 2 },
  { id: '8', french: 'magasin', english: 'store', level: 'A2', topic: 'Les achats', difficulty: 2 },
  
  // B1 Level
  { id: '9', french: 'professionnel', english: 'professional', level: 'B1', topic: 'Le travail', difficulty: 3 },
  { id: '10', french: 'responsabilité', english: 'responsibility', level: 'B1', topic: 'Le travail', difficulty: 3 },
  
  // B2 Level
  { id: '11', french: 'gouvernement', english: 'government', level: 'B2', topic: 'La politique', difficulty: 4 },
  { id: '12', french: 'démocatie', english: 'democracy', level: 'B2', topic: 'La politique', difficulty: 4 }
];

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    id: 'a1-articles',
    level: 'A1',
    title: 'Les articles définis',
    explanation: 'Le, la, les - utilisés pour des noms spécifiques',
    examples: ['le chat', 'la maison', 'les enfants']
  },
  {
    id: 'a1-verbs-present',
    level: 'A1',
    title: 'Présent des verbes du 1er groupe',
    explanation: 'Verbes en -er: je parle, tu parles, il parle...',
    examples: ['je mange', 'tu danses', 'nous chantons']
  },
  {
    id: 'a2-past-compose',
    level: 'A2',
    title: 'Le passé composé',
    explanation: 'Auxiliaire avoir/être + participe passé',
    examples: ['j\'ai mangé', 'je suis allé(e)', 'nous avons parlé']
  },
  {
    id: 'b1-subjunctive',
    level: 'B1',
    title: 'Le subjonctif présent',
    explanation: 'Exprime l\'opinion, l\'émotion, le doute',
    examples: ['Il faut que je parte', 'Je doute qu\'il vienne']
  }
];

export const COMMON_VERBS = [
  { infinitive: 'être', present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'] },
  { infinitive: 'avoir', present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'] },
  { infinitive: 'aller', present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'] },
  { infinitive: 'faire', present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'] },
  { infinitive: 'dire', present: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'] }
];