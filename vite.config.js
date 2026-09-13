import { defineConfig } from "vite";
import { route } from "./server/index.js";

export default defineConfig({
    plugins: [
        {
            name: "api",
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    if (!req.url.startsWith("/api")) return next()
                    try {
                        const url = new URL(req.url, "http://localhost");
                        let body = "";
                        if (req.method !== "GET" && req.method !== "DELETE") {
                            req.on("data", chunk => body += chunk);
                            req.on("end", () => {
                                body = JSON.parse(body);
                            });
                        }
                        const data = route(req.method, url, body);
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify(data));
                    } catch (e) {
                        res.statusCode = 400;
                        res.end(e.message);
                    }
                })
            }
        }
    ]
});
