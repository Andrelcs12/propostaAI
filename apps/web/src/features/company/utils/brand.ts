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
