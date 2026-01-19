export default async function handler(req, res) {
    // Configura os headers para evitar problemas de cache
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Chave da API não configurada na Vercel." });
    }

    const prompt = `
        Atue como um Especialista em Neuropsicologia.
        Analise o perfil deste usuário para um plano de sobriedade:
        RESPOSTAS: ${answers ? JSON.stringify(answers) : "Não informado"}
        MOTIVAÇÃO: "${motive}"
        
        Gere um Plano de Sobriedade Estruturado com os títulos:
        ### 1. MAPEAMENTO COMPORTAMENTAL
        ### 2. O IMPACTO DA LIBERDADE
        ### 3. PROTOCOLO DE AÇÃO (PRIMEIROS 7 DIAS)
        ### 4. ESCUDO CONTRA GATILHOS
        ### 5. SEU MANTRA DE FORÇA
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // Verifica se a IA devolveu o texto corretamente
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
            const planText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ plan: planText });
        } else {
            console.error("Erro na resposta do Gemini:", data);
            return res.status(500).json({ error: "A IA não conseguiu processar os dados.", details: data });
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        return res.status(500).json({ error: "Erro na conexão com o servidor da IA." });
    }
}
