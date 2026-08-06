import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function sendReminder(userId: string, email: string) {
  const { data: matches } = await supabase
    .from("matches")
    .select("id, job_ids")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!matches) {
    console.log(`No matches found for user ${userId}`);
    return;
  }

  const emailBody = `
    <h2>New Job Matches Available!</h2>
    <p>We found ${matches.job_ids.length} new job opportunities matching your profile.</p>
    <p><a href="https://yourapp.com/matches/${matches.id}">View Matches</a></p>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@yourapp.com",
        to: email,
        subject: "New Job Matches Found",
        html: emailBody,
      }),
    });

    const data = await response.json();
    console.log(`Email sent to ${email}:`, data.id);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { userId, email } = await req.json();

  await sendReminder(userId, email);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
