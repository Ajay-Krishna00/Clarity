import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getUser() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}