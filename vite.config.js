import { defineConfig } from "vite";
import { api } from "./server/index.js";

export default defineConfig({
    server: {
        configureServer(server) {
            server.middlewares.use("/api", (req, res) => {
                try {
                    const url = new URL(req.url)
                    let body = "";
                    if(req.method !== "GET" || req.method !== "DELETE") {
                        req.on("data", chunk => body += chunk);
                        req.on("end", body = JSON.parse(body));
                    }
                    const data = api.route(req.method, url, body);
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(data));
                } catch(e) {
                    res.statusCode = 400;
                    res.end(e.message);
                }
            })
        }
    }
});
