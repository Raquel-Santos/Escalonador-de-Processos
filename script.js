let filaDeProcessos = [];
let tempoAtual = 0;

// Evento de configuração da simulação
document.getElementById("menuConfiguracao").addEventListener("submit", (e) => {
    e.preventDefault();

    const quantidadeProcessos = parseInt(document.getElementById("quantidadeProcessos").value, 10);
    const tempoExecucao = parseInt(document.getElementById("tempoExecucao").value, 10);
    const tempoEspera = parseInt(document.getElementById("tempoEspera").value, 10);

    iniciarSimulacao(quantidadeProcessos, tempoExecucao, tempoEspera);
});

// Inicia a simulação com os parâmetros configurados
function iniciarSimulacao(quantidadeProcessos, tempoExecucao, tempoEspera) {
    filaDeProcessos = [];
    tempoAtual = 0;
    document.getElementById("filaProcessos").innerHTML = "";
    document.getElementById("graficoGantt").innerHTML = "";

    for (let i = 0; i < quantidadeProcessos; i++) {
        filaDeProcessos.push({
            nome: `P${i + 1}`,
            tempoExecucao: tempoExecucao,
            tempoInicio: null,
            tempoFim: null,
        });
    }

    processarFila(tempoEspera);
}

// Processa a fila de processos
function processarFila(tempoEspera) {
    if (filaDeProcessos.length === 0) return;

    const processo = filaDeProcessos.shift();
    processo.tempoInicio = tempoAtual;
    processo.tempoFim = tempoAtual + processo.tempoExecucao;

    atualizarGantt(processo);

    const intervalo = setInterval(() => {
        tempoAtual++;

        if (tempoAtual >= processo.tempoFim) {
            clearInterval(intervalo);
            setTimeout(() => processarFila(tempoEspera * 1000), tempoEspera * 1000);
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
