import { cn } from "@/lib/utils";

/**
 * Asset naming:
 * - `light` → for light backgrounds (dark wordmark)
 * - `dark`  → for dark / saturated backgrounds (light wordmark)
 */
const BRAND = {
  full: {
    light: {
      src: "/brand/nilescart_full_light.png",
      width: 1526,
      height: 423,
    },
    dark: {
      src: "/brand/nilescart_full_dark.png",
      width: 1526,
      height: 422,
    },
  },
  icon: {
    light: {
      src: "/brand/nilescart_icon_light.png",
      width: 557,
      height: 423,
    },
    dark: {
      src: "/brand/nilescart_icon_dark.png",
      width: 557,
      height: 422,
    },
  },
};

function LogoImage({ asset, className, alt = "" }) {
  return (
    <img
      src={asset.src}
      alt={alt}
      width={asset.width}
      height={asset.height}
      className={className}
      decoding="async"
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.compact] Icon-only mark
 * @param {string} [props.subtitle] Optional label beside the mark (e.g. Admin Panel)
 * @param {"light"|"dark"|"auto"} [props.variant]
 *   - light: assets for light backgrounds (default)
 *   - dark: assets for dark / amber panels
 *   - auto: swap with `.dark` parent via CSS
 */
export function BrandLogo({
  className,
  compact = false,
  subtitle,
  variant = "light",
}) {
  const kind = compact ? "icon" : "full";
  const heightClass = compact
    ? "h-8 w-auto"
    : "h-7 w-auto sm:h-8";

  const subtitleClass = cn(
    "text-[10px] font-medium uppercase tracking-[0.2em]",
    variant === "dark" && "text-brand-white/80",
    variant === "light" && "text-brand-gray",
    variant === "auto" && "text-brand-gray dark:text-brand-white/80"
  );

  return (
    <div
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="Nilescart"
    >
      {variant === "auto" ? (
        <>
          <LogoImage
            asset={BRAND[kind].light}
            className={cn(heightClass, "dark:hidden")}
            alt=""
          />
          <LogoImage
            asset={BRAND[kind].dark}
            className={cn(heightClass, "hidden dark:block")}
            alt=""
          />
        </>
      ) : (
        <LogoImage
          asset={BRAND[kind][variant] || BRAND[kind].light}
          className={heightClass}
          alt=""
        />
      )}

      {subtitle && !compact && (
        <span className={cn("min-w-0 leading-none", subtitleClass)}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
