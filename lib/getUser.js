import { createSupabaseServerClient } from "./supabaseserver";

export async function getUser(req) {
  const supabase = await createSupabaseServerClient();

  const authHeader = req?.headers?.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;

  const {
    data: { user },
    error,
  } = accessToken
    ? await supabase.auth.getUser(accessToken)
    : await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }

  return user;
}
