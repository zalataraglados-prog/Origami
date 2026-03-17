import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Origami",
  description: "Unified inbox for Gmail, Outlook, and QQ.",
  base: "/Origami/",
  cleanUrls: true,
  lastUpdated: true,
  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        siteTitle: "Origami",
        logo: "✉️",
        nav: [
          { text: "Home", link: "/" },
          { text: "Architecture", link: "/architecture" },
          { text: "Deployment", link: "/deployment" },
          { text: "Project Structure", link: "/project-structure" },
          { text: "GitHub", link: "https://github.com/theLucius7/Origami" }
        ],
        sidebar: [
          {
            text: "Guide",
            items: [
              { text: "Overview", link: "/" },
              { text: "Architecture", link: "/architecture" },
              { text: "Deployment", link: "/deployment" },
              { text: "Project Structure", link: "/project-structure" }
            ]
          }
        ],
        search: {
          provider: "local"
        },
        socialLinks: [
          { icon: "github", link: "https://github.com/theLucius7/Origami" }
        ],
        footer: {
          message: "Released under the MIT License.",
          copyright: "Copyright © 2026 Lucius7"
        }
      }
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
      link: "/zh/",
      themeConfig: {
        siteTitle: "Origami",
        logo: "✉️",
        nav: [
          { text: "首页", link: "/zh/" },
          { text: "架构", link: "/zh/architecture" },
          { text: "部署", link: "/zh/deployment" },
          { text: "项目结构", link: "/zh/project-structure" },
          { text: "GitHub", link: "https://github.com/theLucius7/Origami" }
        ],
        sidebar: [
          {
            text: "文档",
            items: [
              { text: "概览", link: "/zh/" },
              { text: "架构", link: "/zh/architecture" },
              { text: "部署", link: "/zh/deployment" },
              { text: "项目结构", link: "/zh/project-structure" }
            ]
          }
        ],
        search: {
          provider: "local"
        },
        socialLinks: [
          { icon: "github", link: "https://github.com/theLucius7/Origami" }
        ],
        footer: {
          message: "基于 MIT License 发布。",
          copyright: "Copyright © 2026 Lucius7"
        }
      }
    }
  }
});
