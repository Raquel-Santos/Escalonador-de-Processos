document.addEventListener("DOMContentLoaded", () => {
    const pagina = document.body.id;

    if (pagina === "pagina-index") {
        // Lógica para index.html (escolha da quantidade de processos)
        document.getElementById("formQuantidade").addEventListener("submit", (e) => {
            const quantidade = document.getElementById("quantidadeProcessos").value;
            sessionStorage.setItem("quantidadeProcessos", quantidade); // Salva no sessionStorage
        });
    }

    if (pagina === "pagina-config") {
        // Lógica para config.html (formulário dinâmico)
        const quantidade = parseInt(sessionStorage.getItem("quantidadeProcessos"), 10);
        const processosContainer = document.getElementById("processosContainer");

        for (let i = 0; i < quantidade; i++) {
            const div = document.createElement("div");
            div.innerHTML = `
                <h3>Processo ${i + 1}</h3>
                <label>Tempo de Execução:</label>
                <input type="number" name="tempoExecucao[]" min="1" required>
                <label>Tempo de Espera:</label>
                <input type="number" name="tempoEspera[]" min="0" required>
            `;
            processosContainer.appendChild(div);
        }

        document.getElementById("formProcessos").addEventListener("submit", (e) => {
            e.preventDefault();
            const execucao = [...document.querySelectorAll('input[name="tempoExecucao[]"]')].map(input => input.value);
            const espera = [...document.querySelectorAll('input[name="tempoEspera[]"]')].map(input => input.value);

            sessionStorage.setItem("execucao", JSON.stringify(execucao));
            sessionStorage.setItem("espera", JSON.stringify(espera));

            window.location.href = "gantt.html";
        });
    }

    if (pagina === "pagina-gantt") {
        // Lógica para gantt.html (gráfico de Gantt)
        const execucao = JSON.parse(sessionStorage.getItem("execucao"));
        const espera = JSON.parse(sessionStorage.getItem("espera"));

        const filaDeProcessos = execucao.map((tempoExecucao, i) => ({
            nome: `P${i + 1}`,
            tempoExecucao: parseInt(tempoExecucao, 10),
            tempoEspera: parseInt(espera[i], 10),
            tempoInicio: null,
            tempoFim: null,
        }));

        let tempoAtual = 0;

        function atualizarGantt(processo) {
            const graficoGantt = document.getElementById("graficoGantt");
            const barra = document.createElement("div");

            barra.className = "barra-processo";
            barra.style.width = `${processo.tempoExecucao * 50}px`;
            barra.style.backgroundColor = gerarCorAleatoria();
            barra.textContent = processo.nome;

            graficoGantt.appendChild(barra);
        }

        function gerarCorAleatoria() {
            const letras = "0123456789ABCDEF";
            let cor = "#";
            for (let i = 0; i < 6; i++) {
                cor += letras[Math.floor(Math.random() * 16)];
            }
            return cor;
        }

        function processarFila() {
            if (filaDeProcessos.length === 0) return;

            const processo = filaDeProcessos.shift();
            processo.tempoInicio = tempoAtual;
            processo.tempoFim = tempoAtual + processo.tempoExecucao;

            atualizarGantt(processo);

            const intervalo = setInterval(() => {
                tempoAtual++;
                if (tempoAtual >= processo.tempoFim) {
                    clearInterval(intervalo);
                    setTimeout(processarFila, processo.tempoEspera * 1000);
                }
            }, 1000);
        }

        processarFila();
    }
});
