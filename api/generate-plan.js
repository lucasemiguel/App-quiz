export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `
        Atue como um Especialista em Neuropsicologia e Recuperação de Vícios.
        Analise o perfil deste usuário:
        RESPOSTAS: ${answers ? answers.join(" | ") : "Não informado"}
        MOTIVAÇÃO: "${motive}"
        
        Gere um Plano de Sobriedade Estruturado:
        ### 1. MAPEAMENTO COMPORTAMENTAL
        ### 2. O IMPACTO DA LIBERDADE (Dinheiro e Tempo)
        ### 3. PROTOCOLO DE AÇÃO (PRIMEIROS 7 DIAS)
        ### 4. ESCUDO CONTRA GATILHOS
        ### 5. SEU MANTRA DE FORÇA
        
        Use um tom profissional e humano.
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
        const planText = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ plan: planText });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao gerar plano." });
    }
}
