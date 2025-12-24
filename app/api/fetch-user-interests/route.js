import { getUser } from "@/lib/getUser";
import { createSupabaseServerClient } from "@/lib/supabaseserver";

export async function GET(req) {
  const user = await getUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 400,
    });
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_interests")
    .select("interest_id")
    .eq("user_id", user.id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
  const interest_ids = data.map((item) => item.interest_id);
  return new Response(JSON.stringify({ interest_ids }), { status: 200 });
}
