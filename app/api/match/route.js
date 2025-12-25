import { getUser } from "@/lib/getUser";
import { createSupabaseServerClient } from "@/lib/supabaseserver";

export async function GET(req) {
  const user = await getUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const supabase = await createSupabaseServerClient();

  // Get current user’s interests
  const { data: myInterests, error: myError } = await supabase
    .from("user_interests")
    .select("interest_id")
    .eq("user_id", user.id);

  if (myError) {
    return new Response(JSON.stringify({ error: myError.message }), {
      status: 400,
    });
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
      return new Response(JSON.stringify({ error: matchError.message }), {
        status: 400,
      });
    }
  
  const matchMap = matches.reduce((acc, curr) => {
    {
      //reduce() - it rolls through the array, collecting and building something bigger!
      //acc-	Accumulator - the object we're building up
      //curr-	Current item being processed
    if (!acc[curr.user_id]) {
      acc[curr.user_id] = { user_id: curr.user_id, interests: [] };
    }
    acc[curr.user_id].interests.push(curr.interests.name);
    return acc;
  }}, {});
  
  const uniqueMatches = Object.values(matchMap);
  
  return new Response(JSON.stringify(uniqueMatches), { status: 200 });
}
