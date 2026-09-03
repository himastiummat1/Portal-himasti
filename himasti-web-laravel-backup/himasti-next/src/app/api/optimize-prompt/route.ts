import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  try {
    const { draftPrompt, targetAgent } = await req.json();

    if (!draftPrompt || typeof draftPrompt !== "string" || !draftPrompt.trim()) {
      return NextResponse.json({ error: "Draft prompt tidak boleh kosong." }, { status: 400 });
    }

    if (!process.env.API_KEY_GROQ) {
      return NextResponse.json({
        optimizedPrompt: `# Optimized System Prompt for ${targetAgent || "AI Agent"}\n\n<role>\nYou are a senior technical specialist focused on delivering high-integrity solutions.\n</role>\n\n<objective>\n${draftPrompt.trim()}\n</objective>\n\n<guidelines>\n- Prioritize clean architecture, error boundaries, and modern best practices.\n- Provide clear rationale for design decisions.\n- Avoid placeholder code or vague explanations.\n</guidelines>`
      });
    }

    const groq = new Groq({ apiKey: process.env.API_KEY_GROQ });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are the Lead AI Prompt Engineer for HIMASTI (Himpunan Mahasiswa Sistem dan Teknologi Informasi).
Your mission is to take an informal, rough, or simple prompt submitted by an IT student and transform it into an elite, production-grade prompt designed for modern AI Coding Agents (Cursor, Windsurf, Claude Code, Antigravity).

Structure the output cleanly using standard XML tags:
<role>
Define the exact expert persona and technical constraints.
</role>

<context>
State the technical ecosystem and relevant background.
</context>

<task>
Specific, unambiguous instruction detailing what the AI must generate or fix.
</task>

<constraints>
- Explicit negative constraints (e.g. no unnecessary libraries, strict TypeScript, responsive CSS, security rules).
- Error handling and edge-case requirements.
</constraints>

<output_format>
Specify the exact format (code snippets, file paths, step-by-step explanation).
</output_format>

Return ONLY the optimized prompt content in Indonesian or English (matching the user's intent). Do not add conversational intro or outro.`
        },
        {
          role: "user",
          content: `Target Agent: ${targetAgent || "Cursor / Claude Code"}\nUser Draft Prompt:\n${draftPrompt.trim()}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1200
    });

    const optimized = completion.choices[0]?.message?.content || "Gagal mengoptimasi prompt.";
    return NextResponse.json({ optimizedPrompt: optimized });
  } catch (error: any) {
    console.error("[OptimizePromptError]:", error);
    return NextResponse.json({ error: "Terjadi gangguan saat menghubungi AI engine." }, { status: 500 });
  }
}
