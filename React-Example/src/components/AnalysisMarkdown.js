import { useMemo } from 'react';
import { marked } from 'marked';

function AnalysisMarkdown({ content }) {
  const html = useMemo(() => marked.parse(content || '暂无分析结果。', {
    breaks: true,
    gfm: true,
  }), [content]);

  return (
    <div
      className="analysis-markdown"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default AnalysisMarkdown;
