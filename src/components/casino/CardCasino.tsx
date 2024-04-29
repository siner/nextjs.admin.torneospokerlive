import { CasinoStar } from "./CasinoStar";
import { createClient } from "@/lib/supabase/server";

/* eslint-disable @next/next/no-img-element */
export default async function CardCasino({ casino }: { casino: any }) {
  const supabase = createClient();

  const user = await supabase.auth.getUser();
  var isStarred = false;
  var userId: string | null | undefined = null;

  if (user) {
    userId = user.data?.user?.id;
    const casino_stars = casino.casino_stars;
    if (casino_stars) {
      casino_stars.forEach((casino_star: any) => {
        if (casino_star.user_id === userId) {
          isStarred = true;
        }
      });
    }
  }

  const bg = casino.color;
  return (
    <a href={"/casinos/" + casino.slug} className="block">
      <div className="card w-full bg-base-100 shadow-xl">
        <figure className="h-32 md:h-40" style={{ backgroundColor: bg }}>
          <img
            className="mx-auto"
            src={`https://wsrv.nl/?url=${casino.logo}&w=200&h=150&fit=contain`}
            alt={casino.nombre}
          />
        </figure>
        <div className="card-body flex items-center justify-center text-center p-4 space-x-4 md:p-8">
          {userId && (
            <CasinoStar
              casinoId={casino.id}
              userId={userId}
              isStarred={isStarred}
            />
          )}
          <h2 className="card-title">{casino.name}</h2>
        </div>
      </div>
    </a>
  );
}
