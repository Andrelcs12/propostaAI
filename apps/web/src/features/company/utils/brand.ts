export function getReadableTextColor(hexColor: string) {
  const normalized = hexColor.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.58 ? "#0F172A" : "#FFFFFF";
}

export function getRadiusValue(size: string) {
  if (size === "SMALL") {
    return "6px";
  }

  if (size === "LARGE") {
    return "18px";
  }

  return "10px";
}

export function getFontFamily(preference: string) {
  switch (preference) {
    case "MANROPE":
      return '"Manrope", ui-sans-serif, system-ui, sans-serif';
    case "POPPINS":
      return '"Poppins", ui-sans-serif, system-ui, sans-serif';
    case "DM_SANS":
      return '"DM Sans", ui-sans-serif, system-ui, sans-serif';
    default:
      return '"Inter", ui-sans-serif, system-ui, sans-serif';
  }
}

export type TemplateLayout = {
  headerClass: string;
  cardClass: string;
  titleClass: string;
  sectionTitleClass: string;
  accentBar?: boolean;
  gradientHeader?: boolean;
  boldBlocks?: boolean;
};

export function getTemplateLayout(visualStyle: string): TemplateLayout {
  switch (visualStyle) {
    case "MODERN":
      return {
        headerClass: "border-b px-6 py-6",
        cardClass: "space-y-6 px-6 py-6",
        titleClass: "text-2xl font-semibold tracking-tight",
        sectionTitleClass: "mb-2 text-xs font-semibold uppercase tracking-[0.2em]",
        accentBar: true,
        gradientHeader: true,
      };
    case "PREMIUM":
      return {
        headerClass: "border-b px-8 py-8",
        cardClass: "space-y-8 px-8 py-8",
        titleClass: "text-3xl font-medium tracking-tight",
        sectionTitleClass: "mb-3 text-sm font-medium uppercase tracking-[0.25em]",
        accentBar: false,
      };
    case "BOLD":
      return {
        headerClass: "px-6 py-6",
        cardClass: "space-y-5 px-6 py-6",
        titleClass: "text-3xl font-bold uppercase tracking-tight",
        sectionTitleClass: "mb-2 text-sm font-bold uppercase tracking-wide",
        boldBlocks: true,
      };
    default:
      return {
        headerClass: "border-b px-6 py-5",
        cardClass: "space-y-6 px-6 py-6",
        titleClass: "text-xl font-semibold",
        sectionTitleClass: "mb-2 text-sm font-semibold uppercase tracking-wide",
      };
  }
}

export type BrandColors = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
};

export type BrandStyle = BrandColors & {
  borderRadius: string;
  fontPreference: string;
  visualStyle: string;
};
