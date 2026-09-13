import { Page } from "../utils/Page.js";

export class Overview extends Page {
    constructor(father, data, config) {
        super(father, data, config);
        this.swap = data.hardwork.memory.swap ? true : false;
    }
    #cpuInfo() {
        const cpus = this.data.hardwork.cpu;
        let lines = "";
        let num="";
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
    #gpuInfo() {
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
    #memoryInfo() {
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
        if (self.swap) {
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
    #diskInfo() {
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
    #networkInfo() {
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
    updateUptime(status) {
        const uptime = (data) => {
            const starttime = data.starttime;
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
        return () => {
            status.textContent = this.data.status ? `在线 ${uptime(this.data)}` : "异常"
        }
    }
    updateData(datasTag) {
        const source = this.config.sources;

        return () => {
            datasTag.forEach()
        }
    }
    #setUpdateInterval(father){
        const status = father.querySelector(".status")
        const cpuUsage = father.querySelectorAll("#cpu-usage");
        const gpuUsage = father.querySelectorAll("#gpu-usage");
        const memoryUsed = father.querySelector("#memory-used");
        const memoryUsable = father.querySelector("#memory-usable");
        const memoryFree = father.querySelector("#memory-free");
        const swapUsed = father.querySelector("#swap-used");
        const swapUsable = father.querySelector("#swap-usable");
        const swapFree = father.querySelector("#swap-free");
        const networkUp = father.querySelector("#network-up");
        const networkDown = father.querySelector("#network-down");
        const datasTag = [cpuUsage, gpuUsage, memoryUsed, memoryUsable, memoryFree, swapUsed, swapUsable, swapFree, networkUp, networkDown];

        self.uptimeInterval = setInterval(self.updateUptime(status), this.config.uptimeUpdateTime);
        self.dataInterval = setInterval(self.updateData(datasTag), this.config.dataUpdateTime);
    }
    setup() {
        this.father.innerHTML = `
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
                    <p class="info">${
                        this.data.locale.LANG?
                            this.data.locale.LANGUAGE == this.data.locale.LANG?
                                this.data.locale.LANG:
                                this.data.locale.LANG + "|" + this.data.locale.LANGUAGE:
                            this.data.locale.LANGUAGE?
                                this.data.locale.LANGUAGE:
                                "未知"
                    }</p>
                </span>
                <span class="card">
                    <p class="title">主机名</p>
                    <p class="info">${this.data.hostname}</p>
                </span>
            </div>

            <p class="row">硬件信息</p>
            ${this.#cpuInfo(this.data)}
            ${this.#gpuInfo(this.data)}
            ${this.#memoryInfo(this.data)}
            ${this.#diskInfo(this.data)}
            ${this.#networkInfo(this.data)}
        `
        this.#setUpdateInterval(this.father)
    }

}