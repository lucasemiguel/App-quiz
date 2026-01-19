export default async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Este link pergunta ao Google quais modelos sua chave pode usar
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Se o plano não carregar, ele vai mostrar a lista de modelos disponíveis
        if (data.models) {
            const listaModelos = data.models.map(m => m.name).join(", ");
            return res.status(200).json({ 
                plan: `### DIAGNÓSTICO DE CONEXÃO:
                A IA está conectada! Você tem acesso aos seguintes modelos:
                
                ${listaModelos}
                
                **Instrução:** Escolha um dos nomes acima (ex: models/gemini-1.5-flash) e me mande aqui para eu ajustar o código final.` 
            });
        }

        return res.status(500).json({ error: "Erro ao listar modelos", details: data });

    } catch (err) {
        return res.status(500).json({ error: "Falha de rede" });
    }
}
