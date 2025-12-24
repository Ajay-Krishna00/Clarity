import { getUser } from "@/lib/getUser"; // helper function to fetch the logged-in user
import { createSupabaseServerClient } from "@/lib/supabaseserver";

export async function POST(req) {
  try {
    const user = await getUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    const { interestIds } = await req.json();
    if (!Array.isArray(interestIds)) {
      return new Response(
        JSON.stringify({ error: "interestIds must be an array" }),
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const { error: deleteError } = await supabase
      .from("user_interests")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error removing existing user interests:", deleteError);
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 400,
      });
    }

    if (interestIds.length === 0) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const inserts = interestIds.map((id) => ({
      user_id: user.id,
      interest_id: id,
    }));

    const { error } = await supabase.from("user_interests").insert(inserts);

    if (error) {
      console.error("Error saving user interests:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Unexpected error saving user interests:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
