import React, { useEffect, useRef, useState } from 'react';
import { T } from '../../theme/theme.js';
import { FileDoc, DownloadSimple, ArrowSquareOut, Warning, X, CheckCircle, ArrowsOut, ArrowsIn } from '../../icons/icons.jsx';
import Btn from './Btn.jsx';
import FileIcon from './FileIcon.jsx';
import { SubjectBadge } from './Badge.jsx';
import useWindowWidth from '../../hooks/useWindowWidth.js';
import { isSavedOffline, saveResourceOffline, removeResourceOffline } from '../../utils/offlineCache.js';
import { linkKind, toEmbedUrl } from '../../utils/helpers.js';

export default function DocumentViewer({ resource, onClose }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const isMobile = useWindowWidth() < 768;
  const [savedOffline, setSavedOffline] = useState(() => resource ? isSavedOffline(resource.id) : false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const absFileUrlForOffline = resource?.fileUrl
    ? (resource.fileUrl.startsWith('http') ? resource.fileUrl : window.location.origin + resource.fileUrl)
    : '';

  /* ── HTML study documents ────────────────────────────────────────────────
     We fetch the markup and render it via `srcdoc` rather than pointing an
     iframe at the Storage URL: Firebase serves files with
     X-Frame-Options: SAMEORIGIN, which browsers refuse to frame.
     The sandbox deliberately omits `allow-same-origin`, so the document runs in
     an opaque origin — its scripts and styles work (interactive study notes
     render fully) but it cannot read the parent's Firebase session, cookies, or
     localStorage. Saved-offline copies are served from the service-worker cache,
     so this same fetch works without a connection. */
  const isHtmlDoc = resource?.type === "html";
  const [htmlDoc, setHtmlDoc] = useState({ url: "", status: "idle", content: "" });
  useEffect(() => {
    if (!isHtmlDoc || !absFileUrlForOffline) return;
    let cancelled = false;
    fetch(absFileUrlForOffline)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.text(); })
      .then(text => { if (!cancelled) setHtmlDoc({ url: absFileUrlForOffline, status: "ready", content: text }); })
      .catch(() => { if (!cancelled) setHtmlDoc({ url: absFileUrlForOffline, status: "error", content: "" }); });
    return () => { cancelled = true; };
  }, [isHtmlDoc, absFileUrlForOffline]);
  // Derived (rather than set synchronously in the effect) so a resource swap
  // shows "loading" immediately without a cascading render.
  const htmlStatus = htmlDoc.url === absFileUrlForOffline ? htmlDoc.status : "loading";

  async function toggleOffline() {
    if (!absFileUrlForOffline) return;
    setSaving(true);
    if (savedOffline) {
      removeResourceOffline(resource.id, absFileUrlForOffline);
      setSavedOffline(false);
    } else {
      await saveResourceOffline(resource.id, absFileUrlForOffline);
      setSavedOffline(true);
    }
    setSaving(false);
  }

  useEffect(() => {
    if (!resource) return;
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    // Auto-focus close button when modal opens
    closeBtnRef.current?.focus();
    return () => window.removeEventListener("keydown", handleEsc);
  }, [resource, onClose]);

  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  if (!resource) return null;
  const isLink = resource.type === "link";
  const isPdf = !isLink && !isHtmlDoc && (resource.type === "pdf" || (resource.fileUrl && resource.fileUrl.endsWith(".pdf")));
  const isVideo = resource.type === "video";
  const kind = isLink ? linkKind(resource.fileUrl) : null;
  const embedUrl = isLink ? toEmbedUrl(resource.fileUrl) : '';
  // Links have no downloadable/offline-cacheable file — suppress those controls for them.
  const absFileUrl = (!isLink && resource.fileUrl)
    ? (resource.fileUrl.startsWith('http') ? resource.fileUrl : window.location.origin + resource.fileUrl)
    : '';
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`Document viewer: ${resource.title}`}
      onKeyDown={handleKeyDown}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: T.bgOverlay, backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", width: expanded ? "100%" : "90%", maxWidth: expanded ? "none" : 1000, height: expanded ? "100dvh" : "88vh", background: T.bgCard, borderRadius: expanded ? 0 : T.r4, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: T.shadow3, transition: "width 0.15s, height 0.15s" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: T.r2, background: resource.type === "pdf" ? T.dangerBg : resource.type === "video" ? "#DBEAFE" : resource.type === "link" ? "#0EA5A015" : resource.type === "html" ? "#7C3AED15" : T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileIcon type={resource.type} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{resource.title}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}><SubjectBadge subjectId={resource.subject} small /><span style={{ fontSize: 11, color: T.textTer }}>{resource.topic}</span></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {absFileUrl && (
              <button onClick={toggleOffline} disabled={saving} aria-label={savedOffline ? "Remove from offline" : "Save for offline"}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: T.r2, border: `1px solid ${savedOffline ? T.success : T.border}`, background: savedOffline ? T.success + "15" : T.bgMuted, color: savedOffline ? T.success : T.textSec, fontSize: 12, fontWeight: 600, cursor: saving ? "wait" : "pointer", transition: "all 0.15s" }}>
                {savedOffline ? <CheckCircle size={13} color={T.success} /> : <DownloadSimple size={13} />}
                {savedOffline ? "Saved" : "Save offline"}
              </button>
            )}
            {absFileUrl && !isMobile && <a href={absFileUrl} download style={{ textDecoration: "none" }}><Btn variant="secondary" size="sm"><DownloadSimple size={14} weight="bold" /> Download</Btn></a>}
            {absFileUrl && (isPdf || isHtmlDoc) && <a href={absFileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><Btn variant="secondary" size="sm"><ArrowSquareOut size={14} weight="bold" /> Open</Btn></a>}
            {isLink && resource.fileUrl && <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><Btn variant="secondary" size="sm"><ArrowSquareOut size={14} weight="bold" /> Open</Btn></a>}
            <button onClick={() => setExpanded(v => !v)} aria-label={expanded ? "Exit full screen" : "Expand to full screen"}
              style={{ background: T.bgMuted, border: `1px solid ${T.border}`, borderRadius: T.r2, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              {expanded ? <ArrowsIn size={15} weight="bold" color={T.textSec} /> : <ArrowsOut size={15} weight="bold" color={T.textSec} />}
            </button>
            <button ref={closeBtnRef} onClick={onClose} aria-label="Close document viewer" style={{ background: T.bgMuted, border: `1px solid ${T.border}`, borderRadius: T.r2, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><X size={16} weight="bold" color={T.textSec} /></button>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          {isHtmlDoc ? (
            htmlStatus === "ready" ? (
              <iframe
                srcDoc={htmlDoc.content}
                sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="no-referrer"
                style={{ width: "100%", height: "100%", border: "none", background: "#FFFFFF" }}
                title={resource.title}
              />
            ) : htmlStatus === "error" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 40, textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: T.r4, background: T.warningBg, display: "flex", alignItems: "center", justifyContent: "center" }}><Warning size={32} color={T.warning} /></div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Couldn&apos;t load this document</div>
                <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, maxWidth: 360 }}>
                  You may be offline, or the file may have been moved. You can still try opening it in a new tab.
                </div>
                <a href={absFileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><Btn><ArrowSquareOut size={15} weight="bold" /> Open in new tab</Btn></a>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: T.textTer }}>
                <div className="skeleton" style={{ width: 240, height: 12, borderRadius: 6 }} />
                <div className="skeleton" style={{ width: 180, height: 12, borderRadius: 6 }} />
                <div style={{ fontSize: 12, marginTop: 4 }}>Loading document…</div>
              </div>
            )
          ) : isLink ? (
            (kind === "gdoc" || kind === "youtube") ? (
              <iframe src={embedUrl} style={{ width: "100%", height: "100%", border: "none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={resource.title} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 40, textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: T.r4, background: "#0EA5A015", display: "flex", alignItems: "center", justifyContent: "center" }}><FileIcon type="link" size={32} /></div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{resource.title}</div>
                <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6, maxWidth: 420, wordBreak: "break-all" }}>{resource.fileUrl}</div>
                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><Btn><ArrowSquareOut size={15} weight="bold" /> Open link</Btn></a>
              </div>
            )
          ) : isVideo && resource.videoUrl ? <iframe src={resource.videoUrl} style={{ width: "100%", height: "100%", border: "none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={resource.title} /> :
           isPdf && absFileUrl && !isMobile ? <iframe src={resource.fileUrl?.startsWith('/') ? absFileUrl : `https://docs.google.com/viewer?url=${encodeURIComponent(absFileUrl)}&embedded=true`} style={{ width: "100%", height: "100%", border: "none" }} title={resource.title} /> :
           isPdf && resource.fileUrl && isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 20, padding: 32, textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: T.r4, background: T.dangerBg, display: "flex", alignItems: "center", justifyContent: "center" }}><FileIcon type="pdf" size={32} /></div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6 }}>{resource.title}</div>
                <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, maxWidth: 280 }}>Open this PDF in a new tab for the best reading experience on mobile.</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><Btn><ArrowSquareOut size={15} weight="bold" /> Open PDF</Btn></a>
                <a href={resource.fileUrl} download style={{ textDecoration: "none" }}><Btn variant="secondary"><DownloadSimple size={15} weight="bold" /> Download</Btn></a>
              </div>
            </div>
           ) : null}
          {/* Fallback for all non-video files (DOCX, or PDF that failed to load) */}
          {!isLink && !isHtmlDoc && (!isVideo || !resource.videoUrl) && !isPdf && resource.fileUrl ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 40, textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: T.r4, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}><FileDoc size={36} /></div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{resource.title}</div>
              <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, maxWidth: 400 }}>This document type can't be previewed directly in the browser. Download it to view in Microsoft Word, Google Docs, or your preferred application.</div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <a href={resource.fileUrl} download style={{ textDecoration: "none" }}><Btn><DownloadSimple size={15} /> Download</Btn></a>
                <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(resource.fileUrl.startsWith('http') ? resource.fileUrl : window.location.origin + resource.fileUrl)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><Btn variant="secondary"><ArrowSquareOut size={15} /> Open in Google Docs</Btn></a>
              </div>
            </div>
          ) : (!isLink && !isHtmlDoc && !isVideo && !isPdf) ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: T.textSec, padding: 40, textAlign: "center" }}>
              <Warning size={32} />
              <div style={{ fontSize: 15, fontWeight: 600 }}>File not available</div>
              <div style={{ fontSize: 13 }}>This resource file could not be loaded. It may not have been uploaded to the server yet.</div>
            </div> : null}
        </div>
      </div>
    </div>
  );
}
