// Fonction serverless Vercel — fait office de proxy sécurisé vers OpenAI.
// La clé API reste ici, côté serveur, et n'est JAMAIS envoyée au téléphone/navigateur.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { postContent, tone, goal } = req.body;

  if (!postContent || !postContent.trim()) {
    return res.status(400).json({ error: 'Le contenu du post est requis.' });
  }

  const API_KEY = process.env.OPENAI_API_KEY;

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
  - Si "Personal Branding": ajoute une touche personnelle ou une expérience vécue
  - Si "Les deux": combine les deux approches naturellement
- Style: naturel, authentique, jamais spam ou générique
- Évite les emojis excessifs (1-2 max par commentaire)
- Pas de salutations du type "Bonjour" ou "Salut" en début

Réponds UNIQUEMENT avec un JSON valide contenant un tableau "comments" avec les 3 commentaires:

{
  "comments": ["commentaire 1", "commentaire 2", "commentaire 3"]
}`
          }
        ],
        max_tokens: 500,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Erreur OpenAI:', errText);
      return res.status(502).json({ error: 'Erreur lors de l\'appel à OpenAI.' });
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;

    let comments;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
      comments = parsed.comments;
    } catch (parseError) {
      console.error('Erreur de parsing:', parseError, responseText);
      return res.status(502).json({ error: 'Réponse IA invalide.' });
    }

    return res.status(200).json({ comments });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
}
