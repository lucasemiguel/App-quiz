export default async function handler(req, res) {
    // 1. Bloqueia métodos que não sejam POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Erro de configuração: Chave API não encontrada na Vercel." });
    }

    // 2. URL usando o modelo gemini-2.0-flash que seu diagnóstico confirmou acesso
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // 3. Prompt estruturado para o Especialista em Neuropsicologia
    const promptText = `
        Atue como um Especialista Sênior em Neuropsicologia e Recuperação de Vícios.
        Analise os dados abaixo e gere um Plano de Sobriedade de Alta Precisão.
        
        MOTIVAÇÃO: "${motive}"
        DADOS DO PERFIL: ${JSON.stringify(answers)}
        
        Sua resposta deve ser em Português e estruturada com os seguintes tópicos em Markdown:
        ### 🧠 1. ANÁLISE DO SEU PERFIL NEURAL
        ### 💰 2. O PREÇO DA LIBERDADE (FOCO FINANCEIRO E TEMPO)
        ### 🛡️ 3. PROTOCOLO DE CHOQUE (PRIMEIROS 7 DIAS)
        ### ⚡ 4. ESCUDO CONTRA GATILHOS ESPECÍFICOS
        ### 🎯 5. SEU NOVO MANTRA DE FORÇA
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: promptText }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1500
                }
            })
        });

        const data = await response.json();

        // 4. Verificação de erros vindos do Google
        if (data.error) {
            console.error("Erro Google:", data.error.message);
            return res.status(500).json({ error: "A IA recusou a conexão.", detail: data.error.message });
        }

        // 5. Retorna o texto gerado
        if (data.candidates && data.candidates[0].content) {
            const planText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ plan: planText });
        }

        return res.status(500).json({ error: "A IA não conseguiu processar a resposta." });

    } catch (err) {
        console.error("Erro Servidor:", err);
        return res.status(500).json({ error: "Erro crítico de conexão no servidor." });
    }
}
