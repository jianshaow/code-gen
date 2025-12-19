import 'github-markdown-css/github-markdown-light.css';
import groovy from "highlight.js/lib/languages/groovy";
import "highlight.js/styles/github.css";
import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import './Markdown.css';

interface MarkdownViewerProps {
  content: string;
  style?: React.CSSProperties;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, style = { height: 200 } }) => {
  const markdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = markdownRef.current;
    if (element) {
      requestAnimationFrame(() => {
        element.scrollTop = element.scrollHeight;
      });
    }
  }, [content]);

  const languages = {
    groovy,
  };

  return (
    <div ref={markdownRef} className="markdown-frame markdown-body" style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeHighlight, { languages }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
