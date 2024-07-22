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

// node_modules/hcloud-sdk/lib/interfaces/high5/space/index.js
var require_space = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/space/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.High5SpacePermission = void 0;
    var High5SpacePermission;
    (function(High5SpacePermission2) {
      High5SpacePermission2["NONE"] = "NONE";
      High5SpacePermission2["READ"] = "READ";
      High5SpacePermission2["EXECUTE"] = "EXECUTE";
      High5SpacePermission2["WRITE"] = "WRITE";
      High5SpacePermission2["MANAGE"] = "MANAGE";
      High5SpacePermission2["OWNER"] = "OWNER";
    })(High5SpacePermission = exports2.High5SpacePermission || (exports2.High5SpacePermission = {}));
  }
});

// node_modules/hcloud-sdk/lib/interfaces/high5/wave/index.js
var require_wave = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/wave/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StreamNodeSpecificationPackage = exports2.StreamNodeSpecificationTag = exports2.StreamNodeSpecificationType = exports2.StreamNodeSpecificationOutputType = exports2.StreamNodeSpecificationInputType = exports2.isStreamNodeSpecificationV1 = void 0;
    function isStreamNodeSpecificationV1(s) {
      return s.specVersion === 1;
    }
    exports2.isStreamNodeSpecificationV1 = isStreamNodeSpecificationV1;
    var StreamNodeSpecificationInputType2;
    (function(StreamNodeSpecificationInputType3) {
      StreamNodeSpecificationInputType3["STRING"] = "STRING";
      StreamNodeSpecificationInputType3["STRING_LONG"] = "STRING_LONG";
      StreamNodeSpecificationInputType3["STRING_LIST"] = "STRING_LIST";
      StreamNodeSpecificationInputType3["STRING_MAP"] = "STRING_MAP";
      StreamNodeSpecificationInputType3["STRING_READONLY"] = "STRING_READONLY";
      StreamNodeSpecificationInputType3["STRING_SELECT"] = "STRING_SELECT";
      StreamNodeSpecificationInputType3["STRING_PASSWORD"] = "STRING_PASSWORD";
      StreamNodeSpecificationInputType3["NUMBER"] = "NUMBER";
      StreamNodeSpecificationInputType3["BOOLEAN"] = "BOOLEAN";
      StreamNodeSpecificationInputType3["ANY"] = "ANY";
    })(StreamNodeSpecificationInputType2 = exports2.StreamNodeSpecificationInputType || (exports2.StreamNodeSpecificationInputType = {}));
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
    })(StreamNodeSpecificationOutputType2 = exports2.StreamNodeSpecificationOutputType || (exports2.StreamNodeSpecificationOutputType = {}));
    var StreamNodeSpecificationType2;
    (function(StreamNodeSpecificationType3) {
      StreamNodeSpecificationType3["TRIGGER"] = "TRIGGER";
      StreamNodeSpecificationType3["ACTION"] = "ACTION";
      StreamNodeSpecificationType3["CONDITION"] = "CONDITION";
    })(StreamNodeSpecificationType2 = exports2.StreamNodeSpecificationType || (exports2.StreamNodeSpecificationType = {}));
    var StreamNodeSpecificationTag;
    (function(StreamNodeSpecificationTag2) {
      StreamNodeSpecificationTag2["PREVIEW"] = "PREVIEW";
      StreamNodeSpecificationTag2["EXPERIMENTAL"] = "EXPERIMENTAL";
    })(StreamNodeSpecificationTag = exports2.StreamNodeSpecificationTag || (exports2.StreamNodeSpecificationTag = {}));
    var StreamNodeSpecificationPackage2;
    (function(StreamNodeSpecificationPackage3) {
      StreamNodeSpecificationPackage3["CORE"] = "CORE";
      StreamNodeSpecificationPackage3["DEV"] = "DEV";
      StreamNodeSpecificationPackage3["THIRD_PARTY"] = "THIRD_PARTY";
      StreamNodeSpecificationPackage3["CUSTOM"] = "CUSTOM";
    })(StreamNodeSpecificationPackage2 = exports2.StreamNodeSpecificationPackage || (exports2.StreamNodeSpecificationPackage = {}));
  }
});

// node_modules/hcloud-sdk/lib/interfaces/high5/space/event/index.js
var require_event = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/space/event/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// node_modules/hcloud-sdk/lib/interfaces/high5/space/webhook/index.js
var require_webhook = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/space/webhook/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WebhookType = void 0;
    var WebhookType;
    (function(WebhookType2) {
      WebhookType2["EVENT"] = "EVENT";
      WebhookType2["SPACE"] = "SPACE";
      WebhookType2["FRAME_IO"] = "FRAME_IO";
    })(WebhookType = exports2.WebhookType || (exports2.WebhookType = {}));
  }
});

// node_modules/hcloud-sdk/lib/interfaces/high5/space/secret/index.js
var require_secret = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/space/secret/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// node_modules/hcloud-sdk/lib/interfaces/high5/space/event/stream/index.js
var require_stream = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/space/event/stream/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StreamPayloadType = exports2.MoveDirection = void 0;
    var MoveDirection;
    (function(MoveDirection2) {
      MoveDirection2["UP"] = "UP";
      MoveDirection2["DOWN"] = "DOWN";
    })(MoveDirection = exports2.MoveDirection || (exports2.MoveDirection = {}));
    var StreamPayloadType;
    (function(StreamPayloadType2) {
      StreamPayloadType2["JSON"] = "JSON";
      StreamPayloadType2["GENERIC"] = "GENERIC";
    })(StreamPayloadType = exports2.StreamPayloadType || (exports2.StreamPayloadType = {}));
  }
});

// node_modules/hcloud-sdk/lib/interfaces/high5/space/event/stream/design/index.js
var require_design = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/space/event/stream/design/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// node_modules/hcloud-sdk/lib/interfaces/high5/space/event/stream/node/index.js
var require_node = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/space/event/stream/node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NodeCategory = void 0;
    var NodeCategory;
    (function(NodeCategory2) {
      NodeCategory2["CUSTOM"] = "CUSTOM";
    })(NodeCategory = exports2.NodeCategory || (exports2.NodeCategory = {}));
  }
});

// node_modules/hcloud-sdk/lib/interfaces/high5/joinToken/index.js
var require_joinToken = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/joinToken/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// node_modules/hcloud-sdk/lib/interfaces/high5/index.js
var require_high5 = __commonJS({
  "node_modules/hcloud-sdk/lib/interfaces/high5/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_space(), exports2);
    __exportStar(require_wave(), exports2);
    __exportStar(require_event(), exports2);
    __exportStar(require_webhook(), exports2);
    __exportStar(require_secret(), exports2);
    __exportStar(require_stream(), exports2);
    __exportStar(require_design(), exports2);
    __exportStar(require_space(), exports2);
    __exportStar(require_event(), exports2);
    __exportStar(require_stream(), exports2);
    __exportStar(require_design(), exports2);
    __exportStar(require_node(), exports2);
    __exportStar(require_webhook(), exports2);
    __exportStar(require_secret(), exports2);
    __exportStar(require_wave(), exports2);
    __exportStar(require_joinToken(), exports2);
  }
});

// src/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  Catalog: () => Catalog
});
module.exports = __toCommonJS(catalog_exports);

// src/nodes/actions/ActionNode.ts
var ActionNode = class extends function() {
} {
};

// src/nodes/actions/high5/AddSecretAction.ts
var import_high5 = __toESM(require_high5());
var AddSecretAction = class extends ActionNode {
  specification = {
    specVersion: 1,
    name: "Add Secret",
    description: "Add a new secret to the High5 space secret store",
    documentation: "Link to doc coming soon...",
    type: import_high5.StreamNodeSpecificationType.ACTION,
    package: import_high5.StreamNodeSpecificationPackage.CORE,
    category: "High5" /* HIGH5 */,
    version: {
      major: 0,
      minor: 0,
      patch: 1,
      changelog: []
    },
    author: {
      name: "MoovIT GmbH",
      company: "MoovIT GmbH",
      email: "support@helmut.cloud"
    },
    requireSdk: true,
    inputs: [
      {
        name: "Secret name" /* SECRET_NAME */,
        description: "Enter the name of the secret",
        type: import_high5.StreamNodeSpecificationInputType.STRING,
        example: "helmut",
        advanced: false,
        mandatory: true
      },
      {
        name: "Secret value" /* SECRET_VALUE */,
        description: "Enter the value of the secret (max 1024 characters)",
        type: import_high5.StreamNodeSpecificationInputType.STRING,
        example: "cloud",
        advanced: false,
        mandatory: true
      },
      {
        name: "Secret encrypted" /* SECRET_ENCRYPTED */,
        description: "Specify if the secret value should be encrypted",
        type: import_high5.StreamNodeSpecificationInputType.BOOLEAN,
        defaultValue: false,
        example: false,
        advanced: false,
        mandatory: true
      }
    ],
    outputs: [
      {
        name: "Secret name" /* SECRET_NAME */,
        description: "Returns the secret's name",
        type: import_high5.StreamNodeSpecificationOutputType.STRING,
        example: "helmut",
        howToAccess: ["{{OUTPUT.<nodeUuid>.Secret name}}"]
      },
    ]
  };
  async execute() {
    const startTime = performance.now();
    const secret = await this.addSecret();
    this.wave.outputs.setOutput("Secret name" /* SECRET_NAME */, secret.key);
    this.wave.outputs.setOutput("Secret value" /* SECRET_VALUE */, secret.value);
    this.wave.outputs.setOutput("Secret encrypted" /* SECRET_ENCRYPTED */, secret.encrypted);
    this.wave.outputs.setOutput("Run time" /* DURATION */, performance.now() - startTime);
  }
  async addSecret() {
    const key = this.wave.inputs.getInputByName("Secret name" /* SECRET_NAME */)?.value;
    const value = this.wave.inputs.getInputByName("Secret value" /* SECRET_VALUE */)?.value;
    if (value.length > 1024) throw new Error("The secret value must not exceed 1024 characters");
    const encrypted = this.wave.inputs.getInputByName("Secret encrypted" /* SECRET_ENCRYPTED */)?.value;
    let secret;
    const hcl = this.wave.general.getHcloudClient();
    try {
      const orgName = this.wave.general.getOrgName();
      const spaceName = this.wave.general.getSpaceName();
      secret = await hcl.High5.space.secret.addSecret(orgName, spaceName, key, value, encrypted);
    } catch (err) {
      throw new Error(err);
    }
    return secret;
  }
};

// src/nodes/conditions/ConditionNode.ts
var ConditionNode = class extends function() {
} {
};

// src/catalog.ts
var Catalog = class {
  nodeCatalog;
  constructor(engineNode) {
    Object.setPrototypeOf(ActionNode, engineNode);
    Object.setPrototypeOf(ActionNode.prototype, engineNode.prototype);
    Object.setPrototypeOf(ConditionNode, engineNode);
    Object.setPrototypeOf(ConditionNode.prototype, engineNode.prototype);
    this.nodeCatalog = {
      AddSecretAction
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Catalog
});
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
