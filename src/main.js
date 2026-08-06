import "./style/main.css";
import "./style/page.css";
import "./style/tab.css";
import * as echarts from "echarts";
import { overviewPageBuilder } from "./pageBuild"
import config from "./config.json";

// app
const app = document.querySelector("#app");
let htmlBody = "";

// 全局状态
let NoServerSelected = false;
let ServerNotFound = false;
const id = new URLSearchParams(window.location.search).get("id");

// 获取服务器信息
async function getServerData(id) {
    // 未来从服务器拉数据

    // 从本地文件读取
    const file = await fetch(`./servers/${id}.json`);
    const data = await file.json();
    return data;
}

// 获取服务器列表
async function getServerList() {
    const servers = [];
    for (let i = 0; i < config.servers.length; i++) {
        servers[i] = await getServerData(config.servers[i]);
    }
    return servers
}

// 异常事件处理
function handleError(page) {
    const SeverMonitorPage = page.querySelector(".server-monitor");
    if (NoServerSelected) {
        const NoServerSelectedPage = page.querySelector(".no-server-selected");
        NoServerSelectedPage.classList.remove("hidden");
        SeverMonitorPage.classList.add("hidden");
    } else if (ServerNotFound) {
        const ServerNotFoundPage = page.querySelector(".server-not-found");
        ServerNotFoundPage.classList.remove("hidden");
        SeverMonitorPage.classList.add("hidden");
    }
}
// 侧栏事件处理
function leftBarListener(page, selectedServerId) {
    // 点击事件处理
    page.querySelectorAll(".server-item").forEach(selections => {
        selections.addEventListener("click", (btn) => {
            const serverId = btn.target.getAttribute("server-id");
            const params = new URLSearchParams(window.location.search);
            const selectedServerId = params.get("id");
            if (selectedServerId == serverId) return;
            const url = new URL(window.location.href);
            url.searchParams.set("id", serverId);
            location.href = url.toString();
        });
    })
    // 设置选中样式
    if (selectedServerId == null || selectedServerId == "") {
        NoServerSelected = true;
    } else if (selectedServerId != undefined) {
        try {
            const selectedServer = page.querySelector(`[server-id="${selectedServerId}"]`);
            selectedServer.classList.add("selected");
        } catch (e) {
            ServerNotFound = true;
        }
    }
    // 侧栏收起逻辑
    const packupBtn = page.querySelector(".pack-up-btn");
    const leftTab = page.querySelector(".left-tab");
    let isPackup = false;
    packupBtn.addEventListener("click", () => {
        if(isPackup) {
            // 展开
            leftTab.classList.remove("pack-up")
            packupBtn.querySelector(".pack-up-icon").classList.remove("pack-up")
            packupBtn.querySelector(".pack-up-text").classList.remove("pack-up")
            leftTab.querySelectorAll(".server-item").forEach(item => {
                item.classList.remove("pack-up")
            })
        } else {
            // 收起
            leftTab.classList.add("pack-up")
            packupBtn.querySelector(".pack-up-icon").classList.add("pack-up")
            packupBtn.querySelector(".pack-up-text").classList.add("pack-up")
            leftTab.querySelectorAll(".server-item").forEach(item => {
                item.classList.add("pack-up")
            })
        }
    })
}
// 顶栏事件处理
function topBarListener(page) {
    let showingPage = "overview";
    const OverviewPage = page.querySelector(".overview");
    const PerformancePage = page.querySelector(".performance");
    const idMap = {
        "overview": OverviewPage,
        "performance": PerformancePage
    };
    page.querySelectorAll(".monitor-item").forEach(item => {
        item.addEventListener("click", (e) => {
            const selected = e.target.id;
            if (showingPage == selected) return;
            page.querySelector(`#${showingPage}`).classList.remove("active")
            e.target.classList.add("active");
            switch (selected) {
                case "overview":
                    OverviewPage.classList.add("show");
                    idMap[showingPage].classList.remove("show");
                    showingPage = selected;
                    break;
                case "performance":
                    PerformancePage.classList.add("show");
                    idMap[showingPage].classList.remove("show");
                    showingPage = selected;
                    break;
            }
        });
    });
}

// 构造html框架
// 服务器选择侧边栏
const servers_list = (await getServerList()).map((server) => ({ id: server.id, name: server.name }));
const servers_list_html = servers_list.map((server) =>
    `<li class="server-item" server-id="${server.id}">
        <span class="server-item-icon"><img src="${config.icons[server.id]}"</span>
        <span class="server-item-text">${server.name}</span>
    </li>`
).join("");
const leftTab = `
<div class="left-tab">
    ${servers_list_html}
    <div class="pack-up-btn">
        <span class="pack-up-btn-icon">\<</span>
        <span class="pack-up-btn-text">收起</span>
    </div>
</div>
`

// 异常显示
const noServerSelectedPage = `
<div class="no-server-selected page hidden">
    <div class="no-server-selected-text">请选择服务器</div>
</div>
`
const serverNotFoundPage = `
<div class="server-not-found page hidden">
    <div class="server-not-found-text">服务器不存在</div>
</div>
`

// 主页面
const overviewPage = `<div class="overview page show"></div>`;
const performancePage = `<div class="performance page"></div>`;
const severMonitorPage = `
<div class="server-monitor page">
    <div class="monitor-top-bar">
        <span class="monitor-item active" id="overview">概览</span>
        <span class="monitor-item" id="performance">性能</span>
    </div>
    ${overviewPage}
    ${performancePage}
</div>
`



// 拼接html
htmlBody += leftTab;
htmlBody += noServerSelectedPage;
htmlBody += serverNotFoundPage;
htmlBody += severMonitorPage;
app.innerHTML = htmlBody;

// 创建监听
leftBarListener(document, id);
handleError(document);
topBarListener(document);
// 构建页面
overviewPageBuilder(
    document.querySelector(".overview"),
    await getServerData(id)
)

