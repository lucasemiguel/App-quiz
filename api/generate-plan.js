export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Configuração de chave ausente." });
    }

    // URL Estabilizada para o modelo 1.5-flash
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
        Atue como um Especialista Sênior em Neuropsicologia e Recuperação de Hábitos.
        Analise o seguinte perfil para criar um Plano de Sobriedade de Alta Precisão:
        
        DADOS DO QUIZ: ${answers ? JSON.stringify(answers) : "Perfil variado"}
        MOTIVAÇÃO PRINCIPAL: "${motive}"
        
        Estruture sua resposta estritamente com estes tópicos, usando Markdown para negritos e títulos:

        ### 🧠 1. MAPEAMENTO COMPORTAMENTAL E NEURAL
        (Analise como o ciclo de dopamina do usuário está reagindo aos gatilhos mencionados)

        ### 💰 2. O IMPACTO DA SUA LIBERDADE
        (Projete o ganho de tempo e clareza mental baseado no motivo: ${motive})

        ### 🛡️ 3. PROTOCOLO DE CHOQUE (PRIMEIROS 7 DIAS)
        (Dê ordens claras e práticas para o ambiente e rotina imediata)

        ### ⚡ 4. ESCUDO CONTRA RECAÍDAS (GATILHOS)
        (Identifique os pontos críticos baseados nas respostas do quiz)

        ### 🎯 5. SEU MANTRA DE FORÇA PERSONALIZADO
        (Crie uma frase curta e poderosa baseada na motivação dele)

        Use um tom de autoridade, porém empático e motivador.
    `;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 2048,
                }
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const planText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ plan: planText });
        } else {
            console.error("Erro detalhado do Google:", JSON.stringify(data));
            return res.status(500).json({ error: "A IA encontrou um problema técnico.", details: data });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erro de conexão com o servidor de IA." });
    }
}
