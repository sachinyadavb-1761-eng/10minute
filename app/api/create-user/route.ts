import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import supabaseAdmin from "@/app/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  // 1. Pehle check karo — request bhejne wala kaun hai (session se)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // yaha kuch set karne ki zarurat nahi, ye read-only check hai
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // 2. Confirm karo ki ye user superadmin hai
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "superadmin") {
    return NextResponse.json(
      { error: "Sirf superadmin hi team members bana sakta hai" },
      { status: 403 },
    );
  }

  // 3. Request body se naya user ka data nikalo
  const { email, password, role, department_id } = await request.json();

  if (!email || !password || !role) {
    return NextResponse.json(
      { error: "Email, password aur role zaroori hain" },
      { status: 400 },
    );
  }

  // 4. Admin API se naya user banao (service role key wali client)
  const { data: newUser, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // seedha confirmed, verification email nahi jayegi
    });

  if (createError || !newUser.user) {
    return NextResponse.json(
      { error: createError?.message || "User create nahi ho paya" },
      { status: 500 },
    );
  }

  // 5. handle_new_user trigger se 'users' table mein row ban chuki hogi (default role='user')
  //    ab usko sahi role aur department se update karo
  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({ role, department_id: department_id || null })
    .eq("id", newUser.user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: newUser.user });
}
