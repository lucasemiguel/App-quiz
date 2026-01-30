export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Post only' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { answers, motive } = req.body;

    // A combinação que costuma ser a "chave mestre" quando as outras falham:
    // Versão v1beta com o nome seco do modelo 1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `Aja como um neuropsicólogo. Motivo: "${motive}". Dados: ${JSON.stringify(answers)}. Gere um plano de sobriedade prático em Português. Use títulos ### e negritos **.` 
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ 
                plan: `ERRO FINAL DE HOJE: ${data.error.message} (Status: ${data.error.status})` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ plan: data.candidates[0].content.parts[0].text });
        }

        return res.status(200).json({ plan: "O servidor respondeu, mas não gerou texto. Pode ser uma restrição de conteúdo do Google." });

    } catch (err) {
        return res.status(200).json({ plan: "Erro de conexão: " + err.message });
    }
}
