async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers')) || [];

    try {
        const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers, motive })
        });
        const data = await response.json();
        
        if (data) {
            // AQUI ESTAVA O ERRO: O nome da chave precisa ser appData
            localStorage.setItem('appData', JSON.stringify(data));
            window.location.assign('sucesso.html');
        }
    } catch (error) { console.error(error); }
}
