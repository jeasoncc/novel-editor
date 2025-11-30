import { Download, FileText, Search, Save, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">Novel Editor</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="hover:text-blue-600 transition">功能</Link>
            <Link href="#download" className="hover:text-blue-600 transition">下载</Link>
            <Link href="#docs" className="hover:text-blue-600 transition">文档</Link>
            <a 
              href="https://github.com/yourusername/novel-editor" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          专业的长篇小说写作工具
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Novel Editor 是一款现代化的跨平台写作环境，专为长篇小说创作而设计。
          沉浸式编辑体验，强大的项目管理，让创作更加专注和高效。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#download"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            立即下载
          </a>
          <a 
            href="https://github.com/yourusername/novel-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 transition font-semibold"
          >
            查看源码
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">核心功能</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-blue-600" />}
            title="沉浸式写作"
            description="基于 Lexical 的富文本编辑器，支持格式化、快捷键和专注模式，让你专注于创作。"
          />
          <FeatureCard
            icon={<Search className="w-8 h-8 text-green-600" />}
            title="全局搜索"
            description="快速全文搜索场景、角色和世界观设定，支持关键词高亮和智能排序。"
          />
          <FeatureCard
            icon={<Save className="w-8 h-8 text-purple-600" />}
            title="自动备份"
            description="每日自动备份，支持手动导出和恢复，JSON 或 ZIP 格式，数据永不丢失。"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-yellow-600" />}
            title="项目管理"
            description="树形项目导航，支持书籍→章节→场景的层级结构，角色、地点和设定数据库。"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-red-600" />}
            title="离线优先"
            description="基于 IndexedDB + Dexie 的可靠存储，完全离线工作，可选云同步。"
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-indigo-600" />}
            title="多格式导出"
            description="支持导出为 Markdown、DOCX、PDF、EPUB 等格式，方便分享和发布。"
          />
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="container mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl">
        <h2 className="text-4xl font-bold text-center mb-12">下载 Novel Editor</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <DownloadCard
            platform="Linux"
            formats={["AppImage", "DEB", "RPM"]}
            version="v0.1.0"
          />
          <DownloadCard
            platform="Windows"
            formats={["MSI", "EXE"]}
            version="v0.1.0"
          />
          <DownloadCard
            platform="macOS"
            formats={["DMG"]}
            version="v0.1.0"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Novel Editor. Released under the MIT License.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="https://github.com/yourusername/novel-editor" className="hover:text-blue-600 transition">
              GitHub
            </a>
            <a href="#docs" className="hover:text-blue-600 transition">
              文档
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              问题反馈
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function DownloadCard({ platform, formats, version }: { platform: string; formats: string[]; version: string }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-center">
      <h3 className="text-2xl font-bold mb-2">{platform}</h3>
      <p className="text-sm text-gray-500 mb-4">{version}</p>
      <div className="space-y-2">
        {formats.map((format) => (
          <a
            key={format}
            href="#"
            className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            下载 {format}
          </a>
        ))}
      </div>
    </div>
  );
}
