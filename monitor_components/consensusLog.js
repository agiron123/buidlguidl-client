import fs from "fs";
import readline from "readline";
import blessed from "blessed";
import { formatLogLines } from "./helperFunctions.js";
import { debugToFile } from "../helpers.js";

export function createConsensusLog(grid, consensusClientLabel) {
  // const colSpan = screen.height < layoutHeightThresh ? 7 : 9;

  // const consensusLog = grid.set(4, 0, 3, 8, blessed.box, {
  const consensusLog = grid.set(4, 0, 3, 7, blessed.log, {
    label: `${consensusClientLabel}`,
    content: `Loading ${consensusClientLabel} logs`,
    border: {
      type: "line",
      fg: "cyan",
    },
    tags: true,
    shrink: true,
    wrap: true,
  });

  return consensusLog;
}

export function updateConsensusClientInfo(logFilePath, consensusLog, screen) {
  let lastSize = 0;

  const updateLogContent = () => {
    try {
      const stats = fs.statSync(logFilePath);
      const newSize = stats.size;

      if (newSize > lastSize) {
        const newStream = fs.createReadStream(logFilePath, {
          encoding: "utf8",
          start: lastSize,
          end: newSize,
        });

        const newRl = readline.createInterface({
          input: newStream,
          output: process.stdout,
          terminal: false,
        });

        newRl.on("line", (line) => {
          consensusLog.log(formatLogLines(line));
          // screen.render();
        });

        newRl.on("close", () => {
          lastSize = newSize;
        });

        newRl.on("error", (err) => {
          debugToFile(`Error reading log file: ${err}`, () => {});
        });
      }
    } catch (error) {
      debugToFile(`Error accessing log file: ${error}`, () => {});
    }
  };

  // Initial read to load existing content
  updateLogContent();

  // Watch for file changes
  fs.watchFile(logFilePath, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
      updateLogContent();
    }
  });
}
