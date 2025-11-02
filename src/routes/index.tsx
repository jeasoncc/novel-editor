import logger from "@/log";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

logger.start("启动构建中…")
logger.ready("前端构建完成")
logger.success("所有资源加载成功")
logger.warn("警告：配置文件缺少字段")
logger.error("请求失败：连接超时")
logger.debug("渲染器初始化")
logger.verbose("细节日志")
logger.fatal("无法启动服务")

logger.info({ abx: "212" })
function RouteComponent() {
  return <div>Hello "/"!</div>;
}

