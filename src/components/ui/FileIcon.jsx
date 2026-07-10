import React from 'react';
import { T } from '../../theme/theme.js';
import { FilePdf, FileVideo, FileDoc, Link } from '../../icons/icons.jsx';

export default function FileIcon({ type, size = 18 }) {
  if (type === "pdf") return <FilePdf size={size} weight="duotone" color="#DC2626" />;
  if (type === "video") return <FileVideo size={size} weight="duotone" color="#0C8CE9" />;
  if (type === "link") return <Link size={size} weight="bold" color="#0EA5A0" />;
  return <FileDoc size={size} weight="duotone" color={T.accent} />;
}
