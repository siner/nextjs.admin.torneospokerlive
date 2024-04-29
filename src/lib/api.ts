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

export async function getSearchTournaments(
  search: string | string[] | undefined
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tournament")
    .select("*, casino:Casino(*), event:Event(*, tour:Tour(*))")
    .ilike("name", `%${search}%`)
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })
    .order("time", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getSearchEvents(search: string | string[] | undefined) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Event")
    .select("*, casino:Casino(*), tour:Tour(*)")
    .ilike("name", `%${search}%`)
    .order("from", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getSearchCasinos(search: string | string[] | undefined) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Casino")
    .select("*")
    .ilike("name", `%${search}%`);
  if (error) throw error;
  return data;
}

export async function getSearchTours(search: string | string[] | undefined) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tour")
    .select("*")
    .ilike("name", `%${search}%`);
  if (error) throw error;
  return data;
}

export async function getTodayTournaments() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tournament")
    .select("*, casino:Casino(*), event:Event(*, tour:Tour(*))")
    .eq("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: false })
    .order("time", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTomorrowTournaments() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tournament")
    .select("*, casino:Casino(*), event:Event(*, tour:Tour(*))")
    .eq(
      "date",
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    )
    .order("date", { ascending: false })
    .order("time", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getNextTournaments() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tournament")
    .select(
      "*, casino:Casino(*), event:Event(*, casino:Casino(*), tour:Tour(*))"
    )
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })
    .order("time", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getMyCasinosNextTournaments(userId: string) {
  const supabase = createClient();
  const { data: casinos, error: casinos_error } = await supabase
    .from("casino_stars")
    .select("casino_id")
    .eq("user_id", userId);

  const { data, error } = await supabase
    .from("Tournament")
    .select(
      "*, casino:Casino(*), event:Event(*, casino:Casino(*), tour:Tour(*))"
    )
    .in("casinoId", casinos?.map((c: any) => c.casino_id) || [])
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })
    .order("time", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTournament(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tournament")
    .select(
      "*, casino:Casino(*), event:Event(*, casino:Casino(*), tour:Tour(*))"
    )
    .eq("slug", slug);
  if (error) throw error;
  return data[0];
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

export async function getCasino(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Casino")
    .select("*, casino_stars(*)")
    .eq("slug", slug);
  if (error) throw error;

  return data[0];
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

export async function getEventsByCasino(casinoId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Event")
    .select("*")
    .eq("casinoId", casinoId);
  if (error) throw error;
  return data;
}

export async function getNextTorneosByCasino(casinoId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tournament")
    .select("*, casino:Casino(*), event:Event(*, tour:Tour(*))")
    .eq("casinoId", casinoId)
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })
    .order("time", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllTours() {
  const supabase = createClient();
  const { data, error } = await supabase.from("Tour").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function getTour(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tour")
    .select("*")
    .eq("slug", slug);
  if (error) throw error;
  return data[0];
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

export async function getEventsByTour(tourId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Event")
    .select("*, casino:Casino(*), tour:Tour(*)")
    .eq("tourId", tourId);
  if (error) throw error;
  return data;
}

export async function getNextEvents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Event")
    .select("*, casino:Casino(*), tour:Tour(*)")
    .gt("from", new Date().toISOString().split("T")[0])
    .order("from", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getCurrentEvents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Event")
    .select("*, casino:Casino(*), tour:Tour(*)")
    .gte("to", new Date().toISOString().split("T")[0])
    .lte("from", new Date().toISOString().split("T")[0])
    .order("from", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getMyCasinosCurrentEvents(userId: string) {
  const supabase = createClient();
  const { data: casinos, error: casinos_error } = await supabase
    .from("casino_stars")
    .select("casino_id")
    .eq("user_id", userId);

  const { data, error } = await supabase
    .from("Event")
    .select("*, casino:Casino(*), tour:Tour(*)")
    .in("casinoId", casinos?.map((c: any) => c.casino_id) || [])
    .gte("to", new Date().toISOString().split("T")[0])
    .lte("from", new Date().toISOString().split("T")[0])
    .order("from", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getMyCasinosNextEvents(userId: string) {
  const supabase = createClient();
  const { data: casinos, error: casinos_error } = await supabase
    .from("casino_stars")
    .select("casino_id")
    .eq("user_id", userId);

  const { data, error } = await supabase
    .from("Event")
    .select("*, casino:Casino(*), tour:Tour(*)")
    .in("casinoId", casinos?.map((c: any) => c.casino_id) || [])
    .gte("from", new Date().toISOString().split("T")[0])
    .order("from", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTournamentsByEvent(eventId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Tournament")
    .select("*, casino:Casino(*), event:Event(*, tour:Tour(*))")
    .eq("eventId", eventId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getPastEvents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Event")
    .select("*, casino:Casino(*), tour:Tour(*)")
    .lte("to", new Date().toISOString().split("T")[0])
    .order("from", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getEvent(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Event")
    .select("*, tour:Tour(*), casino:Casino(*)")
    .eq("slug", slug);
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

// Perfil

export async function getProfile(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("user").select("*").eq("id", id);
  if (error) throw error;
  return data[0];
}

export async function getStarredCasinos(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("casino_stars")
    .select("casino:Casino(*)")
    .eq("user_id", id);
  if (error) throw error;
  const casinos = data.map((d: any) => d.casino);
  return casinos;
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
