import { success } from "better-auth";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { sendWelcomeEmail } from "@/lib/nodemailer";

export const sendSignUpEmail = inngest.createFunction(
  { id: "Send Sign Up Email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    // Logic to send a welcome email to the user
    const userProfile = `
    - Country: ${event.data.country}
    - Investment goals: ${event.data.investment}
    - risk tolerance: ${event.data.riskTolerance}
    - Preferred Industry: ${event.data.preferredIndustry}
    
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      `{{userProfile}}`,
      userProfile
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send_welcome_email", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && "text" in part ? part.text : null) || "Thanks for Joining Us!";

      // Email sending logic would go here
      const {
        data: { email, name },
      } = event;

      return await sendWelcomeEmail({ email, name, intro: introText });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  }
);

// Eneded on 2.35.25 about to i shadn
