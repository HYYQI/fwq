import "./style.css";
import * as echarts from "echarts";
import config from "./config.json";

const app = document.querySelector("#app");
let htmlBody = "";

async function getServerData(id) {
  // 未来从服务器拉数据

  // 从本地文件读取
  const file = await fetch(`./servers/${id}.json`);
  const data = await file.json();
  return data;
}

// 从配置文件获取服务器列表
const servers = [];
for (let i = 0; i < config.servers.length; i++) {
  servers[i]= await getServerData(config.servers[i]);
}

// 服务器选择侧边栏
const servers_list = servers.map((server) => ({id: server.id, name: server.name}));
const servers_list_html = servers_list.map((server) =>
  `<li class="server-item" server-id="${server.id}">${server.name}</li>`
).join("");
const leftTab = `
<div class="left-tab">
  ${servers_list_html}
</div>
`;




htmlBody += leftTab;
app.innerHTML = htmlBody;

// 侧栏逻辑
// 点击事件处理
document.querySelectorAll(".server-item").forEach(selections => {
  selections.addEventListener("click", (btn) => {
    const serverId = btn.target.getAttribute("server-id");
    const params = new URLSearchParams(window.location.search);
    const selectedServerId = params.get("id");
    if(selectedServerId == serverId) return;
    const url = new URL(window.location.href);
    url.searchParams.set("id", serverId);
    location.href = url.toString();
  });
})
// 设置选中样式
const params = new URLSearchParams(window.location.search);
const selectedServerId = params.get("id");
if(selectedServerId == null || selectedServerId == ""){
  const ServerNotSelected = true;
}else if(selectedServerId != undefined){
  try{
    const selectedServer = document.querySelector(`[server-id="${selectedServerId}"]`);
    selectedServer.classList.add("selected");
  }catch(e){
    const ServerNotFound = true;
  }
}
