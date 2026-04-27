import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  accent: string;
}

export function MarkdownRenderer({ content, accent }: MarkdownRendererProps) {
  const components: Components = {
    h1: ({ children }) => (
      <h1 style={{
        marginTop: 30, marginBottom: 8,
        fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic',
        fontSize: 36, lineHeight: 1, letterSpacing: '-0.03em',
        color: '#fff', transform: 'skewX(-6deg)',
        borderLeft: `4px solid ${accent}`, paddingLeft: 14,
      }}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 style={{
        marginTop: 30, marginBottom: 0,
        fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic',
        fontSize: 28, letterSpacing: '-0.03em', color: '#fff',
        transform: 'skewX(-6deg)',
        borderLeft: `3px solid ${accent}`, paddingLeft: 12,
      }}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 style={{
        marginTop: 22, marginBottom: 0,
        fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic',
        fontSize: 20, letterSpacing: '-0.02em', color: '#fff',
        paddingLeft: 10, borderLeft: `2px solid ${accent}88`,
      }}>{children}</h3>
    ),
    p: ({ children }) => (
      <div style={{ marginTop: 12, fontSize: 15.5, lineHeight: 1.62, color: '#d9e6ff' }}>
        {children}
      </div>
    ),
    strong: ({ children }) => (
      <strong style={{ color: '#fff', fontWeight: 700 }}>{children}</strong>
    ),
    em: ({ children }) => (
      <em style={{ color: accent, fontStyle: 'italic' }}>{children}</em>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        style={{
          color: accent, textDecoration: 'none',
          borderBottom: `1px solid ${accent}55`,
          transition: 'border-color 140ms',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = accent; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accent}55`; }}
      >{children}</a>
    ),
    ul: ({ children }) => (
      <ul style={{
        marginTop: 12, paddingLeft: 0, listStyle: 'none', display: 'flex',
        flexDirection: 'column', gap: 6,
      }}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol style={{
        marginTop: 12, paddingLeft: 0, listStyle: 'none', display: 'flex',
        flexDirection: 'column', gap: 6, counterReset: 'md-ol',
      }}>{children}</ol>
    ),
    li: ({ children }) => (
      <li style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        fontSize: 15.5, lineHeight: 1.55, color: '#d9e6ff',
        paddingLeft: 4,
      }}>
        <span style={{
          color: accent, fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13, lineHeight: '1.55', flexShrink: 0, marginTop: 1,
        }}>▸</span>
        <span>{children}</span>
      </li>
    ),
    code: ({ children, className }) => {
      const isBlock = className?.startsWith('language-');
      if (isBlock) return null; // handled by pre
      return (
        <code style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
          background: `${accent}18`, color: accent,
          padding: '1px 6px', border: `1px solid ${accent}33`,
        }}>{children}</code>
      );
    },
    pre: ({ children }) => (
      <pre style={{
        marginTop: 14,
        background: 'rgba(5,16,42,0.8)',
        border: `1px solid ${accent}44`,
        borderLeft: `3px solid ${accent}`,
        padding: '14px 16px', overflowX: 'auto',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
        lineHeight: 1.55, color: '#d9e6ff',
      }}>{children}</pre>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{
        margin: '16px 0', paddingLeft: 14,
        borderLeft: `3px solid ${accent}`,
        color: '#d9e6ff', opacity: 0.85,
        fontStyle: 'italic',
      }}>{children}</blockquote>
    ),
    img: ({ src, alt }) => (
      <div style={{ marginTop: 18, position: 'relative' }}>
        <img
          src={src}
          alt={alt ?? ''}
          style={{
            width: '100%', display: 'block',
            border: `1px solid ${accent}55`,
            outline: `1px solid ${accent}22`,
            outlineOffset: 3,
          }}
        />
        {alt && (
          <div style={{
            marginTop: 6,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: accent, opacity: 0.7,
          }}>[ {alt} ]</div>
        )}
      </div>
    ),
    hr: () => (
      <hr style={{
        margin: '26px 0', border: 'none',
        height: 1, background: `linear-gradient(90deg, ${accent}, transparent)`,
      }} />
    ),
    table: ({ children }) => (
      <div style={{ marginTop: 14, overflowX: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
          color: '#d9e6ff',
        }}>{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th style={{
        padding: '6px 12px', textAlign: 'left',
        borderBottom: `2px solid ${accent}`,
        color: accent, letterSpacing: '0.12em', textTransform: 'uppercase',
        fontWeight: 700,
      }}>{children}</th>
    ),
    td: ({ children }) => (
      <td style={{
        padding: '6px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>{children}</td>
    ),
  };

  return (
    <div style={{ marginTop: 22, maxWidth: 680, paddingBottom: 40 }}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkUnwrapImages]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
