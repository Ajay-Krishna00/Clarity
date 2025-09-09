import { supabase } from "@/lib/supabaseClient";
import { getUser } from "@/lib/getUser";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  // Get current user’s interests
  const { data: myInterests, error: myError } = await supabase
    .from("user_interests")
    .select("interest_id")
    .eq("user_id", user.id);

  if (myError) {
    return new Response(JSON.stringify({ error: myError.message }), { status: 400 });
  }

  if (!myInterests?.length) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const interestIds = myInterests.map((i) => i.interest_id);

  // Find other users with matching interest_ids
  const { data: matches, error: matchError } = await supabase
    .from("user_interests")
    .select("user_id, interests(name)")
    .in("interest_id", interestIds)
    .neq("user_id", user.id);

  if (matchError) {
    return new Response(JSON.stringify({ error: matchError.message }), { status: 400 });
  }

  return new Response(JSON.stringify(matches), { status: 200 });
}
