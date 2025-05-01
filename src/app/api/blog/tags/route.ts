import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Revalidate every hour, or adjust as needed
export const revalidate = 3600;

export async function GET(request: Request) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blog_tags") // Cambiado a tabla de tags
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching blog tags API:", error);
    return NextResponse.json(
      { message: "Error fetching tags", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
