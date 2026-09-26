import "./style/main.css";
import "./style/page.css";
import "./style/tab.css";
import { Overview } from "./Pages/Overview.js";
// import * as echarts from "echarts";
// import * as page from "./pageBuild.js";

async function getData(type, id="") {
    const url = {
        "pageConfig": "/api/page/config",   // 返回config.json/pages
        "serverList": "/api/server/list",   // 返回config.json/servers
        "serverData": `/api/server/config?id=${id}` // 返回config.json/servers/{id}/usr指向的json
    }
    let data = await fetch(url[type])
        .then(response => response.json())
        .catch(error => {
            console.error(`Error fetching ${type}:`, error);
            return null;
        });
    return data;
}

// 全局信息
const app = document.querySelector("#app");
const id = new URLSearchParams(window.location.search).get("id");
const pageConfig = await getData("pageConfig");
const serverList = await getData("serverList");
const serverData = await getData("serverData", id?id:"0");
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
            const serverId = btn.currentTarget.getAttribute("server-id");
            if (id == serverId) return;
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
            packupBtn.querySelector(".pack-up-btn-icon").classList.remove("pack-up")
            packupBtn.querySelector(".pack-up-btn-text").classList.remove("pack-up")
            packupBtn.querySelector(".pack-up-btn-icon").textContent = "<"
            packupBtn.querySelector(".pack-up-btn-text").textContent = "收起"
            leftTab.querySelectorAll(".server-item").forEach(item => {
                item.classList.remove("pack-up")
            })
        } else {
            // 收起
            leftTab.classList.add("pack-up")
            packupBtn.querySelector(".pack-up-btn-icon").classList.add("pack-up")
            packupBtn.querySelector(".pack-up-btn-text").classList.add("pack-up")
            packupBtn.querySelector(".pack-up-btn-icon").textContent = ">"
            packupBtn.querySelector(".pack-up-btn-text").textContent = "展开"
            leftTab.querySelectorAll(".server-item").forEach(item => {
                item.classList.add("pack-up")
            })
        }
        isPackup = !isPackup;
    })
}
// 顶栏事件处理
function topBarListener(page) { //待处理：重构前残留，页面激活失活
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
const servers_list_html = Object.entries(serverList).map(([id, data]) => {
    return `<li class="server-item" server-id="${id}">
        <span class="server-item-icon"><img src="${data.icon}" alt="${data.name}"></span>
        <span class="server-item-text">${data.name}</span>
    </li>`
}).join("\n");
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
const monitors = pageConfig.map((page, key) => {
    return `<div id="${page.id}" page-id="${key}" class="${page.id} page ${page.config.active ? 'show' : ''}"></div>`
}).join("\n");
const selectors = pageConfig.map((page) => {
    return `<div id="${page.id}" class="monitor-item ${page.config.active ? 'active' : ''}">${page.name}</div>`
}).join("\n");
const severMonitorPage = `
<div class="server-monitor page">
    <div class="monitor-top-bar">
        ${selectors}
    </div>
    ${monitors}
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
if (!(NoServerSelected || ServerNotFound)) {
    // 构建页面
    const OverviewPage = document.querySelector(".overview");
    const overview = new Overview(OverviewPage, serverData, pageConfig[OverviewPage.getAttribute("page-id")].config);
    overview.mount();
}
// const OverviewPage = document.querySelector(".overview")
// page.overviewPageBuilder(
//     OverviewPage,
//     await getServerData(id),
//     config.pages.overview.uptimeUpdateTime
// )
// page.updateOPdata(
//     OverviewPage,
//     config.pages.overview.sources,
//     config.pages.overview.updateTime
// )

