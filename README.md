# Gemini Canvas to Markdown Exporter
# Gemini Canvas 到 Markdown 导出器

A Tampermonkey user script that adds a convenient "Export to Markdown" option to Google Gemini's Canvas. It's designed to perfectly preserve content, especially LaTeX formulas.

这是一个为 [Tampermonkey](https://www.tampermonkey.net/) (油猴) 编写的用户脚本。它为 Google Gemini 的 Canvas 界面添加了一个便捷的“导出为 Markdown”选项，专为完美保留内容（尤其是 LaTeX 公式）而设计。

---

## ✨ Features / 功能特性

-   **One-Click Export:** Adds an "Export Canvas to Markdown" command to the Tampermonkey menu.
-   **一键导出:** 在油猴菜单中添加“导出 Canvas 为 Markdown”命令。

-   **Format Preservation:** Accurately preserves all formatting: headings, lists, bold, italics, and code blocks.
-   **格式保留:** 完整保留标题、列表、粗体、斜体和代码块等 Markdown 格式。

-   **Perfect LaTeX Support:** Directly parses the editor's internal data to export the original source code for both inline (`$...$`) and block (`$$...$$`) math formulas.
-   **完美的 LaTeX 支持:** 通过直接解析编辑器的内部数据结构，确保所有行内 (`$...$`) 和块级 (`$$...$$`) 的 LaTeX 公式都能以源代码形式被准确无误地导出。

-   **Smart Naming:** Automatically uses the Canvas title as the `.md` filename.
-   **智能命名:** 自动尝试使用 Canvas 的标题作为导出的 `.md` 文件名。

-   **Fallback Mode:** If the script fails to read the internal data (due to a site update), it falls back to converting from HTML to ensure text content is still exported.
-   **备用方案:** 当脚本因网站更新而无法读取内部数据时，它将切换到基于 HTML 的转换模式，以尽力保证文本内容的导出。

## 🔧 Installation / 安装步骤

1.  **Install Tampermonkey:**
    Ensure you have the [Tampermonkey browser extension](https://www.tampermonkey.net/) installed in your browser (Chrome, Firefox, Edge, etc.).
    **安装 Tampermonkey:**
    确保您的浏览器（如 Chrome, Firefox, Edge）已安装 [Tampermonkey 扩展](https://www.tampermonkey.net/)。

2.  **Create New Script:**
    Open the Tampermonkey dashboard and click the `+` tab to create a new script.
    **创建新脚本:**
    打开 Tampermonkey 管理面板，点击 “+” 图标创建一个新脚本。

3.  **Copy Code:**
    Delete all the default code in the editor, then copy and paste the *entire* script code into the editor.
    **复制代码:**
    删除编辑器中的所有默认代码，然后将本脚本的**完整代码**复制并粘贴进去。

4.  **Save:**
    Go to "File" -> "Save". The script will be enabled automatically.
    **保存:**
    点击“文件” -> “保存”。脚本将自动激活。

## 🚀 How to Use / 如何使用

1.  **Open Canvas:**
    Visit `gemini.google.com` and open any Canvas you wish to export.
    **打开 Canvas:**
    访问 `gemini.google.com` 并进入任何一个您想要导出的 Canvas 界面。

2.  **Export:**
    Click the **Tampermonkey icon** in your browser's toolbar.
    **执行导出:**
    点击浏览器工具栏上的 **Tampermonkey 图标**。

3.  **Select Menu:**
    Select **"Export Canvas to Markdown"** from the menu.
    **选择菜单:**
    在弹出的菜单中，点击 **“导出 Canvas 为 Markdown”**。

4.  **Save File:**
    Your browser will automatically trigger a file download.
    **保存文件:**
    浏览器将自动触发文件下载。
