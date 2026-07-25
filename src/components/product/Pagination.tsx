import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Pagination({
  page,
  pageCount,
  basePath,
  searchParams,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "pagina") params.set(key, value);
    }
    if (targetPage > 1) params.set("pagina", String(targetPage));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Paginação"
      className="mt-10 flex items-center justify-center gap-2"
    >
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-sm",
            p === page
              ? "bg-jetta-blue text-jetta-black font-semibold"
              : "text-jetta-metal hover:text-jetta-blue",
          )}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
