import { supabase } from "@/lib/supabaseClient";
import { getUser } from "@/lib/getUser"; // helper function to fetch the logged-in user

export async function POST(req) {
  const user = await getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const { interestIds } = await req.json(); // e.g. ["uuid1", "uuid2"]

  // Clean old interests first to avoid duplicates
  await supabase.from("user_interests").delete().eq("user_id", user.id);

  const inserts = interestIds.map((id) => ({
    user_id: user.id,
    interest_id: id,
  }));

  const { error } = await supabase.from("user_interests").insert(inserts);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
