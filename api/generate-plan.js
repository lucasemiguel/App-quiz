async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers')) || [];
    
    // CHAVE GEMINI (Grátis e sem bloqueio automático de exposição)
    const GEMINI_KEY = "AIzaSyAz3dfb9cKYZaJzqFI5lr1MU8BF3R-qh4E";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

    console.log("LOG: Iniciando conexão direta com Gemini...");

    const prompt = `Analise como um Neuropsicólogo. Motivo: "${motive}". Respostas: ${JSON.stringify(answers)}. 
    Retorne APENAS JSON puro: {"dias":"01","money":"valor","hours":"valor","perfilRisco":"texto","plano":{"manha":"txt","tarde":"txt","noite":"txt"},"urgencia":{"tecnica":"txt","choque":"txt"}}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // Limpa o texto caso a IA mande ```json
        const cleanJson = JSON.parse(text.replace(/```json|```/g, ""));

        localStorage.setItem('appData', JSON.stringify(cleanJson));
        console.log("LOG: Sucesso! Dados salvos.");
        
        window.location.assign('sucesso.html');

    } catch (error) {
        console.error("ERRO:", error);
        alert("Erro na conexão. Verifique se sua chave API está ativa no Google AI Studio.");
    }
}
