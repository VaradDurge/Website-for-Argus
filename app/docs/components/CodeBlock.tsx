"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/* ── syntax token sets per language ── */

const PY_KEYWORDS = new Set([
  "from", "import", "as", "def", "return", "class", "if", "else", "elif",
  "for", "in", "while", "try", "except", "finally", "with", "raise", "yield",
  "async", "await", "pass", "break", "continue", "and", "or", "not", "is",
  "None", "True", "False", "lambda", "self",
]);
const PY_BUILTINS = new Set([
  "print", "len", "range", "type", "str", "int", "float", "list", "dict",
  "set", "tuple", "bool", "open", "super", "isinstance", "enumerate",
]);
const PY_CLASSES = new Set(["ArgusWatcher", "StateGraph", "BaseModel", "Field"]);

const YAML_KEYWORDS = new Set(["true", "false", "null", "yes", "no"]);

const TS_KEYWORDS = new Set([
  "import", "export", "from", "const", "let", "var", "function", "return",
  "if", "else", "for", "while", "class", "interface", "type", "extends",
  "implements", "new", "this", "async", "await", "try", "catch", "throw",
  "typeof", "instanceof", "void", "null", "undefined", "true", "false",
]);

/* ── highlighters ── */

function highlightPython(code: string) {
  const lines = code.split("\n");
  return lines.map((line, li) => {
    const hashIdx = line.indexOf("#");
    const codePart = hashIdx >= 0 ? line.slice(0, hashIdx) : line;
    const comment = hashIdx >= 0 ? line.slice(hashIdx) : "";
    const parts = codePart.split(/(\s+|[().,=:\[\]{}@])/);

    return (
      <span key={li}>
        {parts.map((p, i) => {
          if (!p) return null;
          if (/^\s+$/.test(p)) return <span key={i}>{p}</span>;
          if (PY_KEYWORDS.has(p))
            return <span key={i} className="text-[var(--signal-warn)]">{p}</span>;
          if (PY_BUILTINS.has(p))
            return <span key={i} className="text-[#e879f9]">{p}</span>;
          if (PY_CLASSES.has(p))
            return <span key={i} className="text-[var(--accent-soft)]">{p}</span>;
          if (/^["']/.test(p))
            return <span key={i} className="text-[var(--signal-ok)]">{p}</span>;
          if (/^[().,=:\[\]{}@]$/.test(p))
            return <span key={i} className="text-[var(--text-muted)]">{p}</span>;
          if (/^\d/.test(p))
            return <span key={i} className="text-[var(--signal-ok)]">{p}</span>;
          return <span key={i} className="text-white">{p}</span>;
        })}
        {comment && <span className="text-[var(--text-dim)]">{comment}</span>}
        {li < lines.length - 1 ? "\n" : null}
      </span>
    );
  });
}

function highlightBash(code: string) {
  const lines = code.split("\n");
  return lines.map((line, li) => {
    const trimmed = line.trimStart();
    const indent = line.slice(0, line.length - trimmed.length);
    const hashIdx = trimmed.indexOf("#");
    const isComment = trimmed.startsWith("#");

    if (isComment) {
      return (
        <span key={li}>
          {indent}
          <span className="text-[var(--text-dim)]">{trimmed}</span>
          {li < lines.length - 1 ? "\n" : null}
        </span>
      );
    }

    const codePart = hashIdx > 0 ? trimmed.slice(0, hashIdx) : trimmed;
    const comment = hashIdx > 0 ? trimmed.slice(hashIdx) : "";

    const parts = codePart.split(/(\s+)/);
    let seenCmd = false;

    return (
      <span key={li}>
        {indent}
        {parts.map((p, i) => {
          if (!p) return null;
          if (/^\s+$/.test(p)) return <span key={i}>{p}</span>;
          if (p === "$")
            return <span key={i} className="text-[var(--accent-soft)]">{p}</span>;
          if (p.startsWith("--") || p.startsWith("-"))
            return <span key={i} className="text-[var(--signal-warn)]">{p}</span>;
          if (!seenCmd && p !== "$") {
            seenCmd = true;
            return <span key={i} className="text-white">{p}</span>;
          }
          return <span key={i} className="text-white">{p}</span>;
        })}
        {comment && <span className="text-[var(--text-dim)]"> {comment}</span>}
        {li < lines.length - 1 ? "\n" : null}
      </span>
    );
  });
}

function highlightYaml(code: string) {
  const lines = code.split("\n");
  return lines.map((line, li) => {
    const trimmed = line.trimStart();
    const indent = line.slice(0, line.length - trimmed.length);

    if (trimmed.startsWith("#")) {
      return (
        <span key={li}>
          {indent}<span className="text-[var(--text-dim)]">{trimmed}</span>
          {li < lines.length - 1 ? "\n" : null}
        </span>
      );
    }

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx > 0) {
      const key = trimmed.slice(0, colonIdx);
      const rest = trimmed.slice(colonIdx);
      const val = rest.slice(1).trim();

      return (
        <span key={li}>
          {indent}
          <span className="text-[var(--accent-soft)]">{key}</span>
          <span className="text-[var(--text-muted)]">:</span>
          {val && (
            <>
              {" "}
              {YAML_KEYWORDS.has(val) ? (
                <span className="text-[var(--signal-warn)]">{val}</span>
              ) : val.startsWith('"') || val.startsWith("'") ? (
                <span className="text-[var(--signal-ok)]">{val}</span>
              ) : /^\d/.test(val) ? (
                <span className="text-[var(--signal-ok)]">{val}</span>
              ) : (
                <span className="text-white">{val}</span>
              )}
            </>
          )}
          {li < lines.length - 1 ? "\n" : null}
        </span>
      );
    }

    if (trimmed.startsWith("- ")) {
      return (
        <span key={li}>
          {indent}<span className="text-[var(--text-muted)]">- </span>
          <span className="text-white">{trimmed.slice(2)}</span>
          {li < lines.length - 1 ? "\n" : null}
        </span>
      );
    }

    return (
      <span key={li}>
        {indent}<span className="text-white">{trimmed}</span>
        {li < lines.length - 1 ? "\n" : null}
      </span>
    );
  });
}

function highlightJson(code: string) {
  const lines = code.split("\n");
  return lines.map((line, li) => {
    const trimmed = line.trimStart();
    const indent = line.slice(0, line.length - trimmed.length);

    /* key: value pattern */
    const match = trimmed.match(/^(".*?")\s*:\s*(.*?)([,]?)$/);
    if (match) {
      const [, key, val, comma] = match;
      return (
        <span key={li}>
          {indent}
          <span className="text-[var(--accent-soft)]">{key}</span>
          <span className="text-[var(--text-muted)]">: </span>
          {highlightJsonValue(val)}
          {comma && <span className="text-[var(--text-muted)]">{comma}</span>}
          {li < lines.length - 1 ? "\n" : null}
        </span>
      );
    }

    return (
      <span key={li}>
        {indent}
        {/^[{}\[\],]/.test(trimmed) ? (
          <span className="text-[var(--text-muted)]">{trimmed}</span>
        ) : (
          highlightJsonValue(trimmed)
        )}
        {li < lines.length - 1 ? "\n" : null}
      </span>
    );
  });
}

function highlightJsonValue(val: string) {
  const v = val.trim().replace(/,$/, "");
  const comma = val.trim().endsWith(",") ? "," : "";

  if (v.startsWith('"'))
    return <><span className="text-[var(--signal-ok)]">{v}</span>{comma && <span className="text-[var(--text-muted)]">{comma}</span>}</>;
  if (v === "true" || v === "false" || v === "null")
    return <><span className="text-[var(--signal-warn)]">{v}</span>{comma && <span className="text-[var(--text-muted)]">{comma}</span>}</>;
  if (/^\d/.test(v))
    return <><span className="text-[var(--signal-ok)]">{v}</span>{comma && <span className="text-[var(--text-muted)]">{comma}</span>}</>;
  return <><span className="text-white">{v}</span>{comma && <span className="text-[var(--text-muted)]">{comma}</span>}</>;
}

function highlightTypescript(code: string) {
  const lines = code.split("\n");
  return lines.map((line, li) => {
    const slashIdx = line.indexOf("//");
    const codePart = slashIdx >= 0 ? line.slice(0, slashIdx) : line;
    const comment = slashIdx >= 0 ? line.slice(slashIdx) : "";
    const parts = codePart.split(/(\s+|[().,=:;\[\]{}<>]|"[^"]*"|'[^']*'|`[^`]*`)/);

    return (
      <span key={li}>
        {parts.map((p, i) => {
          if (!p) return null;
          if (/^\s+$/.test(p)) return <span key={i}>{p}</span>;
          if (TS_KEYWORDS.has(p))
            return <span key={i} className="text-[var(--signal-warn)]">{p}</span>;
          if (/^["'`]/.test(p))
            return <span key={i} className="text-[var(--signal-ok)]">{p}</span>;
          if (/^[().,=:;\[\]{}<>]$/.test(p))
            return <span key={i} className="text-[var(--text-muted)]">{p}</span>;
          if (/^\d/.test(p))
            return <span key={i} className="text-[var(--signal-ok)]">{p}</span>;
          return <span key={i} className="text-white">{p}</span>;
        })}
        {comment && <span className="text-[var(--text-dim)]">{comment}</span>}
        {li < lines.length - 1 ? "\n" : null}
      </span>
    );
  });
}

function highlightPlain(code: string) {
  return code.split("\n").map((line, li, arr) => (
    <span key={li}>
      <span className="text-[var(--text-muted)]">{line}</span>
      {li < arr.length - 1 ? "\n" : null}
    </span>
  ));
}

/* ── main highlighter dispatch ── */

const HIGHLIGHTERS: Record<string, (code: string) => React.ReactNode> = {
  python: highlightPython,
  bash: highlightBash,
  shell: highlightBash,
  yaml: highlightYaml,
  yml: highlightYaml,
  json: highlightJson,
  typescript: highlightTypescript,
  ts: highlightTypescript,
  text: highlightPlain,
  plaintext: highlightPlain,
};

/* ── CodeBlock ── */

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlights?: number[];
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "plaintext",
  filename,
  highlights,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const highlighter = HIGHLIGHTERS[language] || highlightPlain;
  const lines = code.split("\n");
  const highlightSet = new Set(highlights || []);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="my-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
            {language}
          </span>
          {filename && (
            <>
              <span className="w-px h-3 bg-[var(--border)]" />
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {filename}
              </span>
            </>
          )}
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-strong)] transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>

      {/* code body */}
      <div className="overflow-x-auto scroll-pretty">
        <pre className="px-4 py-3.5 font-mono text-[12px] leading-[1.75]">
          <code>
            {showLineNumbers || highlightSet.size > 0
              ? lines.map((line, i) => {
                  const lineNum = i + 1;
                  const isHighlighted = highlightSet.has(lineNum);
                  const singleLine = (HIGHLIGHTERS[language] || highlightPlain)(line);
                  return (
                    <span
                      key={i}
                      className={`block ${isHighlighted ? "bg-[rgba(109,92,255,0.06)] border-l-2 border-[var(--accent-soft)] -ml-[2px] pl-[2px]" : ""}`}
                    >
                      {showLineNumbers && (
                        <span className="inline-block w-8 text-right mr-4 text-[var(--text-dim)] select-none">
                          {lineNum}
                        </span>
                      )}
                      {singleLine}
                      {i < lines.length - 1 ? "\n" : null}
                    </span>
                  );
                })
              : highlighter(code)}
          </code>
        </pre>
      </div>
    </div>
  );
}
