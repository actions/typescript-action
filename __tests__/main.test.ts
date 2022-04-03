import { installDocc } from "../src/install";
import * as process from "process";
import * as cp from "child_process";
import * as path from "path";
import { jest, describe, test, beforeEach, afterEach, expect } from "@jest/globals";
import * as io from "@actions/io";
import * as exec from "@actions/exec";
import * as fs from "fs";

describe("swift-docc-action", () => {
  let swiftPackage = "Foo";
  let doccPath = `${swiftPackage}/Sources/Foo/Foo.docc`;
  beforeEach(async () => {
    await io.rmRF(swiftPackage);
    await io.mkdirP(swiftPackage);
    await exec.exec("swift", ["package", "init"], { cwd: swiftPackage });
    await io.mkdirP(doccPath);
  });
  afterEach(async () => {
    await io.rmRF(swiftPackage);
  });

  describe("install", () => {
    test("installDocc", async () => {
      expect(await installDocc()).toBeTruthy();
    });
  });

  describe("main", () => {
    /** shows how the runner will run a javascript action with env / stdout protocol */
    test("test runs", () => {
      let outputPath = 'docs'
      process.env["INPUT_PATH"] = doccPath;
      process.env["INPUT_FALLBACK-DISPLAY-NAME"] = "Foo";
      process.env["INPUT_FALLBACK-BUNDLE-IDENTIFIER"] = "Foo";
      process.env["INPUT_FALLBACK-BUNDLE-VERSION"] = "1";
      process.env["INPUT_ADDITIONAL-SYMBOL-GRAPH-DIR"] = ".build";
      process.env["INPUT_OUTPUT-PATH"] = outputPath;
      process.env["INPUT_COMMIT"] = 'true';
      const np = process.execPath;
      const ip = path.join(__dirname, "..", "lib", "main.js");
      const options: cp.ExecFileSyncOptions = {
        env: process.env,
        stdio: "inherit"
      };
      cp.execFileSync(np, [ip], options);
      expect(fs.existsSync(`${outputPath}/index.html`)).toBeTruthy();
    });
  });
});
