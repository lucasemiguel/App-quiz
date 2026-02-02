export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Post only' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { answers, motive } = req.body;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `Aja como um neuropsicólogo clínico especialista em vícios. 
                        Motivo do paciente: "${motive}". 
                        Dados do Quiz: ${JSON.stringify(answers)}. 

                        Gere um plano de sobriedade estruturado EXATAMENTE com estas etiquetas para que meu sistema possa ler:

                        [ANALISE]
                        Crie uma análise técnica e empática em HTML (use <h3> para títulos e <p> para parágrafos). Fale dos gatilhos específicos das respostas.

                        [TAREFAS]
                        Liste 3 tarefas curtas, práticas e personalizadas para hoje, separadas APENAS por vírgula. Exemplo: Caminhar 10 min, Beber água, Ligar para um amigo.

                        [MUSICA]
                        Sugira uma frequência sonora (ex: 528Hz) ou estilo musical para o estado emocional dele.` 
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ 
                plan: `[ANALISE]<h3>Atenção</h3><p>O sistema está sobrecarregado, mas seu perfil foi mapeado. (Erro: ${data.error.message})</p>[TAREFAS]Respirar fundo 3 vezes, Beber água, Revisar seu porquê[MUSICA]Frequência 432Hz` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ plan: data.candidates[0].content.parts[0].text });
        }

        return res.status(200).json({ plan: "[ANALISE]<p>Houve uma restrição de segurança. Revise seus gatilhos com calma.</p>[TAREFAS]Meditar, Beber água, Descansar[MUSICA]Silêncio relaxante" });

    } catch (err) {
        return res.status(200).json({ plan: "Erro de conexão ao gerar diagnóstico: " + err.message });
    }
}
