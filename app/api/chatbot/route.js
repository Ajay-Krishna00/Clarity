import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { message } = await req.json();
  const formattedMessages = message.map(([text, role]) => ({
    role: role === "user" ? "user" : "model",
    parts: [{ text }],
  }));
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent({
    contents: formattedMessages,
  });

  const reply = result.response.text();

  return new Response(JSON.stringify({ reply }), { status: 200 });
}
