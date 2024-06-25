// import { NextResponse } from "next/server";

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

// export async function POST(request) {
//   const message =
//     "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(message);

//     const response = result.response;
//     const text = response.text();
//     console.log(text);
//     return NextResponse.json(
//       {
//         success: true,
//         message: text,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Error in creating text" },
//       { status: 404 }
//     );
//   }
// }

import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

export async function POST(request) {
  const message =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);

    const response = result.response;
    const text = response.text();

    // Chunk the text
    const chunkSize = 5; // Adjust this to control the chunk size
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }

    // Send chunks individually with "FINAL" flag for the last chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const isFinal = i === chunks.length - 1;
      await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate a delay
      return NextResponse.json({ message: chunk, isFinal });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error in creating text" },
      { status: 404 }
    );
  }
}
