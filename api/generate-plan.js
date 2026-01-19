export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Usando o modelo que seu diagnóstico confirmou: gemini-2.0-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `
        Atue como um Especialista em Neuropsicologia.
        Analise este perfil para um plano de sobriedade:
        RESPOSTAS: ${answers ? JSON.stringify(answers) : "Variadas"}
        MOTIVAÇÃO: "${motive}"
        
        Gere um Plano de Sobriedade Estruturado com os títulos:
        ### 🧠 1. MAPEAMENTO COMPORTAMENTAL
        ### 💰 2. O IMPACTO DA LIBERDADE
        ### 🛡️ 3. PROTOCOLO DE AÇÃO (PRIMEIROS 7 DIAS)
        ### ⚡ 4. ESCUDO CONTRA GATILHOS
        ### 🎯 5. SEU MANTRA DE FORÇA
        
        Use Markdown para formatação.
    `;

    try {
        const response = await fetch(url, {
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
            return res.status(500).json({ error: "Erro na IA", details: data });
        }
    } catch (err) {
        return res.status(500).json({ error: "Falha de conexão." });
    }
}
