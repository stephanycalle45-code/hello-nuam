// src/utils/formatDate.js
export function formatDateISO(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}
