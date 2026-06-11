import { ReactNode, useEffect, useState } from 'react'
import Box from '@mui/material/Box'

// ─────────────────────────────────────────────────────────────────────────────
// Asset resolver — single source of truth for every asset URL.
//
// All asset references go through `asset()`, which prefixes a configurable base.
// By default it points at the bundled files under /public/assets (served at
// /assets/...), so the prototype works with no setup.
//
// To serve assets remotely later (CDN / asset server) — no component changes
// required — set VITE_ASSET_BASE_URL in a .env file, e.g.
//   VITE_ASSET_BASE_URL=https://cdn.weloan365.com/app-assets
//
// If assets must come from a backend/CMS at runtime, this module is the only
// place to swap: replace the maps below with values fetched from your API.
// ─────────────────────────────────────────────────────────────────────────────
const ASSET_BASE = (import.meta.env.VITE_ASSET_BASE_URL ?? '/assets').replace(/\/+$/, '')

/** Resolve a relative asset path (e.g. "icons/ico_home.svg") to a full URL. */
export function asset(path: string): string {
  // Pass through absolute URLs (http(s):// or protocol-relative) untouched.
  if (/^(https?:)?\/\//.test(path)) return path
  return `${ASSET_BASE}/${path.replace(/^\/+/, '')}`
}

/** Map a record of relative paths to resolved URLs (keeps key names/types). */
function mapAssets<T extends Record<string, string>>(paths: T): { [K in keyof T]: string } {
  const out = {} as { [K in keyof T]: string }
  for (const key in paths) out[key] = asset(paths[key])
  return out
}

export const BANNERS = mapAssets({
  micro: 'banners/micro.png',
  smallBusiness: 'banners/small-business.png',
  housing: 'banners/housing.png',
  enterprise: 'banners/enterprise-sme.png',
  migrant: 'banners/migrant-worker.png',
  // Popular Loan Products photo banners (reuse existing banner photos)
  productSme: 'banners/enterprise-sme.png',
  productHousing: 'banners/housing.png',
  productAgri: 'banners/micro.png',
  productSmallBiz: 'banners/small-business.png',
  // Sample 1 product thumbnails (rate + Khmer label baked into the image)
  microS1: 'banners/Mico_Sample1.png',
  smallS1: 'banners/Small_Sample1.png',
  housingS1: 'banners/Housing_Sample1.png',
  smeS1: 'banners/SME_Sample1.png',
  mwlS1: 'banners/MWL_Sample1.png',
})

export const ILLUS = mapAssets({
  briefcase: 'illustrations/briefcase-coins.png',
  money: 'illustrations/money-stack.png',
  airplane: 'illustrations/airplane.png',
  mwl: 'illustrations/mwl.svg',
  orb: 'illustrations/orb.png',
  avatar: 'illustrations/orb-avatar.svg',
  avatar01: 'illustrations/Avatar_01.png',
})

export const DISCOVER = mapAssets({
  calculator: 'discover/calculator.png',
})

export const BANKS = mapAssets({
  khqr: 'banks/ico_khqr.png',
  khqrCard: 'banks/KHQR.svg',
  aba: 'banks/ABA.png',
  acleda: 'banks/Aceleda.png',
  ppcb: 'banks/PPCB.png',
  wing: 'banks/Wing.png',
})

// ─────────────────────────────────────────────────────────────────────────────
// MaskIcon — renders an SVG via CSS mask so it can be tinted to ANY color.
// Preloads the source and, if it can't be fetched, degrades to an empty
// same-size box (instead of a solid colored square) so missing icons stay clean.
// ─────────────────────────────────────────────────────────────────────────────
export function MaskIcon({ src, size = 24, color = 'currentColor' }: { src: string; size?: number; color?: string }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
    if (!src) {
      setFailed(true)
      return
    }
    const img = new Image()
    img.onerror = () => setFailed(true)
    img.src = src
  }, [src])

  // Reserve the same space but render nothing if the mask file is unavailable.
  if (failed) return <Box component="span" sx={{ display: 'inline-block', width: size, height: size }} />

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        width: size,
        height: size,
        bgcolor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AssetImg — <img> that falls back to a placeholder node if the file is missing.
// Lets the prototype work before the real raster assets are dropped in.
// ─────────────────────────────────────────────────────────────────────────────
export function AssetImg({
  src,
  alt,
  fallback,
  sx,
}: {
  src?: string
  alt?: string
  fallback: ReactNode
  sx?: object
}) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <>{fallback}</>
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      sx={{ display: 'block', ...sx }}
    />
  )
}
