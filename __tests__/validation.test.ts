import os from 'os'
import fs from 'fs/promises'
import path from 'path'

import { validateSchema } from '../src/validation'

describe('validation', () => {
  test('it should fail on an empty dir', async () => {
    const dir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'hcloud-catalog-testing')
    )

    await expect(validateSchema(dir)).rejects.toThrow()

    await fs.rmdir(dir, { recursive: true })
  })
  test('it should fail on a dir with just the specification', async () => {
    const dir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'hcloud-catalog-testing')
    )

    await fs.writeFile(
      path.join(dir, 'specification.json'),
      SAMPLE_SPECIFICATION
    )

    await expect(validateSchema(dir)).rejects.toThrow()

    await fs.rmdir(dir, { recursive: true })
  })
  test('it should fail on a dir with just the bundle', async () => {
    const dir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'hcloud-catalog-testing')
    )

    await fs.writeFile(path.join(dir, 'bundle.js'), SAMPLE_BUNDLE)

    await expect(validateSchema(dir)).rejects.toThrow()

    await fs.rmdir(dir, { recursive: true })
  })
  test('it should pass on a dir with a valid specification and bundle', async () => {
    const dir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'hcloud-catalog-testing')
    )

    await fs.writeFile(
      path.join(dir, 'specification.json'),
      SAMPLE_SPECIFICATION
    )
    await fs.writeFile(path.join(dir, 'bundle.js'), SAMPLE_BUNDLE)

    await expect(validateSchema(dir)).resolves.not.toThrow()

    await fs.rmdir(dir, { recursive: true })
  })
  test('it should fail on a dir with a valid specification and invalid bundle', async () => {
    const dir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'hcloud-catalog-testing')
    )

    await fs.writeFile(
      path.join(dir, 'specification.json'),
      SAMPLE_SPECIFICATION
    )
    await fs.writeFile(path.join(dir, 'bundle.js'), SAMPLE_NON_CTOR_BUNDLE)

    await expect(validateSchema(dir)).rejects.toThrow()

    await fs.rmdir(dir, { recursive: true })
  })
})

const SAMPLE_SPECIFICATION = `{"nodes":[{"specVersion":1,"name":"Add Secret","description":"Add a new secret to the High5 space secret store","documentation":"Link to doc coming soon...","type":"ACTION","package":"CORE","category":"High5","version":{"major":0,"minor":0,"patch":1,"changelog":[]},"author":{"name":"MoovIT GmbH","company":"MoovIT GmbH","email":"support@helmut.cloud"},"requireSdk":true,"inputs":[{"name":"Secret name","description":"Enter the name of the secret","type":"STRING","example":"helmut","advanced":false,"mandatory":true},{"name":"Secret value","description":"Enter the value of the secret (max 1024 characters)","type":"STRING","example":"cloud","advanced":false,"mandatory":true},{"name":"Secret encrypted","description":"Specify if the secret value should be encrypted","type":"BOOLEAN","defaultValue":false,"example":false,"advanced":false,"mandatory":true}],"outputs":[{"name":"Secret name","description":"Returns the secret's name","type":"STRING","example":"helmut","howToAccess":["{{OUTPUT.<nodeUuid>.Secret name}}"]}],"path":"name://AddSecretAction"}],"engineVersion":"0.0.56","specVersion":1}`

const SAMPLE_BUNDLE = `
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/hcloud-sdk/lib/interfaces/high5/wave/index.js
var require_wave = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/wave/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StreamNodeSpecificationPackage = exports2.StreamNodeSpecificationTag = exports2.StreamNodeSpecificationType = exports2.StreamNodeSpecificationOutputType = exports2.StreamNodeSpecificationInputType = void 0;
    exports2.isStreamNodeSpecificationV1 = isStreamNodeSpecificationV1;
    function isStreamNodeSpecificationV1(s) {
      return s.specVersion === 1;
    }
    var StreamNodeSpecificationInputType;
    (function(StreamNodeSpecificationInputType2) {
      StreamNodeSpecificationInputType2["STRING"] = "STRING";
      StreamNodeSpecificationInputType2["STRING_LONG"] = "STRING_LONG";
      StreamNodeSpecificationInputType2["STRING_LIST"] = "STRING_LIST";
      StreamNodeSpecificationInputType2["STRING_MAP"] = "STRING_MAP";
      StreamNodeSpecificationInputType2["STRING_READONLY"] = "STRING_READONLY";
      StreamNodeSpecificationInputType2["STRING_SELECT"] = "STRING_SELECT";
      StreamNodeSpecificationInputType2["STRING_PASSWORD"] = "STRING_PASSWORD";
      StreamNodeSpecificationInputType2["NUMBER"] = "NUMBER";
      StreamNodeSpecificationInputType2["BOOLEAN"] = "BOOLEAN";
      StreamNodeSpecificationInputType2["ANY"] = "ANY";
    })(StreamNodeSpecificationInputType || (exports2.StreamNodeSpecificationInputType = StreamNodeSpecificationInputType = {}));
    var StreamNodeSpecificationOutputType2;
    (function(StreamNodeSpecificationOutputType3) {
      StreamNodeSpecificationOutputType3["STRING"] = "STRING";
      StreamNodeSpecificationOutputType3["STRING_LONG"] = "STRING_LONG";
      StreamNodeSpecificationOutputType3["STRING_LIST"] = "STRING_LIST";
      StreamNodeSpecificationOutputType3["STRING_MAP"] = "STRING_MAP";
      StreamNodeSpecificationOutputType3["STRING_READONLY"] = "STRING_READONLY";
      StreamNodeSpecificationOutputType3["NUMBER"] = "NUMBER";
      StreamNodeSpecificationOutputType3["BOOLEAN"] = "BOOLEAN";
      StreamNodeSpecificationOutputType3["ANY"] = "ANY";
      StreamNodeSpecificationOutputType3["JSON"] = "JSON";
      StreamNodeSpecificationOutputType3["XML"] = "XML";
      StreamNodeSpecificationOutputType3["HTML"] = "HTML";
    })(StreamNodeSpecificationOutputType2 || (exports2.StreamNodeSpecificationOutputType = StreamNodeSpecificationOutputType2 = {}));
    var StreamNodeSpecificationType2;
    (function(StreamNodeSpecificationType3) {
      StreamNodeSpecificationType3["TRIGGER"] = "TRIGGER";
      StreamNodeSpecificationType3["ACTION"] = "ACTION";
      StreamNodeSpecificationType3["CONDITION"] = "CONDITION";
    })(StreamNodeSpecificationType2 || (exports2.StreamNodeSpecificationType = StreamNodeSpecificationType2 = {}));
    var StreamNodeSpecificationTag2;
    (function(StreamNodeSpecificationTag3) {
      StreamNodeSpecificationTag3["PREVIEW"] = "PREVIEW";
      StreamNodeSpecificationTag3["EXPERIMENTAL"] = "EXPERIMENTAL";
    })(StreamNodeSpecificationTag2 || (exports2.StreamNodeSpecificationTag = StreamNodeSpecificationTag2 = {}));
    var StreamNodeSpecificationPackage2;
    (function(StreamNodeSpecificationPackage3) {
      StreamNodeSpecificationPackage3["CORE"] = "CORE";
      StreamNodeSpecificationPackage3["DEV"] = "DEV";
      StreamNodeSpecificationPackage3["THIRD_PARTY"] = "THIRD_PARTY";
      StreamNodeSpecificationPackage3["CUSTOM"] = "CUSTOM";
    })(StreamNodeSpecificationPackage2 || (exports2.StreamNodeSpecificationPackage = StreamNodeSpecificationPackage2 = {}));
  }
});

// index.ts
var wave_nodes_catalog_test_exports = {};
__export(wave_nodes_catalog_test_exports, {
  default: () => wave_nodes_catalog_test_default
});
module.exports = __toCommonJS(wave_nodes_catalog_test_exports);

// lib/Catalog.ts
var Catalog = class {
  constructor(name, description, logoUrl, ...nodes) {
    this.name = name;
    this.description = description;
    this.logoUrl = logoUrl;
    this.nodes = nodes;
    this.nodeCatalog = {};
    for (const node of nodes) {
      this.nodeCatalog[node.name] = node;
    }
  }
};

// lib/nodes/RonSwansonQuote.ts
var import_wave = __toESM(require_wave());

// lib/Node.ts
var Node = class {
  static {
    this._isWaveNode = true;
  }
};

// lib/nodes/RonSwansonQuote.ts
var import_https = __toESM(require("https"));
var RonSwansonQuote = class extends Node {
  constructor() {
    super(...arguments);
    this.specification = {
      specVersion: 1,
      name: "RonSwansonQuote",
      description: "Get a random Ron Swanson quote",
      package: import_wave.StreamNodeSpecificationPackage.THIRD_PARTY,
      type: import_wave.StreamNodeSpecificationType.ACTION,
      category: "Meme",
      tag: import_wave.StreamNodeSpecificationTag.EXPERIMENTAL,
      version: {
        major: 0,
        minor: 0,
        patch: 1,
        changelog: []
      },
      author: {
        name: "Jorge Brown",
        company: "MoovIT SP",
        email: "jorgepbrown@gmail.com"
      },
      inputs: [],
      outputs: [{
        name: "quote",
        description: "a random quote from Ron Swanson",
        example: "No home is complete without a proper toolbox. Here's April and Andy's: A hammer, a half eaten pretzel, a baseball card, some cartridge that says Sonic and Hedgehog, a scissor half, a flashlight filled with jellybeans.",
        type: import_wave.StreamNodeSpecificationOutputType.STRING,
        howToAccess: ["output.<nodeUUID>.quote"]
      }],
      additionalConnectors: []
    };
  }
  static {
    this.URL = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";
  }
  async execute() {
    const quote = await getQuote();
    this.wave.outputs.setOutput("quote", quote);
  }
};
async function getQuote() {
  const body = await get(RonSwansonQuote.URL);
  const quotes = JSON.parse(body);
  return quotes[0] ?? "";
}
function get(url) {
  return new Promise((resolve, reject) => {
    import_https.default.get(url, (res) => {
      let data = "";
      res.on("data", (c) => data += c);
      res.on("close", () => resolve(data));
    }).on("error", reject);
  });
}

// index.ts
var wave_nodes_catalog_test_default = new Catalog("Quote catalog", "This is a test catalog to evaluate the workflow proposed by the catalog blueprint", "https://app.helmut.cloud/img/logo_white.webp", RonSwansonQuote);
`

const SAMPLE_NON_CTOR_BUNDLE = `"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  Catalog: () => Catalog
});
module.exports = __toCommonJS(catalog_exports);
var Catalog = {};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Catalog
});
`
