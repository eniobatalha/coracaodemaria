"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Download, Loader2, X } from "lucide-react"
import type { GalleryItem } from "@/lib/portal/types"

type Props = {
  items: GalleryItem[]
  initialIndex: number
  onClose: () => void
}

export function Lightbox({ items, initialIndex, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex)
  const [downloading, setDownloading] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)

  const item = items[current]

  const goPrev = useCallback(() => {
    setImgLoaded(false)
    setCurrent((i) => Math.max(0, i - 1))
  }, [])

  const goNext = useCallback(() => {
    setImgLoaded(false)
    setCurrent((i) => Math.min(items.length - 1, i + 1))
  }, [items.length])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, goPrev, goNext])

  // Scroll active thumbnail into view
  useEffect(() => {
    const container = thumbsRef.current
    if (!container) return
    const thumb = container.children[current] as HTMLElement | undefined
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }, [current])

  // Touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) delta > 0 ? goNext() : goPrev()
    touchStartX.current = null
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await fetch(item.src)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `foto-${item.id}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      window.open(item.src, "_blank")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Top bar ── */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <span className="text-sm font-bold text-white/60">
          {current + 1} / {items.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50"
            aria-label="Baixar foto"
          >
            {downloading
              ? <Loader2 size={18} className="animate-spin" />
              : <Download size={18} />}
          </button>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Image area ── */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={36} className="animate-spin text-white/40" />
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={item.src}
          src={item.src}
          alt={item.caption ?? `Foto ${current + 1}`}
          onLoad={() => setImgLoaded(true)}
          className={`max-h-full max-w-full object-contain transition-opacity duration-200 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Prev arrow */}
        {current > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 md:left-4"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Next arrow */}
        {current < items.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 md:right-4"
            aria-label="Próxima foto"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* ── Caption ── */}
      {item.caption && (
        <p className="shrink-0 px-4 py-2 text-center text-sm text-white/60">
          {item.caption}
        </p>
      )}

      {/* ── Thumbnail strip ── */}
      <div
        ref={thumbsRef}
        className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3 no-scrollbar"
      >
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={() => { setImgLoaded(false); setCurrent(i) }}
            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition ${
              i === current
                ? "ring-2 ring-white"
                : "opacity-40 hover:opacity-70"
            }`}
            aria-label={`Ver foto ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.thumbnail}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
