import { createOpencode } from "@opencode-ai/sdk";
import ERR from "@3-/log/ERR.js";
import GREEN from "@3-/log/GREEN.js";
import GRAY from "@3-/log/BLUE.js";
import dataLog from "~/ai/lib/ai/dataLog.js";

export default async (title) => {
  try {
    const { client, server } = await createOpencode(),
      {
        data: { id: session_id },
      } = await client.session.create({ body: { title } });

    let prompt;

    const request = async (prompt_text) => {
        GREEN("\n→ " + prompt_text);
        return await client.session.prompt({
          path: { id: session_id },
          body: {
            parts: [{ type: "text", text: prompt_text }],
          },
        });
      },
      prompt_no_log = async (prompt_text) => {
        try {
          const res = await request(prompt_text);
          return dataLog(res.data);
        } catch (err) {
          ERR(err);
          throw err;
        }
      },
      prompt_log = async (prompt_text) => {
        try {
          const res = await request(prompt_text),
            model = res.data?.info?.modelID;
          if (model) {
            GRAY("\n模型 " + model);
          }
          prompt = prompt_no_log;
          return dataLog(res.data);
        } catch (err) {
          ERR(err);
          throw err;
        }
      };

    prompt = prompt_log;

    const run = async (prompt_text) => await prompt(prompt_text);

    run[Symbol.asyncDispose] = async () => {
      try {
        await server.close();
      } catch (err) {
        ERR(err);
        throw err;
      }
    };

    return run;
  } catch (err) {
    ERR(err);
    throw err;
  }
};
