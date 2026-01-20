export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Usando o modelo 1.5 Flash que possui cota gratuita liberada (gemini-1.5-flash)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
        Atue como Especialista em Neuropsicologia.
        Gere um Plano de Sobriedade Estruturado.
        MOTIVO: "${motive}"
        RESPOSTAS: ${JSON.stringify(answers)}
        
        Use títulos em Markdown (###) e divida em:
        1. MAPEAMENTO COMPORTAMENTAL
        2. IMPACTO DA LIBERDADE
        3. PROTOCOLO DE 7 DIAS
        4. ESCUDO CONTRA GATILHOS
        5. SEU MANTRA DE FORÇA
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            // Se ainda der erro de cota no 1.5, o erro aparecerá aqui
            console.error("Erro Google:", data.error.message);
            return res.status(500).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            const planText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ plan: planText });
        }

        return res.status(500).json({ error: "Falha ao gerar plano." });

    } catch (err) {
        return res.status(500).json({ error: "Erro de conexão servidor." });
    }
}
