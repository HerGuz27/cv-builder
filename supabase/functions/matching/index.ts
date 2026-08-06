import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getJobMatches(userId: string, jobIds: string[]) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("skills, experience, preferences")
    .eq("id", userId)
    .single();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .in("id", jobIds);

  const prompt = `
    User Profile:
    - Skills: ${profile.skills.join(", ")}
    - Experience: ${profile.experience} years
    - Preferences: ${JSON.stringify(profile.preferences)}

    Jobs to evaluate:
    ${jobs.map((j) => `- ${j.title} at ${j.company}: ${j.description}`).join("\n")}

    Rate each job match 0-100 and provide reasoning.
  `;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}

serve(async (req) => {
  if (req.method === "POST") {
    const { userId, jobIds } = await req.json();
    const matches = await getJobMatches(userId, jobIds);

    // Store matches in database
    await supabase.from("matches").insert({
      user_id: userId,
      job_ids: jobIds,
      analysis: matches,
      created_at: new Date(),
    });

    return new Response(JSON.stringify({ matches }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not found", { status: 404 });
});
