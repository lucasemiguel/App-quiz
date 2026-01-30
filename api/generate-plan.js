export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Post only' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { answers, motive } = req.body;

    // Tentando o modelo 1.5-flash, que é o cavalo de batalha da Google
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Aja como um neuropsicólogo. Gere um plano de sobriedade para: ${motive}.` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // Isso vai imprimir o erro real na sua tela de sucesso
            return res.status(200).json({ 
                plan: `⚠️ STATUS DA IA: ${data.error.status}\nMENSAGEM: ${data.error.message}\n\nSe o erro for 'RESOURCE_EXHAUSTED', por favor, tente gerar uma chave nova em outro Gmail agora mesmo.` 
            });
        }

        if (data.candidates) {
            return res.status(200).json({ plan: data.candidates[0].content.parts[0].text });
        }

        return res.status(500).json({ error: "Erro na resposta" });
    } catch (err) {
        return res.status(500).json({ error: "Erro de rede" });
    }
}
