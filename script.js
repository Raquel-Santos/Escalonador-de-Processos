/* Arquivo: script.js */
document.addEventListener("DOMContentLoaded", () => {
    const pagina = document.body.id;
    if (pagina === "pagina-config") {
        configurarProcessos();
    } else if (pagina === "pagina-gantt") {
        executarEscalonador();
    }
});

function configurarProcessos() {
    const quantidade = parseInt(sessionStorage.getItem("quantidadeProcessos"), 10);
    const container = document.getElementById("processosContainer");

    for (let i = 0; i < quantidade; i++) {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>Processo ${i + 1}</h3>
            <label>Tempo de Chegada:</label>
            <input type="number" name="tempoChegada[]" required>
            <label>Tempo de Execução:</label>
            <input type="number" name="tempoExecucao[]" required>
            <label>Deadline:</label>
            <input type="number" name="deadline[]" required>
            <label>Quantum (se RR):</label>
            <input type="number" name="quantum[]" required>
        `;
        container.appendChild(div);
    }
    document.getElementById("formProcessos").addEventListener("submit", salvarProcessos);
}

function salvarProcessos(e) {
    e.preventDefault();
    sessionStorage.setItem("tempoChegada", JSON.stringify([...document.querySelectorAll('input[name="tempoChegada[]"]')].map(i => i.value)));
    sessionStorage.setItem("tempoExecucao", JSON.stringify([...document.querySelectorAll('input[name="tempoExecucao[]"]')].map(i => i.value)));
    sessionStorage.setItem("deadline", JSON.stringify([...document.querySelectorAll('input[name="deadline[]"]')].map(i => i.value)));
    sessionStorage.setItem("quantum", JSON.stringify([...document.querySelectorAll('input[name="quantum[]"]')].map(i => i.value)));
    sessionStorage.setItem("algoritmo", document.getElementById("algoritmo").value);
    window.location.href = "gantt.html";
}

function executarEscalonador() {
    const tempoChegada = JSON.parse(sessionStorage.getItem("tempoChegada"));
    const tempoExecucao = JSON.parse(sessionStorage.getItem("tempoExecucao"));
    const deadline = JSON.parse(sessionStorage.getItem("deadline"));
    const quantum = JSON.parse(sessionStorage.getItem("quantum"));
    const algoritmo = sessionStorage.getItem("algoritmo");

    let processos = tempoExecucao.map((tempoExecucao, i) => ({
        nome: `P${i + 1}`,
        tempoChegada: parseInt(tempoChegada[i], 10),
        tempoExecucao: parseInt(tempoExecucao, 10),
        deadline: parseInt(deadline[i], 10),
        quantum: parseInt(quantum[i], 10),
    }));

    processos.sort((a, b) => a.tempoChegada - b.tempoChegada);

    let tempoAtual = 0;
    processos.forEach(processo => {
        adicionarAoGantt(processo.nome, processo.tempoExecucao, tempoAtual);
        tempoAtual += processo.tempoExecucao + 1;
    });
}

function adicionarAoGantt(nome, duracao, inicio) {
    setTimeout(() => {
        const barra = document.createElement("div");
        barra.className = "barra-processo";
        barra.style.width = `${duracao * 50}px`;
        barra.textContent = nome;
        document.getElementById("graficoGantt").appendChild(barra);
    }, inicio * 1000);
}
