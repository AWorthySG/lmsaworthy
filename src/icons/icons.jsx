import React from "react";
import { Icon } from "@iconify/react";

/* ━━━ ICONIFY WRAPPER — Phosphor icons (monochrome, respects color prop) ━━━ */
export const ic = (name) => React.memo(({ size = 20, color, weight: _weight, style: s, className }) => (
  <Icon icon={name} width={size} height={size} style={{ color, flexShrink: 0, ...s }} className={className} />
));
export const icc = ic;

// Navigation & Layout
export const House = ic("ph:house-bold");
export const Compass = ic("ph:compass-bold");
export const Broadcast = ic("ph:broadcast-bold");
export const List = ic("ph:list-bold");
export const ArrowLeft = ic("ph:arrow-left-bold");
export const ArrowRight = ic("ph:arrow-right-bold");
export const CaretRight = ic("ph:caret-right-bold");
export const CaretLeft = ic("ph:caret-left-bold");
export const CaretDown = ic("ph:caret-down-bold");
export const CaretUp = ic("ph:caret-up-bold");
export const Monitor = ic("ph:monitor-bold");
export const Eye = ic("ph:eye-bold");

// Content & Files
export const Books = ic("ph:books-bold");
export const BookOpen = ic("ph:book-open-bold");
export const FolderSimpleStar = ic("ph:folder-star-bold");
export const Folder = ic("ph:folder-bold");
export const FolderOpen = ic("ph:folder-open-bold");
export const FolderSimple = ic("ph:folder-simple-bold");
export const FilePdf = ic("ph:file-pdf-bold");
export const FileDoc = ic("ph:file-doc-bold");
export const FileVideo = ic("ph:file-video-bold");
export const Upload = ic("ph:upload-simple-bold");
export const DownloadSimple = ic("ph:download-simple-bold");
export const Tag = ic("ph:tag-bold");
export const Hash = ic("ph:hash-bold");
export const Notebook = ic("ph:notebook-bold");
export const BookmarkSimple = ic("ph:bookmark-simple-bold");
export const Scroll = ic("ph:scroll-bold");
export const ClipboardText = ic("ph:clipboard-text-bold");

// Media & Video
export const Camera = ic("ph:camera-bold");
export const VideoCamera = ic("ph:video-camera-bold");
export const VideoOn = ic("ph:video-camera-bold");
export const VideoCameraSlash = ic("ph:video-camera-slash-bold");
export const PlayCircle = ic("ph:play-circle-bold");
export const Play = ic("ph:play-bold");
export const PauseCircle = ic("ph:pause-circle-bold");
export const SkipForward = ic("ph:skip-forward-bold");
export const Screencast = ic("ph:screencast-bold");

// Actions & Tools
export const Plus = ic("ph:plus-bold");
export const X = ic("ph:x-bold");
export const Trash = ic("ph:trash-bold");
export const MagnifyingGlass = ic("ph:magnifying-glass-bold");
export const SortAscending = ic("ph:sort-ascending-bold");
export const PencilSimpleLine = ic("ph:pencil-simple-line-bold");
export const Pen = ic("ph:pen-bold");
export const Eraser = ic("ph:eraser-bold");
export const PaintBucket = ic("ph:paint-bucket-bold");

// Drawing tools
export const Pencil = ic("ph:pencil-bold");
export const Cursor = ic("ph:cursor-bold");
export const HighlighterCircle = ic("ph:highlighter-circle-bold");
export const Circle = ic("ph:circle-bold");
export const Square = ic("ph:square-bold");
export const Minus = ic("ph:minus-bold");
export const ArrowUUpLeft = ic("ph:arrow-u-up-left-bold");
export const ArrowUUpRight = ic("ph:arrow-u-up-right-bold");

// Communication
export const ChatCircle = ic("ph:chat-circle-bold");
export const Bell = ic("ph:bell-bold");
export const ChatText = ic("ph:chat-text-bold");
export const Handshake = ic("ph:handshake-bold");
export const Megaphone = ic("ph:megaphone-bold");
export const ThumbsUp = ic("ph:thumbs-up-bold");
export const PushPin = ic("ph:push-pin-bold");
export const Phone = ic("ph:phone-bold");
export const PhoneDisconnect = ic("ph:phone-disconnect-bold");
export const Microphone = ic("ph:microphone-bold");
export const MicrophoneSlash = ic("ph:microphone-slash-bold");

// Education & Learning
export const GraduationCap = ic("ph:graduation-cap-bold");
export const Lightning = ic("ph:lightning-bold");
export const Brain = ic("ph:brain-bold");
export const Target = ic("ph:target-bold");
export const Lightbulb = ic("ph:lightbulb-bold");
export const Scales = ic("ph:scales-bold");
export const Exam = ic("ph:exam-bold");
export const Student = ic("ph:student-bold");
export const Chalkboard = ic("ph:chalkboard-bold");
export const Leaf = ic("ph:leaf-bold");
export const MusicNote = ic("ph:music-note-bold");

// Gamification & Rewards
export const Trophy = ic("ph:trophy-bold");
export const Crown = ic("ph:crown-bold");
export const Medal = ic("ph:medal-bold");
export const Star = ic("ph:star-bold");
export const Sparkle = ic("ph:sparkle-bold");
export const Flame = ic("ph:flame-bold");
export const Gift = ic("ph:gift-bold");
export const Confetti = ic("ph:confetti-bold");
export const RocketLaunch = ic("ph:rocket-launch-bold");
export const HandsClapping = ic("ph:hands-clapping-bold");
export const SealCheck = ic("ph:seal-check-bold");

// Status & Feedback
export const Check = ic("ph:check-bold");
export const CheckCircle = ic("ph:check-circle-bold");
export const XCircle = ic("ph:x-circle-bold");
export const Warning = ic("ph:warning-bold");
export const ArrowFatUp = ic("ph:arrow-fat-up-bold");
export const Paperclip = ic("ph:paperclip-bold");
export const Smiley = ic("ph:smiley-bold");

// Data & Charts
export const ChartLineUp = ic("ph:chart-line-up-bold");
export const ChartBar = ic("ph:chart-bar-bold");
export const ChartPie = ic("ph:chart-pie-bold");
export const Gauge = ic("ph:gauge-bold");

// Calendar & Time
export const CalendarBlank = ic("ph:calendar-blank-bold");
export const CalendarCheck = ic("ph:calendar-check-bold");
export const Clock = ic("ph:clock-bold");
export const Timer = ic("ph:timer-bold");
export const ClockAlert = ic("ph:clock-countdown-bold");

// Users & People
export const Users = ic("ph:users-bold");
export const ArrowSquareOut = ic("ph:arrow-square-out-bold");

// Additional Game/UI icons
export const Newspaper = ic("ph:newspaper-bold");
export const Shield = ic("ph:shield-bold");
export const ShieldCheck = ic("ph:shield-check-bold");
export const Sword = ic("ph:sword-bold");
export const Flag = ic("ph:flag-bold");
export const Prohibit = ic("ph:prohibit-bold");
export const MapTrifold = ic("ph:map-trifold-bold");
export const Factory = ic("ph:factory-bold");
export const Buildings = ic("ph:buildings-bold");
export const Heart = ic("ph:heart-bold");
export const HeartBreak = ic("ph:heart-break-bold");
export const ShoppingCart = ic("ph:shopping-cart-bold");
export const MaskHappy = ic("ph:mask-happy-bold");
export const Scissors = ic("ph:scissors-bold");
export const GameController = ic("ph:game-controller-bold");
export const Palette = ic("ph:palette-bold");
export const Gem = ic("ph:diamond-bold");
export const Waves = ic("ph:waves-bold");
export const Siren = ic("ph:siren-bold");
export const PencilLine = ic("ph:pencil-line-bold");
export const Dice = ic("ph:dice-five-bold");

// Misc
export const Atom = ic("ph:atom-bold");
export const FlowArrow = ic("ph:flow-arrow-bold");
export const MagicWand = ic("ph:magic-wand-bold");
export const CheckSquare = ic("ph:check-square-bold");
export const Dot = ic("ph:circle-fill");
export const Waveform = ic("ph:waveform-bold");
export const ListChecks = ic("ph:list-checks-bold");
export const Gear = ic("ph:gear-bold");
export const Printer = ic("ph:printer-bold");
export const Link = ic("ph:link-bold");
export const CopySimple = ic("ph:copy-simple-bold");
export const QrCode = ic("ph:qr-code-bold");
export const Table = ic("ph:table-bold");
