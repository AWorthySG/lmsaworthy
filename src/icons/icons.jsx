import React from "react";
import { Icon } from "@iconify/react";

/* ━━━ ICONIFY WRAPPER — coloured icon sets (Fluent Color, Noto, Flat Color) ━━━
   ic = monochrome (respects color prop), icc = coloured (ignores color, shows native colours) */
export const ic = (name) => React.memo(({ size = 20, color, weight, style: s, className }) => (
  <Icon icon={name} width={size} height={size} style={{ color, flexShrink: 0, ...s }} className={className} />
));
export const icc = (name) => React.memo(({ size = 20, color, weight, style: s, className }) => (
  <Icon icon={name} width={size} height={size} style={{ flexShrink: 0, ...s }} className={className} />
));

// Navigation & Layout
export const House = icc("fluent-emoji-flat:house-with-garden");
export const Compass = icc("fluent-emoji-flat:world-map");
export const Broadcast = icc("fluent-emoji-flat:satellite-antenna");
export const List = ic("fluent:navigation-24-filled");
export const ArrowLeft = ic("fluent:arrow-left-24-filled");
export const ArrowRight = ic("fluent:arrow-right-24-filled");
export const CaretRight = ic("fluent:chevron-right-24-filled");
export const CaretDown = ic("fluent:chevron-down-24-filled");
export const Monitor = icc("fluent-emoji-flat:desktop-computer");
export const Eye = icc("fluent-emoji-flat:eyes");

// Content & Files
export const Books = icc("fluent-emoji-flat:books");
export const BookOpen = icc("fluent-emoji-flat:open-book");
export const FolderSimpleStar = icc("fluent-emoji-flat:card-file-box");
export const Folder = icc("fluent-emoji-flat:file-folder");
export const FolderOpen = icc("fluent-emoji-flat:open-file-folder");
export const FolderSimple = icc("fluent-emoji-flat:file-folder");
export const FilePdf = icc("vscode-icons:file-type-pdf2");
export const FileDoc = icc("vscode-icons:file-type-word");
export const FileVideo = icc("fluent-emoji-flat:clapper-board");
export const Upload = icc("fluent-emoji-flat:outbox-tray");
export const DownloadSimple = icc("fluent-emoji-flat:inbox-tray");
export const Tag = icc("fluent-emoji-flat:label");
export const Hash = ic("fluent:number-symbol-24-filled");
export const Notebook = icc("fluent-emoji-flat:notebook-with-decorative-cover");
export const BookmarkSimple = icc("fluent-emoji-flat:bookmark-tabs");
export const Scroll = icc("fluent-emoji-flat:rolled-up-newspaper");
export const ClipboardText = icc("fluent-emoji-flat:clipboard");

// Media & Video
export const VideoCamera = icc("fluent-emoji-flat:movie-camera");
export const VideoOn = icc("fluent-emoji-flat:movie-camera");
export const VideoCameraSlash = ic("fluent:video-off-24-filled");
export const PlayCircle = icc("fluent-emoji-flat:play-button");
export const Play = icc("fluent-emoji-flat:play-button");
export const PauseCircle = icc("fluent-emoji-flat:pause-button");
export const SkipForward = ic("fluent:next-24-filled");
export const Screencast = icc("fluent-emoji-flat:television");

// Actions & Tools
export const Plus = icc("fluent-emoji-flat:heavy-plus-sign");
export const X = ic("fluent:dismiss-24-filled");
export const Trash = icc("fluent-emoji-flat:wastebasket");
export const MagnifyingGlass = icc("fluent-emoji-flat:magnifying-glass-tilted-right");
export const PencilSimpleLine = icc("fluent-emoji-flat:memo");
export const Pen = icc("fluent-emoji-flat:fountain-pen");
export const Eraser = ic("fluent:eraser-24-filled");
export const PaintBucket = icc("fluent-emoji-flat:artist-palette");

// Drawing tools — mono for toolbar (need to respect color for active state)
export const Pencil = ic("fluent:pen-24-filled");
export const Cursor = ic("fluent:cursor-24-filled");
export const HighlighterCircle = ic("fluent:highlight-24-filled");
export const Circle = ic("fluent:circle-24-regular");
export const Square = ic("fluent:square-24-regular");
export const Minus = ic("fluent:line-horizontal-1-24-filled");
export const ArrowUUpLeft = ic("fluent:arrow-undo-24-filled");
export const ArrowUUpRight = ic("fluent:arrow-redo-24-filled");

// Communication
export const ChatCircle = icc("fluent-emoji-flat:left-speech-bubble");
export const Bell = icc("fluent-emoji-flat:bell");
export const ChatText = icc("fluent-emoji-flat:speech-balloon");
export const Handshake = icc("fluent-emoji-flat:handshake");
export const Megaphone = icc("fluent-emoji-flat:megaphone");
export const ThumbsUp = icc("fluent-emoji-flat:thumbs-up");
export const PushPin = icc("fluent-emoji-flat:round-pushpin");
export const Phone = icc("fluent-emoji-flat:telephone-receiver");
export const PhoneDisconnect = ic("fluent:call-end-24-filled");
export const Microphone = ic("fluent:mic-24-filled");
export const MicrophoneSlash = ic("fluent:mic-off-24-filled");

// Education & Learning
export const GraduationCap = icc("fluent-emoji-flat:graduation-cap");
export const Lightning = icc("fluent-emoji-flat:high-voltage");
export const Brain = icc("fluent-emoji-flat:brain");
export const Target = icc("fluent-emoji-flat:direct-hit");
export const Lightbulb = icc("fluent-emoji-flat:light-bulb");
export const Scales = icc("fluent-emoji-flat:balance-scale");
export const Exam = icc("fluent-emoji-flat:page-with-curl");
export const Student = icc("fluent-emoji-flat:woman-student");
export const Chalkboard = icc("fluent-emoji-flat:laptop");

// Gamification & Rewards
export const Trophy = icc("fluent-emoji-flat:trophy");
export const Crown = icc("fluent-emoji-flat:crown");
export const Medal = icc("fluent-emoji-flat:1st-place-medal");
export const Star = icc("fluent-emoji-flat:glowing-star");
export const Sparkle = icc("fluent-emoji-flat:dizzy");
export const Flame = icc("fluent-emoji-flat:fire");
export const Gift = icc("fluent-emoji-flat:wrapped-gift");
export const Confetti = icc("fluent-emoji-flat:party-popper");
export const RocketLaunch = icc("fluent-emoji-flat:rocket");
export const HandsClapping = icc("fluent-emoji-flat:clapping-hands");
export const SealCheck = icc("fluent-emoji-flat:check-mark-button");

// Status & Feedback
export const CheckCircle = icc("fluent-emoji-flat:check-mark-button");
export const XCircle = icc("fluent-emoji-flat:cross-mark");
export const Warning = icc("fluent-emoji-flat:warning");
export const ArrowFatUp = icc("fluent-emoji-flat:up-arrow");

// Data & Charts
export const ChartLineUp = icc("fluent-emoji-flat:chart-increasing");
export const ChartBar = icc("fluent-emoji-flat:bar-chart");
export const ChartPie = icc("fluent-emoji-flat:chart-increasing-with-yen");
export const Gauge = icc("fluent-emoji-flat:speedometer");

// Calendar & Time
export const CalendarBlank = icc("fluent-emoji-flat:calendar");
export const CalendarCheck = icc("fluent-emoji-flat:spiral-calendar");
export const Clock = icc("fluent-emoji-flat:alarm-clock");
export const Timer = icc("fluent-emoji-flat:stopwatch");
export const ClockAlert = icc("fluent-emoji-flat:alarm-clock");

// Users & People
export const Users = icc("fluent-emoji-flat:family");
export const ArrowSquareOut = ic("fluent:arrow-export-24-filled");

// Misc
export const Atom = icc("fluent-emoji-flat:atom-symbol");
export const FlowArrow = icc("flat-color-icons:workflow");
export const MagicWand = icc("fluent-emoji-flat:magic-wand");
export const CheckSquare = icc("fluent-emoji-flat:check-box-with-check");
export const Dot = ic("fluent:circle-small-24-filled");
export const Waveform = icc("flat-color-icons:voice-presentation");
export const ListChecks = icc("fluent-emoji-flat:check-box-with-check");
