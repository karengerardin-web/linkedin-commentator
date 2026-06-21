<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Générateur de Commentaires LinkedIn</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#0A66C2">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f3f2ef 0%, #e8e6e1 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            color: #0A66C2;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .header h1 span {
            font-size: 2.2rem;
        }

        .badge {
            display: inline-block;
            background: linear-gradient(135deg, #0A66C2, #0077B5);
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .form-card {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 24px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            font-size: 0.95rem;
        }

        textarea {
            width: 100%;
            min-height: 120px;
            padding: 16px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 1rem;
            font-family: inherit;
            resize: vertical;
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        textarea:focus {
            outline: none;
            border-color: #0A66C2;
            box-shadow: 0 0 0 4px rgba(10, 102, 194, 0.1);
        }

        textarea::placeholder {
            color: #999;
        }

        .select-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 600px) {
            .select-row {
                grid-template-columns: 1fr;
            }
        }

        select {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 1rem;
            font-family: inherit;
            background: white;
            cursor: pointer;
            transition: border-color 0.3s;
        }

        select:focus {
            outline: none;
            border-color: #0A66C2;
        }

        .btn-generate {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #0A66C2, #0077B5);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .btn-generate:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(10, 102, 194, 0.3);
        }

        .btn-generate:active {
            transform: translateY(0);
        }

        .result-section {
            display: none;
        }

        .result-section.active {
            display: block;
        }

        .result-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .result-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }

        .result-header h3 {
            color: #333;
            font-size: 1.05rem;
        }

        .prompt-preview {
            background: #f9f9f9;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            padding: 16px;
            font-size: 0.85rem;
            color: #555;
            white-space: pre-wrap;
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 16px;
            font-family: 'Courier New', monospace;
        }

        .btn-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .btn-action {
            flex: 1;
            min-width: 160px;
            padding: 14px;
            border: none;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
        }

        .btn-copy {
            background: #0A66C2;
            color: white;
        }

        .btn-copy:hover {
            background: #0077B5;
        }

        .btn-copy.copied {
            background: #10B981;
        }

        .btn-claude {
            background: #D97757;
            color: white;
        }

        .btn-claude:hover {
            background: #C26544;
        }

        .steps {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        .steps h4 {
            color: #333;
            margin-bottom: 12px;
            font-size: 0.95rem;
        }

        .steps ol {
            padding-left: 20px;
            color: #555;
            font-size: 0.9rem;
            line-height: 1.8;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            color: #888;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1><span>💬</span> Générateur de Commentaires LinkedIn</h1>
            <span class="badge">100% Gratuit · Powered by Claude</span>
        </header>

        <div class="form-card">
            <div class="form-group">
                <label for="postInput">📝 Contenu du post LinkedIn</label>
                <textarea 
                    id="postInput" 
                    placeholder="Collez ici le contenu du post LinkedIn que vous souhaitez commenter..."
                ></textarea>
            </div>

            <div class="select-row">
                <div class="form-group">
                    <label for="toneSelect">🎯 Ton du commentaire</label>
                    <select id="toneSelect">
                        <option value="Expert">Expert</option>
                        <option value="Accessible">Accessible</option>
                        <option value="Dynamique">Dynamique</option>
                        <option value="Corporate">Corporate</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="goalSelect">🎯 Objectif</label>
                    <select id="goalSelect">
                        <option value="Prospection B2B">Prospection B2B</option>
                        <option value="Personal Branding">Personal Branding</option>
                        <option value="Les deux">Les deux</option>
                    </select>
                </div>
            </div>

            <button class="btn-generate" id="generateBtn" onclick="prepareCopy()">
                ✨ Préparer la demande
            </button>
        </div>

        <div class="result-section" id="resultSection">
            <div class="result-card">
                <div class="result-header">
                    <h3>✅ Prompt prêt à copier</h3>
                </div>
                <div class="prompt-preview" id="promptPreview"></div>
                <div class="btn-row">
                    <button class="btn-action btn-copy" id="copyBtn" onclick="copyPrompt()">📋 Copier le prompt</button>
                    <a class="btn-action btn-claude" href="https://claude.ai/new" target="_blank" rel="noopener">🤖 Ouvrir Claude.ai</a>
                </div>
                <div class="steps">
                    <h4>📌 Marche à suivre :</h4>
                    <ol>
                        <li>Tape sur "Copier le prompt" ci-dessus</li>
                        <li>Tape sur "Ouvrir Claude.ai" (gratuit, sans compte payant nécessaire)</li>
                        <li>Colle le prompt dans la zone de discussion et envoie</li>
                        <li>Choisis le commentaire qui te plaît parmi les 3 proposés</li>
                        <li>Copie-le et colle-le directement sous le post LinkedIn</li>
                    </ol>
                </div>
            </div>
        </div>

        <footer class="footer">
            Développé avec 💙 pour optimiser votre présence LinkedIn — sans aucun coût
        </footer>
    </div>

    <script>
        function buildPrompt(postContent, tone, goal) {
            return `Tu es un expert en networking B2B et Personal Branding sur LinkedIn. Génère exactement 3 commentaires DIFFÉRENTS pour le post LinkedIn suivant.

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

Présente directement les 3 commentaires, numérotés, sans autre texte autour.`;
        }

        function prepareCopy() {
            const postContent = document.getElementById('postInput').value.trim();
            const tone = document.getElementById('toneSelect').value;
            const goal = document.getElementById('goalSelect').value;
            const resultSection = document.getElementById('resultSection');
            const promptPreview = document.getElementById('promptPreview');

            if (!postContent) {
                alert('Veuillez coller le contenu d\'un post LinkedIn.');
                return;
            }

            const prompt = buildPrompt(postContent, tone, goal);
            promptPreview.textContent = prompt;
            resultSection.classList.add('active');
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function copyPrompt() {
            const promptText = document.getElementById('promptPreview').textContent;
            const copyBtn = document.getElementById('copyBtn');

            navigator.clipboard.writeText(promptText).then(() => {
                copyBtn.innerHTML = '✓ Copié !';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.innerHTML = '📋 Copier le prompt';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Erreur de copie:', err);
                alert('Impossible de copier automatiquement. Sélectionnez le texte manuellement.');
            });
        }
    </script>
</body>
</html>
