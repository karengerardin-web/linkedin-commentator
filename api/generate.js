// Fonction serverless Vercel — fait office de proxy sécurisé vers OpenAI.
// La clé API reste ici, côté serveur, et n'est JAMAIS envoyée au téléphone/navigateur.

export default async function handler(req, res) {
  // On n'accepte que les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { postContent, tone, goal } = req.body;

  if (!postContent || !postContent.trim()) {
    return res.status(400).json({ error: 'Le contenu du post est requis.' });
  }

  const API_KEY = process.env.OPENAI_API_KEY; // Récupérée depuis les variables d'environnement Vercel, jamais codée en dur

  if (!API_KEY) {
    return res.status(500).json({ error: 'Clé API non configurée sur le serveur.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en networking B2B et Personal Branding sur LinkedIn. Ta mission est de générer des commentaires authentiques et engageants.'
          },
          {
            role: 'user',
            content: `Génère exactement 3 commentaires DIFFERENTS pour le post LinkedIn suivant.

POST: "${postContent}"

TON: ${tone}
OBJECTIF: ${goal}

RÈGLES DE GÉNÉRATION:
- Chaque commentaire doit être unique et distinct des autres
- Longueur: entre 80 et 150 caractères
- Ton: ${tone} - adapte le vocabulaire et le style en conséquence
- Objectif: ${goal}
  - Si "Prospection B2B": ajoute subtilement une question ouverte ou une invitation au dialogue
  - Si "Personal Branding":
