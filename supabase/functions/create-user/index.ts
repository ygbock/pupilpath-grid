// Supabase Edge Function: create-user
// Creates an auth user with a temporary password and assigns a role (admin/staff/student)
// Requires caller to be an authenticated admin. Uses service role key to perform privileged actions.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

serve(async (req) => {
  try {
    const ORIGIN = req.headers.get("origin") || "*";
    const corsHeaders = {
      "Access-Control-Allow-Origin": ORIGIN,
      "Vary": "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    } as const;

    if (req.method === "OPTIONS") {
      return new Response("ok", { status: 200, headers: corsHeaders });
    }
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Verify caller's user from Authorization header (Bearer <access_token>)
    const authHeader = req.headers.get("Authorization") || "";
    const accessToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "missing access token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: userData, error: getUserErr } = await supabaseAdmin.auth.getUser(accessToken);
    if (getUserErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "invalid access token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const callerId = userData.user.id;

    // Authorize via permissions: only admin (users.manage) can create accounts
    const { data: canCreate, error: permErr } = await supabaseAdmin.rpc("has_permission" as any, {
      _user_id: callerId,
      _permission: "users.manage",
    } as any);
    if (permErr) {
      return new Response(JSON.stringify({ error: permErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!canCreate) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const email: string = body?.email;
    const password: string = body?.password;
    const role: string = body?.role; // "staff" | "student" | "admin"
    const full_name: string | undefined = body?.full_name;
    const phone: string | undefined = body?.phone;
    const require_reset: boolean = !!body?.require_reset;

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: "invalid payload" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    // Ensure role exists in catalog
    const { data: roleRow, error: roleLookupErr } = await supabaseAdmin
      .from("roles")
      .select("key")
      .eq("key", role)
      .maybeSingle();
    if (roleLookupErr) {
      return new Response(JSON.stringify({ error: roleLookupErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "invalid role" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Create user in auth and mark email confirmed so they can sign in immediately
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name || "",
        phone: phone || "",
        password_rotated: !require_reset, // if require_reset, keep banner on until changed
      },
    });
    if (createErr || !created?.user) {
      return new Response(JSON.stringify({ error: createErr?.message || "create user failed" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const newUserId = created.user.id;

    // Insert role and profile
    const { error: roleInsErr } = await supabaseAdmin.from("user_roles").insert({
      user_id: newUserId,
      role,
      created_by: callerId,
    } as any);
    if (roleInsErr) {
      // Best-effort rollback user
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return new Response(JSON.stringify({ error: roleInsErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Optional profile row if your schema expects it
    await supabaseAdmin.from("profiles").insert({
      id: newUserId,
      email,
      full_name: full_name || null,
      phone: phone || null,
    } as any).then(() => {}, () => {});

    return new Response(
      JSON.stringify({ ok: true, user_id: newUserId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const ORIGIN = req.headers.get("origin") || "*";
    const corsHeaders = {
      "Access-Control-Allow-Origin": ORIGIN,
      "Vary": "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    } as const;
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
