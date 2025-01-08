const processQueue = [];
let physicalMemoryUsage = 0;
let virtualMemoryUsage = 0;
const physicalMemoryLimit = 512; // 512 MB
const virtualMemoryLimit = 1024; // 1024 MB

document.getElementById("processForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const processName = document.getElementById("processName").value;
    const memoryUsage = parseInt(document.getElementById("memoryUsage").value, 10);

    if (memoryUsage > 0) {
        processQueue.push({ name: processName, memory: memoryUsage });
        updateQueue();
        allocateMemory(memoryUsage);
    }

    document.getElementById("processForm").reset();
});

function updateQueue() {
    const queueElement = document.getElementById("processQueue");
    queueElement.innerHTML = "";

    processQueue.forEach((process, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${process.name} (${process.memory} MB)`;
        queueElement.appendChild(li);
    });
}

function allocateMemory(memoryUsage) {
    if (physicalMemoryUsage + memoryUsage <= physicalMemoryLimit) {
        physicalMemoryUsage += memoryUsage;
    } else if (virtualMemoryUsage + memoryUsage <= virtualMemoryLimit) {
        virtualMemoryUsage += memoryUsage;
    } else {
        alert("Memória insuficiente para adicionar este processo!");
        processQueue.pop(); // Remove o processo da fila
    }

    updateMemoryDisplay();
}

function updateMemoryDisplay() {
    document.getElementById("physicalMemory").textContent = `${physicalMemoryUsage} / ${physicalMemoryLimit} MB`;
    document.getElementById("virtualMemory").textContent = `${virtualMemoryUsage} / ${virtualMemoryLimit} MB`;
}
