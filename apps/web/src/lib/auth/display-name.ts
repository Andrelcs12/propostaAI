import type { User as SupabaseUser } from "@supabase/supabase-js";

export function getUserDisplayName(user: SupabaseUser) {
  const metadata = user.user_metadata;
  const email = user.email ?? "";

  const fullName =
    typeof metadata?.name === "string" && metadata.name.trim()
      ? metadata.name.trim()
      : typeof metadata?.full_name === "string" && metadata.full_name.trim()
        ? metadata.full_name.trim()
        : email.split("@")[0] || "por aqui";

  return fullName.split(/\s+/)[0] ?? fullName;
}

export function getUserFullName(user: SupabaseUser) {
  const metadata = user.user_metadata;
  const email = user.email ?? "";

  if (typeof metadata?.name === "string" && metadata.name.trim()) {
    return metadata.name.trim();
  }

  if (typeof metadata?.full_name === "string" && metadata.full_name.trim()) {
    return metadata.full_name.trim();
  }

  return email.split("@")[0] || "Usuario";
}

export function getUserAvatarUrl(user: SupabaseUser) {
  const metadata = user.user_metadata;

  if (typeof metadata?.avatar_url === "string" && metadata.avatar_url.trim()) {
    return metadata.avatar_url;
  }

  if (typeof metadata?.picture === "string" && metadata.picture.trim()) {
    return metadata.picture;
  }

  return null;
}

export function getUserInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
