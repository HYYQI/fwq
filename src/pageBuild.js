

function fatherPageBuilder(father, server, uptimeUpdateTime) {
    // 更新在线时间
    setInterval(() => {
        father.querySelector(".status").textContent = server.status ? `在线 ${uptime(server)}` : "异常"
    }, uptimeUpdateTime)
}

function updateOPdata(father, sources, time) {
    const cpuUsage = father.querySelectorAll("#cpu-usage");
    const gpuUsage = father.querySelectorAll("#gpu-usage");
    const memoryUsed = father.querySelector("#memory-used");
    const memoryUsable = father.querySelector("#memory-usable");
    const memoryFree = father.querySelector("#memory-free");
    const networkUp = father.querySelector("#network-up");
    const networkDown = father.querySelector("#network-down");
    async function getData(sources) {
        if(sources === "random") {
            return {}
        }

    }
}

export { fatherPageBuilder, updateOPdata };
