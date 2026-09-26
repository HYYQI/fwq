import config from "./config/config.json" with { type: "json" };
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function route(method, url, body) {
    console.log(`[Server:route] Received ${method} request for ${url.pathname}`);
    const route = {
        "/api/page/config": () => config.pages,
        "/api/server/list": () => config.servers,
        "/api/server/config": () => {
            const id = url.searchParams.get("id");
            if (id == "0") {
                return {};
            }
            if (!(id in config.servers)) {
                throw new Error(`Server with id ${id} not found`);
            }
            const serverUrl = config.servers[id].url;
            if (serverUrl.startsWith("http")) {
                const serverData = fetch(serverUrl);
                return serverData.json();
            } else {
                const serverData = readFileSync(resolve(serverUrl), "utf-8");
                return JSON.parse(serverData);
            }
        },
        "/api/server/status": () => {
            const id = url.searchParams.get("id");
            if (id in config.servers) {
                const source = config.servers[id].source;
                if (source == "random") {
                    const status = Math.random() < 0.5;
                    const data = status ? Math.floor(Math.random() * 100000) : "服务器离线";
                    return [status, data];
                } else {
                    return [false, "暂不支持"];
                }
            }
            else return [false, "服务器不存在"];
        },
        "/api/server/data": () => {
            const id = url.searchParams.get("id");
            if (id in config.servers) {
                const source = config.servers[id].source;
                if (source == "random") {
                    return {
                        "cpu-usage":[ Math.floor(Math.random() * 100)],
                        "gpu-usage": [Math.floor(Math.random() * 100)],
                        "memory-used": Math.floor(Math.random() * 100),
                        "memory-usable": Math.floor(Math.random() * 100),
                        "memory-free": Math.floor(Math.random() * 100),
                        "swap-used": Math.floor(Math.random() * 100),   // 关于swap判断: 数据从服务器拉，所以由服务器判断
                        "swap-usable": Math.floor(Math.random() * 100),
                        "swap-free": Math.floor(Math.random() * 100),
                        "network-up": Math.floor(Math.random() * 100),
                        "network-down": Math.floor(Math.random() * 100)
                    };
                } else {
                    return {};
                }
            }
            else return {};
        }
    }
    const handler = route[url.pathname];
    if (handler) {
        return handler();
    } else {
        throw new Error(`Unknown API endpoint: ${url.pathname}`);
    }
}
