import dotenv from "dotenv";
import { PageHandler, ScreenResult } from "../src/utils/pageHandler";
import {
  makeQuestionForActionValue,
  makeQuestionForConfirmation,
} from "./utils/langchainHandler";

import { convertSelectResultIntoTable } from "../src/modules/chat/chat.service";
dotenv.config();

// describe("pageHandler", () => {
//   const pageHandler = new PageHandler();

//   beforeAll(async () => {
//     await pageHandler.initialize();
//   }, 10000);

async function main() {
  const pageHandler = new PageHandler();
  await pageHandler.initialize();
  const logScreenResult = async (
    screen: ScreenResult,
    isQuestion: boolean = false
  ) => {
    const actionComponentsDescriptions = screen.actionComponents.map(
      (comp) =>
        `- ${comp.description} (action: ${comp.actionType}) (i=${comp.i})`
    );

    console.log(`
id: ${screen.id}
type: ${screen.type}
description: ${screen.screenDescription}
ActionComponents: 
${actionComponentsDescriptions.join("\n")}
-------------------
    `);
    if (isQuestion) {
      const questions = await Promise.all(
        screen.actionComponents.map(async (comp) => {
          if (comp.actionType === "click") {
            return `- ${await makeQuestionForConfirmation(
              comp,
              screen.screenDescription
            )} (i=${comp.i})`;
          } else {
            return `- ${await makeQuestionForActionValue(
              screen.screenDescription,
              comp.description
            )} (i=${comp.i})`;
          }
        })
      );

      console.log(`Questions:
${questions.join("\n")}
-------------------------------------------------------
    `);
    }
  };

  logScreenResult(
    await pageHandler.navigate("https://www.greyhound.com", true)
  );
  logScreenResult(
    await pageHandler.click(".hcr-btn-7-6-0.hcr-btn--primary-7-6-0.lKKy1", true)
  );
  const selectRes = await pageHandler.select(
    "#main-content > div > div > div > div.SearchResults__main___zj81o.search-results-main > div > div.ResultsList__container___JnkEA.ResultsList__animDone___I7PYN > div.ResultsList__resultsListPanel___Mr5mf.ResultsList__floatingFilter___autlh > figure:nth-child(3) > ul",
    true
  );
  logScreenResult(selectRes);
  const table = await convertSelectResultIntoTable(
    selectRes.actionComponents,
    selectRes.screenDescription
  );
  console.log(table);
  // logScreenResult(await pageHandler.click("#dateInput-from", true));

  // logScreenResult(await pageHandler.click("#searchInputMobile-from", false));
  // logScreenResult(
  //   await pageHandler.inputText("#searchInput-from", "South Bend", false)
  // );
  // logScreenResult(await pageHandler.click('[i="1113"]', true));
  // await new Promise((r) => setTimeout(r, 300000));

  // logScreenResult(await pageHandler.click(".hcr-fieldset-7-6-0", true));
  // logScreenResult(await pageHandler.select(".hcr-fieldset-7-6-0", true));
  console.log("Done");
}
main();
