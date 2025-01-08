const filaDeProcessos = [];
let usoMemoriaFisica = 0;
let usoMemoriaVirtual = 0;
const limiteMemoriaFisica = 512; // 512 MB
const limiteMemoriaVirtual = 1024; // 1024 MB
const intervaloExecucao = 100; // Atualização em milissegundos

// Evento para adicionar um novo processo
document.getElementById("formularioProcesso").addEventListener("submit", (e) => {
    e.preventDefault();

    const nomeProcesso = document.getElementById("nomeProcesso").value;
    const memoriaUso = parseInt(document.getElementById("usoMemoria").value, 10);

    if (memoriaUso > 0) {
        filaDeProcessos.push({
            nome: nomeProcesso,
            memoria: memoriaUso,
            tempoExecucao: 0,
            tempoEspera: 0,
            progresso: 0
        });
        atualizarFila();
        alocarMemoria(memoriaUso);
        atualizarExecucao();
    }

    document.getElementById("formularioProcesso").reset();
});

// Atualiza a lista de processos na fila
function atualizarFila() {
    const elementoFila = document.getElementById("filaProcessos");
    elementoFila.innerHTML = "";

    filaDeProcessos.forEach((processo, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${processo.nome} (${processo.memoria} MB)`;
        elementoFila.appendChild(li);
    });
}

// Aloca memória física ou virtual para o processo
function alocarMemoria(memoriaUso) {
    if (usoMemoriaFisica + memoriaUso <= limiteMemoriaFisica) {
        usoMemoriaFisica += memoriaUso;
    } else if (usoMemoriaVirtual + memoriaUso <= limiteMemoriaVirtual) {
        usoMemoriaVirtual += memoriaUso;
    } else {
        alert("Memória insuficiente para adicionar este processo!");
        filaDeProcessos.pop(); // Remove o processo da fila
    }

    atualizarMemoria();
}

// Atualiza os valores exibidos de memória
function atualizarMemoria() {
    document.getElementById("memoriaFisica").textContent = `${usoMemoriaFisica} / ${limiteMemoriaFisica} MB`;
    document.getElementById("memoriaVirtual").textContent = `${usoMemoriaVirtual} / ${limiteMemoriaVirtual} MB`;
}

// Atualiza a execução dos processos
function atualizarExecucao() {
    const areaExecucao = document.getElementById("areaExecucao");
    areaExecucao.innerHTML = "";

    filaDeProcessos.forEach((processo, index) => {
        processo.tempoEspera += intervaloExecucao / 1000; // Incrementa o tempo de espera

        if (index === 0) { // Somente o primeiro processo está sendo executado
            processo.tempoExecucao += intervaloExecucao / 1000;
            processo.progresso = Math.min(100, processo.tempoExecucao * 10); // Incrementa 10% por segundo
            if (processo.progresso >= 100) {
                filaDeProcessos.shift(); // Remove o processo quando concluído
            }
        }

        // Cria o elemento visual para exibir a barra de progresso e informações
        const elementoProcesso = document.createElement("div");
        elementoProcesso.className = "processo";

        const contenedorBarraProgresso = document.createElement("div");
        contenedorBarraProgresso.className = "barra-progresso-contenedor";

        const barraProgresso = document.createElement("div");
        barraProgresso.className = "barra-progresso";
        barraProgresso.style.width = `${processo.progresso}%`;

        const informacoesProcesso = document.createElement("div");
        informacoesProcesso.className = "informacoes-processo";
        informacoesProcesso.textContent = `Processo: ${processo.nome} | Execução: ${processo.tempoExecucao.toFixed(1)}s | Espera: ${processo.tempoEspera.toFixed(1)}s`;

        contenedorBarraProgresso.appendChild(barraProgresso);
        elementoProcesso.appendChild(contenedorBarraProgresso);
        elementoProcesso.appendChild(informacoesProcesso);
        areaExecucao.appendChild(elementoProcesso);
    });

    // Continua a execução enquanto houver processos na fila
    if (filaDeProcessos.length > 0) {
        setTimeout(atualizarExecucao, intervaloExecucao);
    }
}
