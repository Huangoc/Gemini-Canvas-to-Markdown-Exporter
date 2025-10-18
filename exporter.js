// ==UserScript==
// @name         Gemini Canvas to Markdown Exporter
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a menu command to export Gemini's Canvas content to a Markdown file, with robust support for LaTeX.
// @author       huangoc with gemini AI
// @match        https://gemini.google.com/app/*
// @grant        GM_registerMenuCommand
// @require      https://unpkg.com/turndown/dist/turndown.js
// ==/UserScript==

(function() {
    'use strict';
    /* global TurndownService */
    /**
     * Converts a ProseMirror document JSON object to a Markdown string.
     * This is the core conversion logic.
     * @param {Object} docJson The document JSON from ProseMirror's state.
     * @returns {string} The Markdown content.
     */
    function prosemirrorToMarkdown(docJson) {
        let markdown = '';

        function renderNodes(nodes, listInfo = {}) {
            let result = '';
            nodes.forEach((node, index) => {
                const currentListInfo = { ...listInfo };
                if (node.type === 'ordered_list') {
                    currentListInfo.isOrdered = true;
                    currentListInfo.level = (listInfo.level || 0) + 1;
                    currentListInfo.startIndex = node.attrs?.start || 1;
                } else if (node.type === 'bullet_list') {
                     currentListInfo.isOrdered = false;
                     currentListInfo.level = (listInfo.level || 0) + 1;
                }

                if (node.type === 'list_item') {
                    currentListInfo.index = (listInfo.startIndex || 1) + index;
                }
                result += renderNode(node, currentListInfo);
            });
            return result;
        }

        function renderNode(node, listInfo) {
            let content = node.content ? renderNodes(node.content, listInfo) : '';

            switch (node.type) {
                case 'doc': return content;
                case 'paragraph': return content.trim() ? content + '\n\n' : '';
                case 'heading': return '#'.repeat(node.attrs.level) + ' ' + content + '\n\n';
                case 'text':{
                    let text = node.text;
                    if (node.marks) {
                        [...node.marks].reverse().forEach(mark => {
                            if (mark.type === 'strong') text = `**${text}**`;
                            else if (mark.type === 'em') text = `*${text}*`;
                            else if (mark.type === 'code') text = `\`${text}\``;
                            else if (mark.type === 'link') text = `[${text}](${mark.attrs.href})`;
                        });
                    }
                    return text;}
                case 'bullet_list': return content + '\n';
                case 'ordered_list': return content + '\n';
                case 'list_item':{
                    const indent = '  '.repeat((listInfo.level || 1) - 1);
                    const prefix = listInfo.isOrdered ? `${listInfo.index}. ` : '* ';
                    let itemContent = content.trim().replace(/\n\n/g, '\n' + indent + '  ');
                    return indent + prefix + itemContent + '\n';}
                // --- FIX STARTS HERE ---
                case 'math_inline':
                    return `$${node.attrs.latex_content}$`;
                case 'math_block':
                    return `\n$$\n${node.attrs.latex_content}\n$$\n\n`;
                // --- FIX ENDS HERE ---
                case 'code_block':{
                    const lang = node.attrs.language || '';
                    const codeContent = node.content ? node.content.map(n => n.text).join('\n') : '';
                    return '```' + lang + '\n' + codeContent + '\n```\n\n';}
                case 'hard_break': return '\n';
                default: return content;
            }
        }
        markdown = renderNodes(docJson.content);
        return markdown.replace(/\n{3,}/g, '\n\n').trim();
    }

    /**
     * Triggers a file download using a temporary anchor element.
     * @param {string} filename The name of the file to save.
     * @param {string} content The content of the file.
     */
    function triggerDownload(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    /**
     * Main export function triggered by the menu command.
     */
    function exportCanvas() {
        const editorElement = document.querySelector('div.immersive-editor.markdown div.ProseMirror');
        if (!editorElement) {
            alert('错误：未找到 Gemini Canvas 编辑器。\n请确保您已打开一个 Canvas (例如，通过点击"修改"或创建一个新文档)。');
            return;
        }

        let markdownContent = '';

        // Method 1 (Primary): Directly access the node from pmViewDesc.
        if (editorElement.pmViewDesc && editorElement.pmViewDesc.node) {
            try {
                const docJson = editorElement.pmViewDesc.node.toJSON();
                markdownContent = prosemirrorToMarkdown(docJson);
                console.log("Gemini Exporter: SUCCESS - Extracted content directly from `pmViewDesc.node`.");
            } catch (e) {
                console.error("Gemini Exporter: Failed to serialize from `pmViewDesc.node`.", e);
                markdownContent = ''; // Allow fallback if this fails
            }
        }

        // Method 2 (Fallback): HTML conversion.
        if (!markdownContent) {
            console.warn("Gemini Exporter: Could not use primary method. Falling back to HTML conversion. LaTeX may not be accurate.");
            alert("警告：无法直接访问编辑器数据，将尝试从HTML转换。\nLaTeX公式可能无法正确导出为原始代码。");

            const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
            turndownService.addRule('gemini-math-block', { filter: 'math-block', replacement: (content, node) => `\n$$\n${node.textContent}\n$$\n\n` });
            turndownService.addRule('gemini-math-inline', { filter: 'math-inline', replacement: (content, node) => `$${node.textContent}$` });
            markdownContent = turndownService.turndown(editorElement);
        }

        if (!markdownContent.trim()) {
            alert('导出失败：无法提取任何内容。');
            return;
        }

        const titleElement = document.querySelector('extended-response-panel h2.title-text');
        const title = titleElement ? titleElement.textContent.trim().replace(/[\\/:*?"<>|]/g, '') : 'gemini-canvas-export';
        const filename = `${title}.md`;

        try {
            triggerDownload(filename, markdownContent);
        } catch (e) {
             console.error("Download failed", e);
             alert("下载失败: " + e.message);
        }
    }

    GM_registerMenuCommand('导出 Canvas 为 Markdown', exportCanvas);

})();
