import "./style/main.css";
import "./style/page.css";
import "./style/tab.css";
// import * as echarts from "echarts";
import * as page from "./pageBuild.js";

// 获取配置
function getConfig() {
    let config = fetch("/api/config");
    config = JSON.parse(config)
    return config;
}

// 获取服务器信息
function getServerConfig(id) {
    let data = fetch(`/api/server/config?id=${id}`);
    data = JSON.parse(data);
    return data
}

function getServerList(config){
    let list = {};
    for(let id = 0; id < config.servers.length; id++) {
        list[id.toString()] = getServerConfig(id)
    }
    return list
}

// 全局信息
const app = document.querySelector("#app");
const id = new URLSearchParams(window.location.search).get("id");
const config = getConfig();
const serverList = getServerList(config);
const serverData = serverList[id];
let NoServerSelected = false;
let ServerNotFound = false;
let htmlBody = "";

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
const serverName = serverList.map((server) => ({ id: server.id, name: server.name }));
const servers_list_html = serverName.map((server) =>
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
const OverviewPage = document.querySelector(".overview")
page.overviewPageBuilder(
    OverviewPage,
    await getServerData(id),
    config.pages.overview.uptimeUpdateTime
)
page.updateOPdata(
    OverviewPage,
    config.pages.overview.sources,
    config.pages.overview.updateTime
)

