import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function POST(req) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.error("Gemini API key missing");
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500 },
      );
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      console.error("Supabase credentials missing");
      return new Response(
        JSON.stringify({ error: "Supabase credentials not configured" }),
        { status: 500 },
      );
    }

    // Parse request body
    const body = await req.json();
    console.log("Request body:", body);

    const { message, userId } = body;

    // Validate input
    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing message or userId" }),
        { status: 400 },
      );
    }

    if (!Array.isArray(message) || !message[0] || !Array.isArray(message[0])) {
      return new Response(JSON.stringify({ error: "Invalid message format" }), {
        status: 400,
      });
    }

    // 1. Fetch last summary
    console.log("Fetching conversation summary for user:", userId);
    const { data: convo, error: fetchError } = await supabase
      .from("conversations")
      .select("summary")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      return new Response(JSON.stringify({ error: "Database fetch failed" }), {
        status: 500,
      });
    }

    let pastSummary = convo?.[0]?.summary || "";
    console.log("Past summary:", pastSummary);

    // 2. Initialize Gemini
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    );
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Ask Gemini to update summary with new messages
    const newMessages = message
      .map(([text, role]) => `${role}: ${text}`)
      .join("\n");
    const summaryPrompt = `
    Current summary: ${pastSummary || "None"}
    New messages:
    ${newMessages}
    
    Update the summary to include this new exchange, keeping it concise.
    `;

    console.log("Generating summary...");
    const summaryResult = await model.generateContent(summaryPrompt);

    if (!summaryResult.response) {
      throw new Error("Failed to generate summary - no response from Gemini");
    }

    const newSummary = summaryResult.response.text();
    console.log("New summary generated:", newSummary);

    // 4. Generate reply to user
    // Filter out model messages and only process user messages
    const userMessages = message.filter(([text, role]) => role === "user");

    if (userMessages.length === 0) {
      return new Response(JSON.stringify({ error: "No user messages found" }), {
        status: 400,
      });
    }

    console.log("User messages found:", userMessages.length);

    // Get the most recent user message for response
    const latestUserMessage = userMessages[userMessages.length - 1][0];
    console.log("Latest user message:", latestUserMessage);

    // Create a context-aware prompt using the summary
    const contextPrompt = `
    Previous conversation context: ${newSummary}
    
    User's current message: ${latestUserMessage}
    
    You are a supportive mental health chatbot named Clarity. Respond empathetically and helpfully to the user's message, keeping the conversation context in mind.
    `;

    console.log("Generating reply...");
    const replyResult = await model.generateContent(contextPrompt);

    if (!replyResult.response) {
      throw new Error("Failed to generate reply - no response from Gemini");
    }

    const reply = replyResult.response.text();
    console.log("Reply generated:", reply);

    // 5. Save updated summary
    console.log("Saving to database...");
    const { error: saveError } = await supabase
      .from("conversations")
      .upsert([{ user_id: userId, summary: newSummary }], {
        onConflict: "user_id",
      });

    if (saveError) {
      console.error("Supabase save error:", saveError);
      return new Response(JSON.stringify({ error: "Database save failed" }), {
        status: 500,
      });
    }

    console.log("Success! Returning response");
    return new Response(JSON.stringify({ reply, summary: newSummary }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
