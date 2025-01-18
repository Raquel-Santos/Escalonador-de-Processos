const filaDeProcessos = [];
let tempoAtual = 0;

// Adiciona um novo processo
document.getElementById("formularioProcesso").addEventListener("submit", (e) => {
    e.preventDefault();

    const nomeProcesso = document.getElementById("nomeProcesso").value;
    const tempoExecucao = parseInt(document.getElementById("tempoExecucao").value, 10);

    const processo = {
        nome: nomeProcesso,
        tempoExecucao: tempoExecucao,
        tempoInicio: null,
        tempoFim: null,
    };

    filaDeProcessos.push(processo);
    atualizarFila();
    processarFila();

    document.getElementById("formularioProcesso").reset();
});

// Atualiza a lista de processos na fila
function atualizarFila() {
    const elementoFila = document.getElementById("filaProcessos");
    elementoFila.innerHTML = "";

    filaDeProcessos.forEach((processo, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${processo.nome} - ${processo.tempoExecucao}s`;
        elementoFila.appendChild(li);
    });
}

// Processa a fila de processos
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
            processarFila();
        }
    }, 1000);
}

// Atualiza o gráfico de Gantt
function atualizarGantt(processo) {
    const graficoGantt = document.getElementById("graficoGantt");
    const barra = document.createElement("div");

    barra.className = "barra-processo";
    barra.style.width = `${processo.tempoExecucao * 50}px`; // Largura proporcional ao tempo
    barra.style.backgroundColor = gerarCorAleatoria();
    barra.textContent = processo.nome;

    graficoGantt.appendChild(barra);
}

// Gera uma cor aleatória para cada processo
function gerarCorAleatoria() {
    const letras = "0123456789ABCDEF";
    let cor = "#";
    for (let i = 0; i < 6; i++) {
        cor += letras[Math.floor(Math.random() * 16)];
    }
    return cor;
}
