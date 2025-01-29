document.addEventListener("DOMContentLoaded", () => {
    const pagina = document.body.id;

    if (pagina === "pagina-index") {
        document.getElementById("formQuantidade").addEventListener("submit", (e) => {
            e.preventDefault();
            sessionStorage.setItem("quantidadeProcessos", document.getElementById("quantidadeProcessos").value);
            window.location.href = "config.html";
        });
    }

    if (pagina === "pagina-config") {
        const quantidade = parseInt(sessionStorage.getItem("quantidadeProcessos"), 10);
        const container = document.getElementById("processosContainer");

        for (let i = 0; i < quantidade; i++) {
            const div = document.createElement("div");
            div.innerHTML = `
                <h3>Processo ${i + 1}</h3>
                <label>Tempo de Execução:</label>
                <input type="number" name="tempoExecucao[]" required>
                <label>Deadline:</label>
                <input type="number" name="deadline[]" required>
                <label>Tempo de Espera:</label>
                <input type="number" name="tempoEspera[]" required>
            `;
            container.appendChild(div);
        }

        document.getElementById("formProcessos").addEventListener("submit", (e) => {
            e.preventDefault();
            sessionStorage.setItem("execucao", JSON.stringify([...document.querySelectorAll('input[name="tempoExecucao[]"]')].map(i => i.value)));
            sessionStorage.setItem("deadline", JSON.stringify([...document.querySelectorAll('input[name="deadline[]"]')].map(i => i.value)));
            sessionStorage.setItem("espera", JSON.stringify([...document.querySelectorAll('input[name="tempoEspera[]"]')].map(i => i.value)));
            sessionStorage.setItem("algoritmo", document.getElementById("algoritmo").value);
            window.location.href = "gantt.html";
        });

        document.getElementById("voltar").addEventListener("click", () => window.location.href = "index.html");
    }

    if (pagina === "pagina-gantt") {
        const execucao = JSON.parse(sessionStorage.getItem("execucao"));
        const deadline = JSON.parse(sessionStorage.getItem("deadline"));
        const espera = JSON.parse(sessionStorage.getItem("espera"));
        const algoritmo = sessionStorage.getItem("algoritmo");

        let processos = execucao.map((tempoExecucao, i) => ({
            nome: `P${i + 1}`,
            tempoExecucao: parseInt(tempoExecucao, 10),
            deadline: parseInt(deadline[i], 10),
            tempoEspera: parseInt(espera[i], 10),
        }));

        if (algoritmo === "EDF") {
            processos.sort((a, b) => a.deadline - b.deadline);
        }

        let tempoAtual = 0;
        const gantt = document.getElementById("graficoGantt");
        processos.forEach(processo => {
            const barra = document.createElement("div");
            barra.className = "barra-processo";
            barra.style.width = `${processo.tempoExecucao * 50}px`;
            barra.textContent = processo.nome;
            gantt.appendChild(barra);
            tempoAtual += processo.tempoExecucao;
        });

        document.getElementById("voltar").addEventListener("click", () => window.location.href = "config.html");
    }
});
