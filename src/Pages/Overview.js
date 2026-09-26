import { Page } from "../utils/Page.js";

export class Overview extends Page {
    constructor(container, data, config) {
        super(container, data, config);
    }
    render() {
        this.swap = this.data.hardwork.memory.swap ? true : false;
        const cpuInfo = () => {
            const cpus = this.data.hardwork.cpu;
            let lines = "";
            let num = "";
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
        const gpuInfo = () => {
            const gpus = this.data.hardwork.gpu;
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
                            <p class="info">${gpus[gpu].memory}${gpus[gpu].count}</p>
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
        const memoryInfo = () => {
            const memory = this.data.hardwork.memory;
            let lines = `
                <div class="row">
                    <span class="card">
                        <p class="title">内存</p>
                        <p class="info">${memory.size}${memory.count}</p>
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
            if (this.swap) {
                lines += `
                    <div class="row">
                        <span class="card">
                        <p class="title">交换</p>
                        <p class="info">${memory.swap.size}${memory.swap.count}</p>
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
        const diskInfo = () => {
            const disks = this.data.hardwork.disk;
            let totalSize = 0;
            let lines = "";
            for (let disk = 0; disk < disks.length; disk++) {
                totalSize += disks[disk].size;
            }
            lines += `
                <div class="row">
                    <span class="card">
                        <p class="title">磁盘</p>
                        <p class="info">${totalSize}${disks[0].count}</p>
                    </span>
            `
            for (let disk = 0; disk < disks.length; disk++) {
                lines += `
                    <span class="card">
                        <p class="title">${disks[disk].name}</p>
                        <p class="info">${disks[disk].size}${disks[disk].count}</p>
                    </span>
                `
            }
            lines += "</div>"
            return lines;
        }
        const networkInfo = () => {
            const network = this.data.hardwork.network;
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
        return `
            <div class="row">
                <span class="card">
                    <div class="card-inner-left>
                        <div class="row">
                            <p class="title">${this.data.name}</p>
                            <p class="id">id: ${this.data.id}</p>
                        </div>
                        <div class="row">
                            <p class="system">${this.data.system}-${this.data.version}</p>
                        </div>
                    </div>
                    <!--单独在右边-->
                    <p class="status"></p>
                </span>
            </div>

            <div class="row">
                <span class="card">
                    <p class="title">架构</p>
                    <p class="info">${this.data.platform}</p>
                </span>
                <span class="card">
                    <p class="title">内核</p>
                    <p class="info">${this.data.kernel}</p>
                </span>
                <span class="card">
                    <p class="title">语言</p>
                    <p class="info">${this.data.locale.LANG ?
                this.data.locale.LANGUAGE == this.data.locale.LANG ?
                    this.data.locale.LANG :
                    this.data.locale.LANG + "|" + this.data.locale.LANGUAGE :
                this.data.locale.LANGUAGE ?
                    this.data.locale.LANGUAGE :
                    "未知"
            }</p>
                </span>
                <span class="card">
                    <p class="title">主机名</p>
                    <p class="info">${this.data.hostname}</p>
                </span>
            </div>

            <p class="row">硬件信息</p>
            ${cpuInfo(this.data)}
            ${gpuInfo(this.data)}
            ${memoryInfo(this.data)}
            ${diskInfo(this.data)}
            ${networkInfo(this.data)}
        `
    }
    hook() {
        this.status = this.container.querySelector(".status")
        this.cpuUsage = this.container.querySelectorAll("#cpu-usage");
        this.gpuUsage = this.container.querySelectorAll("#gpu-usage");
        this.memoryUsed = this.container.querySelector("#memory-used");
        this.memoryUsable = this.container.querySelector("#memory-usable");
        this.memoryFree = this.container.querySelector("#memory-free");
        this.swapUsed = this.container.querySelector("#swap-used");
        this.swapUsable = this.container.querySelector("#swap-usable");
        this.swapFree = this.container.querySelector("#swap-free");
        this.networkUp = this.container.querySelector("#network-up");
        this.networkDown = this.container.querySelector("#network-down");
    }
    async setupEvent() {
        const setStatus = async () => {
            const status = await fetch(`/api/server/status?id=${this.data.id}`)    // 返回 [status:boolean, data:number|错误信息:string]
                .then(response => response.json())
                .catch(error => {
                    console.error(`Error fetching server status:`, error);
                    return [false, "请求失败"];
                });
            if (!status[0]) {
                this.status.textContent = status[1];
            } else {
                const getUptime = (starttime) => {
                    const now = new Date().getTime();
                    const diff = (now - starttime) / 1000;
                    if (diff < 0) return "时间错误"
                    const day = Math.floor(diff / 86400);
                    const hour = Math.floor((diff % 86400) / 3600);
                    const minute = Math.floor((diff % 3600) / 60);
                    const second = Math.floor(diff % 60);
                    if (day < 0 && hour < 0 && minute < 0) return `${second}秒`;
                    if (day < 0 && hour < 0) return `${minute}分${second}秒`;
                    if (day < 0) return `${hour}小时${minute}分${second}秒`;
                    return `${day}天${hour}小时${minute}分${second}秒`;
                }
                this.status.textContent = `在线 ${getUptime(status[1])}`;
            }
        }
        const setData = async () => {
            const data = await fetch(`/api/server/data?id=${this.data.id}`)    // 返回 [status:boolean, data:number|错误信息:string]
                .then(response => response.json())
                .catch(error => {
                    console.error(`Error fetching server data:`, error);
                    return {};
                });
            console.log(data);
            this.cpuUsage.forEach((cpu,index)=>cpu.textContent = data["cpu-usage"][index] + this.data.hardwork.cpu[index]["usage-count"]);
            this.gpuUsage.forEach((gpu,index)=>gpu.textContent = data["gpu-usage"][index] + this.data.hardwork.gpu[index]["usage-count"]);
            this.memoryUsed.textContent = data["memory-used"] + this.data.hardwork.memory["count"];
            this.memoryUsable.textContent = data["memory-usable"] + this.data.hardwork.memory["count"];
            this.memoryFree.textContent = data["memory-free"] + this.data.hardwork.memory["usage-count"];
            if (this.swap) {
                this.swapUsed.textContent = data["swap-used"] + this.data.hardwork.memory.swap["count"];
                this.swapUsable.textContent = data["swap-usable"] + this.data.hardwork.memory.swap["count"];
                this.swapFree.textContent = data["swap-free"] + this.data.hardwork.memory.swap["usage-count"];
            }
            this.networkUp.textContent = data["network-up"] + this.data.hardwork.network["count"];
            this.networkDown.textContent = data["network-down"] + this.data.hardwork.network["count"];

        }
        this.statusInterval = setInterval(async () => { await setStatus() }, this.config.statusUpdateTime);
        this.dataInterval = setInterval(async () => { await setData() }, this.config.dataUpdateTime);

    }
}