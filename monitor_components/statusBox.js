import blessed from "blessed";
import { debugToFile } from "../helpers.js";
import { installDir } from "../commandLineOptions.js";
import { synchronizeAndUpdateWidgets } from "./updateLogicExecution.js";

export async function updateStatusBox(statusBox) {
  try {
    const statusMessage = await synchronizeAndUpdateWidgets(installDir);
    statusBox.setContent(statusMessage);
    // screen.render();
  } catch (error) {
    debugToFile(`updateStatusBox(): ${error}`);
  }
}

export function createStatusBox(grid) {
  // const row = screen.height < layoutHeightThresh ? 1 : 5;
  // const rowSpan = screen.height < layoutHeightThresh ? 2 : 1;

  // debugToFile(`screen.height: ${screen.height}`);

  // const statusBox = grid.set(1, 8, 1, 2, blessed.box, {
  const statusBox = grid.set(1, 7, 1, 2, blessed.box, {
    label: `Status`,
    content: "INITIALIZING...",
    border: {
      type: "line",
      fg: "cyan",
    },
    tags: true,
  });

  return statusBox;
}
