export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Usando o modelo 'gemini-pro' que é o identificador mais aceito na v1beta
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Atue como um Especialista em Neuropsicologia. 
                        Gere um Plano de Sobriedade para quem tem este motivo: ${motive}. 
                        Respostas do Quiz: ${JSON.stringify(answers)}. 
                        Use tópicos e Markdown.`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Se o erro de 404 persistir, o Log abaixo vai nos mostrar se o Google sugere outro nome
        if (data.error) {
            console.error("Resposta de erro do Google:", JSON.stringify(data));
            return res.status(500).json({ error: data.error.message, code: data.error.code });
        }

        if (data.candidates && data.candidates[0].content) {
            const planText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ plan: planText });
        }
        
        return res.status(500).json({ error: "Resposta inesperada da IA" });

    } catch (err) {
        console.error("Erro na requisição fetch:", err);
        return res.status(500).json({ error: "Erro de conexão com o servidor." });
    }
}
