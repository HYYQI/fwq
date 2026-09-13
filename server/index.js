import config from "./config/config.json" with { type: "json" };
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function route(method, url, body) {
    switch (url.pathname) {
        case "/api/page/config":
            return config.pages;
        case "/api/server/list":
            return config.servers;
        case "/api/server/config":
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
        default:
            throw new Error(`Unknown API endpoint: ${url.pathname}`);
    }
}
