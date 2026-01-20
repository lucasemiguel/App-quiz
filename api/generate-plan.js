export default async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Vamos testar o modelo que apareceu primeiro na sua lista ontem
    const model = "gemini-2.0-flash"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: "Oi, responda apenas 'Conectado'." }]
                }]
            })
        });

        const data = await response.json();

        // Se der erro, vamos montar uma mensagem explicativa para aparecer no seu site
        if (data.error) {
            const erroFormatado = `
                ERRO IDENTIFICADO:
                Código: ${data.error.code}
                Status: ${data.error.status}
                Mensagem: ${data.error.message}
            `;
            return res.status(200).json({ plan: erroFormatado });
        }

        // Se funcionar, ele vai avisar
        if (data.candidates) {
            return res.status(200).json({ plan: "A conexão funcionou! O Google respondeu corretamente. O problema anterior era o tamanho do prompt ou o tempo de resposta." });
        }

        return res.status(200).json({ plan: "Resposta estranha do Google: " + JSON.stringify(data) });

    } catch (err) {
        return res.status(200).json({ plan: "Erro crítico de rede na Vercel: " + err.message });
    }
}
