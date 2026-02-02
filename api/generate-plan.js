export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Post only' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { answers, motive } = req.body;

    // Endpoint v1beta para garantir compatibilidade com gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `Aja como um neuropsicólogo clínico especialista em comportamento e vícios. 
                        Motivo do paciente: "${motive}". 
                        Dados do Quiz: ${JSON.stringify(answers)}. 

                        Gere um plano de sobriedade prático e transformador em Português. 
                        Estruture com:
                        1. Análise de Perfil (Gatilhos e Riscos).
                        2. Plano de Ação Imediato (Primeiras 72 horas).
                        3. Estratégia de Médio Prazo (30 dias).
                        4. Mensagem de reforço baseada no 'Porquê' do usuário.
                        
                        Use títulos ### e negritos ** para facilitar a leitura.` 
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ 
                plan: `Nota: O sistema está sobrecarregado, mas seu perfil foi mapeado. (Erro: ${data.error.message})` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ plan: data.candidates[0].content.parts[0].text });
        }

        return res.status(200).json({ plan: "O plano foi gerado, mas houve uma restrição de segurança. Revise seus gatilhos com calma." });

    } catch (err) {
        return res.status(200).json({ plan: "Erro de conexão ao gerar diagnóstico: " + err.message });
    }
}
