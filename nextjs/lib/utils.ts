export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, (e) => {
    const map: Record<string, string> = {
      "&amp;": "&", "&lt;": "<", "&gt;": ">",
      "&quot;": '"', "&apos;": "'", "&nbsp;": " ",
    };
    return map[e] ?? e;
  }).trim();
}

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e?.message);
    }
    return false;
  }
  return true;
};

export const isJsonDecode = (str: string) => {
  try {
    JSON.stringify(str);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e?.message);
    }
    return false;
  }
  return true;
};
