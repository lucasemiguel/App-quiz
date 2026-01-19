export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Chave API não configurada." });
    }

    // Mudamos para a versão v1 e o modelo gemini-1.5-flash-latest que é mais estável
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const planText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ plan: planText });
        } else {
            // Se o Google der erro, ele vai aparecer aqui nos Logs da Vercel
            console.error("Resposta do Google:", data);
            return res.status(500).json({ error: "Erro na resposta da IA", details: data });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erro de conexão." });
    }
}
