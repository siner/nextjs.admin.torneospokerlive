"use client";

import { Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CasinoStar({
  casinoId,
  userId,
  isStarred,
}: {
  casinoId: string;
  userId: string;
  isStarred: boolean;
}) {
  const [starred, setStarred] = useState(isStarred);

  const supabase = createClient();

  const starCasino = useCallback(
    async (e: any) => {
      e.preventDefault();
      try {
        if (starred) {
          await supabase
            .from("casino_stars")
            .delete()
            .eq("casino_id", casinoId)
            .eq("user_id", userId);
        } else {
          await supabase.from("casino_stars").insert([
            {
              casino_id: casinoId,
              user_id: userId,
            },
          ]);
        }
        setStarred(!starred);
      } catch (error) {
        console.error("Error starring casino", error);
      }
    },
    [starred, casinoId, userId, supabase]
  );

  return (
    <div className={`${starred ? "text-red-500" : ""} hover:text-red-500`}>
      <Star
        className="h-6 w-6 drop-shaddow-lg"
        onClick={(e) => starCasino(e)}
      />
    </div>
  );
}
