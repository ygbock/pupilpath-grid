// Supabase Edge Function: notify-credentials
// Optionally sends newly created credentials to a user via email (Resend) and/or SMS (Twilio)
// Configure secrets with: RESEND_API_KEY, RESEND_FROM, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
// This function requires the caller to be an authenticated admin.

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

    const authHeader = req.headers.get("Authorization") || "";
    const accessToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!accessToken) return new Response(JSON.stringify({ error: "missing access token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: userData, error: getUserErr } = await supabaseAdmin.auth.getUser(accessToken);
    if (getUserErr || !userData?.user) return new Response(JSON.stringify({ error: "invalid access token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const callerId = userData.user.id;
    const { data: canSend, error: permErr } = await supabaseAdmin.rpc("has_permission" as any, {
      _user_id: callerId,
      _permission: "users.manage",
    } as any);
    if (permErr) return new Response(JSON.stringify({ error: permErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!canSend) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const email: string | undefined = body?.email;
    const phone: string | undefined = body?.phone;
    const full_name: string | undefined = body?.full_name;
    const password: string | undefined = body?.password;
    const role: string | undefined = body?.role;
    const send_email: boolean = !!body?.send_email;
    const send_sms: boolean = !!body?.send_sms;

    if (!password || !role) {
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const tasks: Promise<Response | void>[] = [];

    if (send_email && email) {
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      const RESEND_FROM = Deno.env.get("RESEND_FROM") || "no-reply@example.com";
      if (!RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not set; skipping email");
      } else {
        const subject = `Your ${role} account credentials`;
        const text =
`Hello ${full_name || ""},\n\n` +
`Your account has been created.\n` +
`Email: ${email}\n` +
`Temporary password: ${password}\n\n` +
`Please sign in and change your password immediately.`;
        tasks.push(fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: RESEND_FROM,
            to: [email],
            subject,
            text,
          }),
        }).then(async (r) => {
          if (!r.ok) console.error("Resend error", await r.text());
        }));
      }
    }

    if (send_sms && phone) {
      const SID = Deno.env.get("TWILIO_ACCOUNT_SID");
      const TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
      const FROM = Deno.env.get("TWILIO_FROM");
      if (!SID || !TOKEN || !FROM) {
        console.warn("Twilio env not set; skipping SMS");
      } else {
        const bodyText = `Login: ${email || phone} | Temp pwd: ${password}. Please change on first login.`;
        const url = `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`;
        const form = new URLSearchParams({ From: FROM, To: phone, Body: bodyText });
        const auth = "Basic " + btoa(`${SID}:${TOKEN}`);
        tasks.push(fetch(url, {
          method: "POST",
          headers: { "Authorization": auth, "Content-Type": "application/x-www-form-urlencoded" },
          body: form.toString(),
        }).then(async (r) => {
          if (!r.ok) console.error("Twilio error", await r.text());
        }));
      }
    }

    await Promise.all(tasks);

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const ORIGIN = req.headers.get("origin") || "*";
    const corsHeaders = {
      "Access-Control-Allow-Origin": ORIGIN,
      "Vary": "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    } as const;
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
