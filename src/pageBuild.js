// 页面构建
function uptime(server) {
    const starttime = server.starttime;
    const now = new Date().getTime();
    const diff = (now - starttime) / 1000;
    if (diff < 0) return "时间错误"
    const day = Math.floor(diff / 86400);
    const hour = Math.floor((diff % 86400) / 3600);
    const minute = Math.floor((diff % 3600) / 60);
    const second = Math.floor(diff % 60);
    if(day < 0 && hour < 0 && minute < 0) return `${second} 秒`;
    if(day < 0 && hour < 0) return `${minute} 分 ${second} 秒`;
    if(day < 0) return `${hour} 小时 ${minute} 分 ${second} 秒`;
    return `${day} 天 ${hour} 小时 ${minute} 分 ${second} 秒`;
}
function cpuInfo(server) {
    const cpus = server.hardwork.cpu;
    let lines = "";
    let num=""
    for (let cpu = 0; cpu < cpus.length; cpu++) {
        if (cpus.length == 1) {
            num = "";
        } else {
            num = cpu;
        }
        lines += `
        <div class="row">
            <span class="card">
                <p class="title">cpu${num}</p>
                <p class="info">${cpus[cpu].name}</p>
            </span>
            <span class="card">
                <p class="title">频率</p>
                <p class="info">${cpus[cpu].frequency}</p>
            </span>
            <span class="card">
                <p class="title">核心</p>
                <p class="info">${cpus[cpu].cores}</p>
            </span>
            <span class="card">
                <p class="title">使用率</p>
                <p class="info" id="cpu-usage">0%</p>
            </span>
        </div>
        `
    }
    return lines;
}
function gpuInfo(server) {
    const gpus = server.hardwork.gpu;
    let lines = "";
    let num = "";
    for (let gpu = 0; gpu < gpus.length; gpu++) {
        if (gpus.length == 1) {
            num = "";
        } else {
            num = gpu;
        }
        lines += `
        <div class="row">
            <span class="card">
                <p class="title">gpu${num}</p>
                <p class="info">${gpus[gpu].name}</p>
            </span>
            <span class="card">
                <p class="title">显存</p>
                <p class="info">${gpus[gpu].memory}</p>
            </span>
            <span class="card">
                <p class="title">使用率</p>
                <p class="info" id="gpu-usage">0%</p>
            </span>
        </div>
        `
    }
    return lines;
}
let haveSwap = false
function memoryInfo(server) {
    const memory = server.hardwork.memory;
    let lines = `
    <div class="row">
        <span class="card">
            <p class="title">内存</p>
            <p class="info">${memory.size}</p>
        </span>
        <span class="card">
            <p class="title">已用</p>
            <p class="info" id="memory-used"></p>
        </span>
        <span class="card">
            <p class="title">可用</p>
            <p class="info" id="memory-usable"></p>
        </span>
        <span class="card">
            <p class="title">空闲</p>
            <p class="info" id="memory-free">0%</p>
        </span>
    </div>
    `
    if (memory.swap) {
        haveSwap = true
        lines += `
        <div class="row">
            <span class="card">
               <p class="title">交换</p>
               <p class="info">${memory.swap.size}</p>
            </span>
            <span class="card">
               <p class="title">已用</p>
                <p class="info" id="swap-used"></p>
            </span>
            <span class="card">
                <p class="title">可用</p>
                <p class="info" id="swap-usable"></p>
            </span>
            <span class="card">
                <p class="title">空闲</p>
                <p class="info" id="swap-free">0%</p>
            </span>
        </div>
        `
    }
    return lines;
}
function diskInfo(server) {
    const disks = server.hardwork.disk;
    let totalSizeG = 0;
    let lines = "";
    for (let disk = 0; disk < disks.length; disk++) {
        totalSizeG += disks[disk].sizeG;
    }
    lines += `
    <div class="row">
        <span class="card">
            <p class="title">磁盘</p>
            <p class="info">${totalSizeG}GB</p>
        </span>
    `
    for (let disk = 0; disk < disks; disk++) {
        lines += `
        <span class="card">
            <p class="title">${disks[disk].name}</p>
            <p class="info">${disks[disk].size}</p>
        </span>
      `
    }
    lines += `
    </div>
    `;
    return lines;
}
function networkInfo(server) {
    const network = server.hardwork.network;
    return `
    <div class="row">
        <span class="card">
            <p class="title">网络</p>
            <p class="info">${network.name}</p>
        </span>
        <span class="card">
            <p class="title">IP</p>
            <p class="info">${network.ip}</p>
        </span>
        <span class="card">
            <p class="title">上行</p>
            <p class="info" id="network-up"></p>
        </span>
        <span class="card">
            <p class="title">下行</p>
            <p class="info" id="network-down"></p>
        </span>
    </div>
    `
}

function overviewPageBuilder(overview, server, uptimeUpdateTime) {
    let overviewPage = `
    <div class="row">
        <span class="card">
            <div class="card-inner-left>
                <div class="row">
                    <p class="title>${server.name}</p>
                    <p class="id">id: ${server.id}</p>
                </div>
                <div class="row">
                    <p class="system">${server.system}-${server.version}</p>
                </div>
            </div>
            <!--单独在右边-->
            <p class="status"></p>
        </span>
    </div>

    <div class="row">
        <span class="card">
            <p class="title">架构</p>
            <p class="info">${server.platform}</p>
        </span>
        <span class="card">
            <p class="title">内核</p>
            <p class="info">${server.kernel}</p>
        </span>
        <span class="card">
            <p class="title">语言</p>
            <p class="info">${server.locale.LANGUAGE}</p>
        </span>
        <span class="card">
            <p class="title">主机名</p>
            <p class="info">${server.hostname}</p>
        </span>
    </div>

    <p class="row">硬件信息</p>
    ${cpuInfo(server)}
    ${gpuInfo(server)}
    ${memoryInfo(server)}
    ${diskInfo(server)}
    ${networkInfo(server)}
    `
    overview.innerHTML = overviewPage;
    // 更新在线时间
    setInterval(() => {
        overview.querySelector(".status").textContent = server.status ? `在线 ${uptime(server)}` : "异常"
    }, uptimeUpdateTime)
}

function updateOPdata(overview, sources, time) {
    const cpuUsage = overview.querySelectorAll("#cpu-usage");   // for 遍历
    const gpuUsage = overview.querySelectorAll("#gpu-usage");
    const memoryUsed = overview.querySelector("#memory-used");
    const memoryUsable = overview.querySelector("#memory-usable");
    const memoryFree = overview.querySelector("#memory-free");
    const networkUp = overview.querySelector("#network-up");
    const networkDown = overview.querySelector("#network-down");
    async function getData(sources) {
        if(sources === "random") {
            return {}
        }

    }
}

export { overviewPageBuilder, updateOPdata };
