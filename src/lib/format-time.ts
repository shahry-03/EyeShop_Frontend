// ============================================================
//  Relative time formatting — "2 minutes ago", "3 days ago"
// ============================================================
export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "Unknown";

  const date = new Date(iso);
  if (isNaN(date.getTime())) return "Unknown";

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  // Future date
  if (diffSec < 0) return "Just now";

  if (diffSec < 30) return "Just now";
  if (diffSec < 60) return `${diffSec} seconds ago`;

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;

  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  const diffMonths = Math.round(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}

export const formatTimeAgo = formatRelativeTime;

// ============================================================
//  Format absolute date — "Oct 5, 2026"
// ============================================================
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Unknown";

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// ============================================================
//  Format date and time — "Oct 5, 2026, 04:30 PM"
// ============================================================
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Unknown";

  const dateStr = formatDate(iso);
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return `${dateStr}, ${formattedHours}:${minutes} ${ampm}`;
}