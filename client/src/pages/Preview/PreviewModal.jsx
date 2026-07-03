import "./PreviewModal.css";

import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { FaXmark, FaDownload, FaShuffle } from "react-icons/fa6";

const TEXT_COLORS = [
{ label: "Ink", value: "#1f1a17" },
{ label: "Sepia", value: "#6a4d3b" },
{ label: "Red", value: "#a73d3d" },
{ label: "Blue", value: "#315b8a" },
{ label: "Forest", value: "#3f6b4f" },
];

const BG_COLORS = [
{ label: "Warm", value: "#fff8eb" },
{ label: "Cream", value: "#f7efde" },
{ label: "Soft", value: "#f1e5c7" },
{ label: "Paper", value: "#fffdf7" },
];

function mulberry32(seed) {
let value = seed;
return function random() {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}

export default function PreviewModal({ open, onClose, photos }) {
const [mode, setMode] = useState("polaroid");
const [textMode, setTextMode] = useState("both");
const [showDate, setShowDate] = useState(true);
const [showCaption, setShowCaption] = useState(true);
const [showStatement, setShowStatement] = useState(false);
const [dateText, setDateText] = useState("");
const [caption, setCaption] = useState("");
const [statement, setStatement] = useState("");
const [textColor, setTextColor] = useState(TEXT_COLORS[0].value);
const [backgroundColor, setBackgroundColor] = useState(BG_COLORS[0].value);
const [downloading, setDownloading] = useState(false);
const [moodSeed, setMoodSeed] = useState(() => Date.now());

const exportRef = useRef(null);

const completePhotos = useMemo(
    () => photos.filter((slot) => slot && slot.host && slot.guest),
    [photos]
);

const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 720px)").matches;

useEffect(() => {
    if (!open) return;
    setDateText(new Date().toLocaleDateString());
    setMoodSeed(Date.now());
}, [open]);

useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
    if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
}, [open, onClose]);

useEffect(() => {
    if (textMode === "date") {
    setShowDate(true);
    setShowCaption(false);
    setShowStatement(false);
    }
    if (textMode === "caption") {
    setShowDate(false);
    setShowCaption(true);
    setShowStatement(false);
    }
    if (textMode === "both") {
    setShowDate(true);
    setShowCaption(true);
    setShowStatement(false);
    }
    if (textMode === "statement") {
    setShowDate(false);
    setShowCaption(false);
    setShowStatement(true);
    }
}, [textMode]);

if (!open) return null;

const handleDownload = async () => {
    if (!exportRef.current || !completePhotos.length) return;

    setDownloading(true);
    try {
    const canvas = await html2canvas(exportRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
    });

    const link = document.createElement("a");
    link.download = `FrameTogether-${mode}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    } finally {
    setDownloading(false);
    }
};

const refreshMoodBoard = () => {
    setMoodSeed(Date.now());
};

return (
    <div className="preview-modal-backdrop" onClick={onClose}>
    <div className="preview-modal" onClick={(event) => event.stopPropagation()}>
        <header className="preview-modal-header">
        <div>
            <p className="preview-kicker">Create Together Image</p>
            <h2>Build your print</h2>
        </div>

        <button className="preview-close" onClick={onClose} aria-label="Close">
            <FaXmark />
        </button>
        </header>

        <div className="preview-modal-body">
        <aside className="preview-editor">
            <div className="mode-switch">
            <button
                type="button"
                className={mode === "polaroid" ? "active" : ""}
                onClick={() => setMode("polaroid")}
            >
                Polaroid
            </button>
            <button
                type="button"
                className={mode === "moodboard" ? "active" : ""}
                onClick={() => {
                setMode("moodboard");
                setMoodSeed(Date.now());
                }}
            >
                Mood Board
            </button>
            </div>

            <div className="tactile-group">
            <button
                type="button"
                className={textMode === "date" ? "toggle active" : "toggle"}
                onClick={() => setTextMode("date")}
            >
                Date Only
            </button>
            <button
                type="button"
                className={textMode === "caption" ? "toggle active" : "toggle"}
                onClick={() => setTextMode("caption")}
            >
                Caption Only
            </button>
            <button
                type="button"
                className={textMode === "both" ? "toggle active" : "toggle"}
                onClick={() => setTextMode("both")}
            >
                Date + Caption
            </button>
            <button
                type="button"
                className={textMode === "statement" ? "toggle active" : "toggle"}
                onClick={() => setTextMode("statement")}
            >
                Statement
            </button>
            </div>

            {showDate && (
            <label className="field handwritten handwritten-date">
                <span>Date</span>
                <input
                value={dateText}
                onChange={(e) => setDateText(e.target.value)}
                placeholder="July 3, 2026"
                />
            </label>
            )}

            {showCaption && (
            <label className="field handwritten handwritten-caption">
                <span>Caption</span>
                <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="A short caption"
                />
            </label>
            )}

            {showStatement && (
            <label className="field handwritten handwritten-statement">
                <span>Statement</span>
                <textarea
                rows={4}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="A note or thought"
                />
            </label>
            )}

            <div className="color-group">
            <div className="color-block">
                <span className="color-label">Handwriting</span>
                <div className="swatch-row">
                {TEXT_COLORS.map((color) => (
                    <button
                    key={color.value}
                    type="button"
                    className={`swatch ${textColor === color.value ? "active" : ""}`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.label}
                    onClick={() => setTextColor(color.value)}
                    />
                ))}
                </div>
            </div>

            <div className="color-block">
                <span className="color-label">Background</span>
                <div className="swatch-row">
                {BG_COLORS.map((color) => (
                    <button
                    key={color.value}
                    type="button"
                    className={`swatch ${backgroundColor === color.value ? "active" : ""}`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.label}
                    onClick={() => setBackgroundColor(color.value)}
                    />
                ))}
                </div>
            </div>
            </div>

            <div className="actions">
            <button
                type="button"
                className="shuffle-btn"
                onClick={refreshMoodBoard}
            >
                <FaShuffle />
                Shuffle Mood Board
            </button>

            {isMobile ? (
                <p className="mobile-note">Download is available on desktop only.</p>
            ) : (
                <button
                type="button"
                className="download-btn"
                onClick={handleDownload}
                disabled={downloading || !completePhotos.length}
                >
                <FaDownload />
                {downloading ? "Preparing..." : "Download"}
                </button>
            )}
            </div>
        </aside>

        <section className="preview-stage">
            <div
            ref={exportRef}
            className={mode === "polaroid" ? "polaroid-shell" : "moodboard-shell"}
            style={{ backgroundColor }}
            >
            {mode === "polaroid" ? (
                <PolaroidPreview
                photos={completePhotos}
                dateText={showDate ? dateText : ""}
                caption={showCaption ? caption : ""}
                statement={showStatement ? statement : ""}
                textColor={textColor}
                />
            ) : (
                <MoodBoardPreview
                photos={completePhotos}
                dateText={showDate ? dateText : ""}
                caption={showCaption ? caption : ""}
                statement={showStatement ? statement : ""}
                textColor={textColor}
                seed={moodSeed}
                />
            )}
            </div>
        </section>
        </div>
    </div>
    </div>
);
}

function PolaroidPreview({ photos, dateText, caption, statement, textColor }) {
return (
    <div className="polaroid-inner" style={{ color: textColor }}>
    <div className="polaroid-frame-top handwritten handwritten-date">
        <span>{caption || ""}</span>
        <span>{dateText || ""}</span>
    </div>

    <div className="polaroid-strip">
        {photos.map((slot, index) => (
        <div className="strip-row" key={index}>
            <img src={slot.host} alt={`Host ${index + 1}`} />
            <img src={slot.guest} alt={`Guest ${index + 1}`} />
        </div>
        ))}
    </div>

    <div className="polaroid-frame-bottom handwritten handwritten-caption">
        <p>{statement || "Two cameras, one memory."}</p>
    </div>
    </div>
);
}

function MoodBoardPreview({ photos, dateText, caption, statement, textColor, seed }) {
const cards = useMemo(() => {
    const rng = mulberry32(seed);

    const templates = [
    { left: 4, top: 8, width: 40, height: 28, rotate: -8 },
    { left: 36, top: 14, width: 22, height: 18, rotate: 7 },
    { left: 58, top: 10, width: 18, height: 22, rotate: -4 },
    { left: 12, top: 42, width: 28, height: 20, rotate: 5 },
    ];

    return photos.map((slot, index) => {
    const base = templates[index % templates.length];
    const jitterX = (rng() - 0.5) * 8;
    const jitterY = (rng() - 0.5) * 8;
    const jitterRotate = (rng() - 0.5) * 12;
    const sizeBoost = (rng() - 0.5) * 10;
    const shadowLift = rng();

    return {
        slot,
        left: `${base.left + jitterX}%`,
        top: `${base.top + jitterY}%`,
        width: `${Math.max(16, base.width + sizeBoost)}%`,
        height: `${Math.max(14, base.height + sizeBoost * 0.7)}%`,
        rotate: base.rotate + jitterRotate,
        zIndex: 10 + index,
        shadow: shadowLift,
    };
    });
}, [photos, seed]);

return (
    <div className="moodboard-inner" style={{ color: textColor }}>
    <div className="moodboard-note handwritten handwritten-date">
        {caption && <strong>{caption}</strong>}
        {dateText && <span>{dateText}</span>}
    </div>

    <div className="moodboard-canvas">
        {cards.map((card, index) => (
        <div
            key={index}
            className="mood-card mood-card-taped"
            style={{
            left: card.left,
            top: card.top,
            width: card.width,
            height: card.height,
            zIndex: card.zIndex,
            transform: `rotate(${card.rotate}deg)`,
            boxShadow: `0 ${10 + card.shadow * 10}px ${18 + card.shadow * 16}px rgba(31, 26, 23, ${0.12 + card.shadow * 0.12})`,
            }}
        >
            <div className="tape tape-left" />
            <div className="tape tape-right" />
            <div className="mood-pair">
            <img src={card.slot.host} alt={`Host ${index + 1}`} />
            <img src={card.slot.guest} alt={`Guest ${index + 1}`} />
            </div>
        </div>
        ))}
    </div>

    <div className="moodboard-footer handwritten handwritten-caption">
        {statement || "Random, warm, and a little chaotic."}
    </div>
    </div>
);
}