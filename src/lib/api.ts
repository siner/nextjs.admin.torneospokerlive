import { createClient } from "@/lib/supabase/server";

export async function getAllTournaments() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tournament")
    .select("*, casinoId, casino:Casino(*), event:Event(*, tour:Tour(*))")
    .order("date", { ascending: false })
    .order("time", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTournamentById(id: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tournament")
    .select(
      "*, casino:Casino(*), event:Event(*, casino:Casino(*), tour:Tour(*))"
    )
    .eq("id", id);
  if (error) throw error;
  return data[0];
}

export async function getAllCasinos() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Casino")
    .select("*, casino_stars(*)")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getCasinoById(casinoId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Casino")
    .select("*")
    .eq("id", casinoId);
  if (error) throw error;
  return data[0];
}

export async function getAllTours() {
  const supabase = createClient();
  const { data, error } = await supabase.from("Tour").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function getTourById(tourId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tour")
    .select("*")
    .eq("id", tourId);
  if (error) throw error;
  return data[0];
}

export async function getEventById(eventId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Event")
    .select("*, tour:Tour(*), casino:Casino(*)")
    .eq("id", eventId);
  if (error) throw error;
  return data[0];
}

export async function getAllEvents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Event")
    .select("*, tour:Tour(*), casino:Casino(*)")
    .order("from", { ascending: false });
  if (error) throw error;
  return data;
}

// Admin

export async function getAllUsers() {
  const supabase = createClient();
  const { data, error } = await supabase.from("user").select("*");
  if (error) throw error;
  return data;
}

export async function getUserById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("user").select("*").eq("id", id);
  if (error) throw error;
  return data[0];
}
