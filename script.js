document.addEventListener("DOMContentLoaded", () => {
    const pagina = document.body.id;

    if (pagina === "pagina-index") {
        // Página inicial
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

        document.getElementById("voltar").addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    if (pagina === "pagina-gantt") {
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
        const graficoGantt = document.getElementById("graficoGantt");
        const tabela = document.querySelector("#detalhesProcessos tbody");

        filaDeProcessos.forEach((processo, i) => {
            processo.tempoInicio = tempoAtual;
            processo.tempoFim = tempoAtual + processo.tempoExecucao;
            processo.turnaround = processo.tempoExecucao + processo.tempoEspera;

            // Atualizar gráfico de Gantt
            const barra = document.createElement("div");
            barra.className = "barra-processo";
            barra.style.width = `${processo.tempoExecucao * 50}px`;
            barra.style.backgroundColor = gerarCorAleatoria();
            barra.textContent = processo.nome;
            graficoGantt.appendChild(barra);

            // Atualizar tabela
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

        document.getElementById("voltar").addEventListener("click", () => {
            window.location.href = "config.html";
        });
    }

    function gerarCorAleatoria() {
        const letras = "0123456789ABCDEF";
        let cor = "#";
        for (let i = 0; i < 6; i++) {
            cor += letras[Math.floor(Math.random() * 16)];
        }
        return cor;
    }
});

