/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarImage } from "../ui/avatar";

export default async function Header() {
  const supabase = createClient();
  var admin = false;
  var logged = false;
  const { data } = await supabase.auth.getUser();
  var role = null;
  var avatarName = data?.user?.email;
  var avatar = null;
  if (data?.user) {
    logged = true;
    role = await supabase
      .from("user")
      .select("role, username, avatar")
      .eq("id", data?.user?.id);
    if (!role.error && role.data.length !== 0) {
      if (role.data[0].role === "admin") {
        admin = true;
      }
      if (role.data[0].username) avatarName = role.data[0].username;
      if (role.data[0].avatar) avatar = role.data[0].avatar;
    }
  }

  return (
    <header className="sticky top-0 w-full flex justify-between h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <svg
          width="33"
          height="35"
          viewBox="0 0 67 69"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M60.836 11.9604L48.251 8.62933V14.1518L59.4668 17.1199C60.8921 17.4989 61.7409 18.9643 61.3645 20.3842L50.4424 61.6732C50.0634 63.0905 48.598 63.9473 47.1727 63.571L38.5594 61.2915C38.2311 61.3235 37.9134 61.3903 37.5745 61.3903H18.6502C19.0826 61.5931 19.5311 61.7746 20.0088 61.9001L45.8114 68.7304C50.0874 69.8648 54.4701 67.3131 55.6018 63.0371L66.5266 21.7535C67.6557 17.4802 65.1093 13.0921 60.836 11.9604Z"
            fill="currentColor"
          ></path>
          <path
            d="M37.5744 0H8.21388C3.79378 0 0.206451 3.58733 0.206451 8.00743V50.7137C0.206451 55.1338 3.79378 58.7211 8.21388 58.7211H37.5744C41.9945 58.7211 45.5819 55.1338 45.5819 50.7137V8.00743C45.5819 3.58733 41.9945 0 37.5744 0ZM40.2436 50.7137C40.2436 52.1844 39.0451 53.3828 37.5744 53.3828H8.21388C6.74318 53.3828 5.54474 52.1844 5.54474 50.7137V8.00743C5.54474 6.53673 6.74318 5.33828 8.21388 5.33828H37.5744C39.0451 5.33828 40.2436 6.53673 40.2436 8.00743V50.7137ZM34.609 30.4656C34.609 34.1624 32.1347 36.5112 28.6008 36.5192C26.7724 36.5192 24.9227 35.2834 23.8737 34.2584C23.8737 34.2584 24.856 38.804 26.647 42.2418C26.8792 42.6876 19.0132 42.6983 19.2241 42.2472C20.967 38.5211 21.9439 34.2584 21.9439 34.2584C20.8923 35.2354 18.8744 36.5326 17.1849 36.5352C13.6589 36.5379 11.1686 34.1944 11.1633 30.503C11.1579 24.3159 22.8328 16.2044 22.8328 16.2044H22.8968C22.8968 16.2044 34.5983 24.2839 34.609 30.4656ZM34.7558 8.37043C34.7105 8.25833 34.6704 8.16758 34.617 8.10352C34.5637 8.03946 34.4542 8.00743 34.2887 8.00743H32.77C32.6072 8.00743 32.4977 8.03946 32.4444 8.09818C32.3883 8.15423 32.3403 8.24231 32.3002 8.35442L29.9781 15.7026C29.9327 15.8414 29.93 15.9241 29.9621 15.9615C29.9941 15.9988 30.0581 16.0149 30.1462 16.0149H31.4808C31.5982 16.0149 31.6836 15.9855 31.7504 15.9401C31.8118 15.8921 31.8651 15.8093 31.9052 15.6785L32.3376 14.2078H34.7345L35.1322 15.6412C35.1722 15.7666 35.2123 15.8654 35.2603 15.9214C35.3057 15.9828 35.4018 16.0149 35.5379 16.0149H37.0326C37.1207 16.0149 37.1741 15.9855 37.1901 15.9401C37.2061 15.8947 37.2061 15.8253 37.1767 15.7266L34.7558 8.37043ZM32.746 12.7532L33.1063 11.4079L33.504 9.94523H33.5601L33.9497 11.4186L34.3101 12.7532H32.746V12.7532ZM14.1847 42.7063C14.046 42.7063 13.9525 42.7383 13.9072 42.797C13.8591 42.8558 13.8191 42.9545 13.779 43.08L13.3813 44.5133H10.9818L10.5494 43.0426C10.5093 42.9118 10.4586 42.8291 10.3946 42.781C10.3305 42.7356 10.2451 42.7063 10.1277 42.7063H8.79308C8.705 42.7063 8.64094 42.725 8.61158 42.7623C8.58222 42.7997 8.58222 42.8824 8.6276 43.0212L10.9497 50.3694C10.9898 50.4815 11.0378 50.5669 11.0939 50.6256C11.1473 50.6817 11.2567 50.7137 11.4168 50.7137H12.9329C13.1011 50.7137 13.2105 50.6817 13.2639 50.6176C13.3173 50.5562 13.3573 50.4628 13.4027 50.3507L15.8209 42.9945C15.8503 42.8958 15.8503 42.8264 15.8343 42.781C15.8183 42.7356 15.7676 42.7063 15.6795 42.7063H14.1847ZM12.5993 47.3025L12.2096 48.7759H12.1535L11.7558 47.3132L11.3955 45.968H12.9596L12.5993 47.3025Z"
            fill="currentColor"
          ></path>
          <path
            d="M55.9702 19.3753C55.9595 19.2552 55.9382 19.1591 55.9088 19.0844C55.8714 19.007 55.7727 18.9482 55.6125 18.9082L54.1472 18.5132C53.995 18.4705 53.8803 18.4705 53.8135 18.5132C53.7415 18.5585 53.6721 18.6279 53.608 18.724L49.4495 25.21C49.3667 25.3355 49.3454 25.4102 49.3667 25.4583C49.3854 25.501 49.4388 25.533 49.5269 25.557L50.8161 25.9067C50.9282 25.9361 51.0189 25.9334 51.0937 25.9014C51.1657 25.8747 51.2405 25.8079 51.3126 25.6932L52.1133 24.3853L54.4274 25.0099L54.4408 26.4992C54.4408 26.63 54.4595 26.7368 54.4888 26.8035C54.5209 26.8756 54.6009 26.929 54.7371 26.9663L56.1784 27.356C56.2638 27.3801 56.3225 27.3694 56.3492 27.324C56.3759 27.284 56.3919 27.2172 56.3919 27.1158L55.9702 19.3753ZM52.8873 23.0854L53.5867 21.8763L54.3527 20.5711L54.4061 20.5871L54.3981 22.1085L54.3954 23.4938L52.8873 23.0854Z"
            fill="currentColor"
          ></path>
        </svg>
        <h1 className="w-[180px]">Torneos Poker Live</h1>
      </Link>
      <div className="flex md:w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              {logged && (
                <Avatar>
                  <AvatarImage
                    src={
                      avatar
                        ? `https://wsrv.nl/?url=${avatar}&w=100&h=100&fit=cover&mask=circle`
                        : `https://ui-avatars.com/api/?name=${avatarName}&s=100&background=random`
                    }
                  />
                </Avatar>
              )}
              {!logged && <CircleUser className="h-5 w-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!logged && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/">Login</Link>
                </DropdownMenuItem>
              </>
            )}
            {admin && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
            )}
            {logged && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action="/auth/signout" method="post">
                    <button className="button block" type="submit">
                      Salir
                    </button>
                  </form>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
