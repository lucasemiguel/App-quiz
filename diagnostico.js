async function gerarDiagnosticoIA() {
    const answers = JSON.parse(localStorage.getItem('userAnswers'));
    const motive = localStorage.getItem('userMotive');

    try {
        // MUITO IMPORTANTE: Mude '/api/gemini' para o nome exato da sua rota no servidor
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers, motive })
        });

        const data = await response.json();

        if (data.plan) {
            localStorage.setItem('diagnosticoFinal', data.plan);
            // Após gerar, ele vai para a página de pagamento/escolha de plano antes de ver o resultado
            showPaymentOptions(); 
        } else {
            throw new Error("Resposta inválida da IA");
        }
    } catch (error) {
        console.error("Erro na IA:", error);
        alert("Ocorreu um erro ao gerar seu diagnóstico. Tente novamente.");
        location.reload();
    }
}

function showPaymentOptions() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="text-center mb-10">
            <h3 class="text-3xl font-extrabold text-white mb-2 uppercase">Diagnóstico Concluído.</h3>
            <p class="text-gray-400">Escolha seu plano para liberar o acesso:</p>
        </div>
        <div class="grid gap-6">
            <div class="plan-card p-6 rounded-2xl flex justify-between items-center cursor-pointer" onclick="redirectToStripe()">
                <div><h4 class="text-white font-bold text-lg">Plano Mensal</h4><p class="text-gray-500 text-xs">Acompanhamento imediato</p></div>
                <div class="text-right"><span class="text-indigo-400 font-bold text-xl">R$ 29,90</span></div>
            </div>
            <div class="plan-card p-6 rounded-2xl border-indigo-500 bg-indigo-500/5 flex justify-between items-center relative cursor-pointer" onclick="redirectToStripe()">
                <div class="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] px-3 py-0.5 font-bold uppercase">Mais Popular</div>
                <div><h4 class="text-white font-bold text-lg">Plano Trimestral</h4><p class="text-gray-500 text-xs">90 dias de suporte</p></div>
                <div class="text-right"><span class="text-indigo-400 font-bold text-xl">R$ 79,90</span></div>
            </div>
        </div>
    `;
}

function redirectToStripe() {
    window.location.href = 'sucesso.html'; 
}
