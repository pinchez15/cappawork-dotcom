import { Handshake, Trophy } from "lucide-react";
import { CATEGORIES } from "@/server/repos/bd-catalysts";

type TopCatalyst = {
  id: string;
  name: string;
  company: string | null;
  category: string;
  count: number;
  wonCount: number;
  totalValue: number;
};

type Props = {
  catalysts: TopCatalyst[];
};

export function TopCatalysts({ catalysts }: Props) {
  if (catalysts.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Handshake className="h-4 w-4 text-stone-400" />
          <span className="text-sm font-bold text-stone-900">
            Top Catalysts
          </span>
        </div>
        <p className="text-xs text-stone-400">
          Link catalysts to deals to see who sends the most referrals.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Handshake className="h-4 w-4 text-stone-400" />
        <span className="text-sm font-bold text-stone-900">
          Top Catalysts
        </span>
      </div>
      <div className="space-y-2.5">
        {catalysts.map((c, i) => {
          const cat = CATEGORIES.find((x) => x.value === c.category);
          return (
            <div key={c.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-300 w-4 text-right shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-900 truncate">
                  {c.name}
                </div>
                <div className="text-[11px] text-stone-400 truncate">
                  {c.company && <span>{c.company}</span>}
                  {c.company && cat && <span> · </span>}
                  {cat && <span>{cat.label}</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-stone-900">
                  {c.count} deal{c.count !== 1 ? "s" : ""}
                </div>
                {c.wonCount > 0 && (
                  <div className="flex items-center gap-0.5 text-[11px] text-green-600 justify-end">
                    <Trophy className="h-2.5 w-2.5" />
                    {c.wonCount} won
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
