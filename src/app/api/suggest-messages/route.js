import { NextResponse } from "next/server";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

export async function POST(request) {
  const message =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContentStream(message);

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    (async () => {
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        writer.write(chunkText);
      }
      writer.close();
    })();

    return new Response(readable, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in creating text" },
      { status: 404 }
    );
  }
}
