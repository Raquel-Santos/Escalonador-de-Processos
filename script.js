document.addEventListener("DOMContentLoaded", () => {
    const pagina = document.body.id;

    if (pagina === "pagina-index") {
        document.getElementById("formQuantidade").addEventListener("submit", (e) => {
            const quantidade = document.getElementById("quantidadeProcessos").value;
            sessionStorage.setItem("quantidadeProcessos", quantidade);
        });
    }

    if (pagina === "pagina-config") {
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

        document.getElementById("voltar").addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    if (pagina === "pagina-gantt") {
        const execucao = JSON.parse(sessionStorage.getItem("execucao")) || [];
        const espera = JSON.parse(sessionStorage.getItem("espera")) || [];

        if (execucao.length === 0 || espera.length === 0) {
            alert("Dados dos processos não encontrados. Retornando à página inicial.");
            window.location.href = "index.html";
            return;
        }

        const filaDeProcessos = execucao.map((tempoExecucao, i) => ({
            nome: `P${i + 1}`,
            tempoExecucao: parseInt(tempoExecucao, 10),
            tempoEspera: parseInt(espera[i], 10),
            tempoInicio: null,
            tempoFim: null,
        }));

        let tempoAtual = 0;
        const graficoGantt = document.getElementById("graficoGantt");
        const escalaDeTempo = document.getElementById("escalaDeTempo");
        const tabela = document.querySelector("#detalhesProcessos tbody");

        filaDeProcessos.forEach((processo, i) => {
            processo.tempoInicio = tempoAtual;
            processo.tempoFim = tempoAtual + processo.tempoExecucao;
            processo.turnaround = processo.tempoExecucao + processo.tempoEspera;

            const barra = document.createElement("div");
            barra.className = "barra-processo";
            barra.style.width = `${processo.tempoExecucao * 50}px`;
            barra.style.backgroundColor = gerarCorAleatoria();
            barra.textContent = processo.nome;
            graficoGantt.appendChild(barra);

            const marcador = document.createElement("div");
            marcador.textContent = processo.tempoFim;
            marcador.style.flex = "1";
            escalaDeTempo.appendChild(marcador);

            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${processo.nome}</td>
                <td>${processo.tempoExecucao}</td>
                <td>${processo.tempoEspera}</td>
                <td>${processo.turnaround}</td>
            `;
            tabela.appendChild(linha);

            tempoAtual += processo.tempoExecucao;
        });

        let tempoDecorrido = 0;
        const intervalo = setInterval(() => {
            if (tempoDecorrido >= tempoAtual) {
                clearInterval(intervalo);
                return;
            }

            filaDeProcessos.forEach((processo, i) => {
                if (tempoDecorrido >= processo.tempoInicio && tempoDecorrido <= processo.tempoFim) {
                    const barra = graficoGantt.children[i];
                    barra.style.transform = `translateX(${(tempoDecorrido - processo.tempoInicio) * 50}px)`;
                }
            });

            tempoDecorrido += 1;
        }, 1000);

        document.getElementById("voltar").addEventListener("click", () => {
            window.location.href = "config.html";
        });
    }

    function gerarCorAleatoria() {
        const letras = "0123456789ABCDEF";
        let cor = "#";
        for
