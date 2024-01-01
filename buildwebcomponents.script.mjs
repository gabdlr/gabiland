import filehandle from "node:fs";
import path from "node:path";
import { cwd } from "node:process";
const WEBCOMPONENTS_JS_FILES_DIRECTORY = path.join(
  cwd(),
  "build/webcomponents"
);
const OUTPUT_FILE = path.join(cwd(), "src/webcomponents.ts");

const writeStream = filehandle.createWriteStream(OUTPUT_FILE, {
  encoding: "utf8",
});
writeStream.write("export const webcomponents = `\n");

filehandle.readdir(WEBCOMPONENTS_JS_FILES_DIRECTORY, (err, files) => {
  appendFiles(files);
});

function appendFiles(paths) {
  if (paths.length > 0) {
    readAndWrite(paths, 0, paths.length);
  }
}

function readAndWrite(paths, currentIndex, length) {
  const pathName = path.join(
    WEBCOMPONENTS_JS_FILES_DIRECTORY,
    paths[currentIndex]
  );
  filehandle.readFile(pathName, (err, data) => {
    let fixedData = data
      .toString()
      .replace(/`/g, "\\`")
      .replace(
        'Object.defineProperty(exports, "__esModule", { value: true });',
        ""
      );
    writeStream.write(fixedData, (err) => {
      currentIndex = currentIndex + 1;
      if (currentIndex < length) {
        readAndWrite(paths, currentIndex, length);
      } else {
        writeStream.write("`");
        writeStream.close(() => console.log("WebComponents export file built"));
      }
    });
  });
}
