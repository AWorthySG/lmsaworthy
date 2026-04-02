import React from 'react';
import { T } from '../../theme/theme.js';
import { FilePdf, FileVideo, FileDoc } from '../../icons/icons.js';

export default function FileIcon({ type, size = 18 }) {
  if (type === "pdf") return <FilePdf size={size} weight="duotone" color="#DC2626" />;
  if (type === "video") return <FileVideo size={size} weight="duotone" color="#0C8CE9" />;
  return <FileDoc size={size} weight="duotone" color={T.accent} />;
}
