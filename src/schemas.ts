import { z } from 'zod'

const StreamCustomNodeSpecification = z.object({
  _id: z.string(),
  color: z.string().optional()
})

const StreamSemanticVersion = z.object({
  /**
   * changes effecting the user and are not backwards compatible (parameter changes)
   */
  major: z.number(),
  /**
   * changes effecting the user but are backwards compatible (logic changes)
   */
  minor: z.number(),
  /**
   * changes not effecting the user (bug fixes)
   */
  patch: z.number(),
  /**
   * description for every change on the the node
   */
  changelog: z.array(z.string())
})

const StreamNodeSpecificationAdditionalConnector = z.object({
  name: z.string(),
  description: z.string()
})

const StreamNodeSpecificationInputType = z.enum([
  'STRING',
  'STRING_LONG',
  'STRING_LIST',
  'STRING_MAP',
  'STRING_READONLY',
  'STRING_SELECT',
  'STRING_PASSWORD',
  'NUMBER',
  'BOOLEAN',
  'ANY'
])

const StreamNodeSpecificationInput = z.intersection(
  z.object({
    name: z.string(),
    description: z.string(),
    defaultValue: z.any().optional(),
    example: z.any(),
    advanced: z.boolean().optional(),
    mandatory: z.boolean().optional()
  }),
  z.discriminatedUnion('type', [
    z.object({
      type: StreamNodeSpecificationInputType.exclude(['STRING_SELECT'])
    }),
    z.object({
      type: StreamNodeSpecificationInputType.extract(['STRING_SELECT']),
      options: z.record(z.union([z.string(), z.number()]))
    })
  ])
)

const StreamNodeSpecificationOutputType = z.nativeEnum({
  STRING: 'STRING',
  STRING_LONG: 'STRING_LONG',
  STRING_LIST: 'STRING_LIST',
  STRING_MAP: 'STRING_MAP',
  STRING_READONLY: 'STRING_READONLY',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  ANY: 'ANY',
  JSON: 'JSON'
})

const StreamNodeSpecificationOutput = z.object({
  name: z.string(),
  description: z.string(),
  type: StreamNodeSpecificationOutputType,
  example: z.unknown(),
  howToAccess: z.array(z.string())
})

const StreamNodeSpecificationOutputV2 = z.object({
  name: z.string(),
  description: z.string(),
  type: StreamNodeSpecificationOutputType,
  example: z.unknown()
})

const StreamNodeSpecificationAuthor = z.object({
  name: z.string(),
  company: z.string(),
  email: z.string()
})

const StreamNodeSpecificationType = z.nativeEnum({
  TRIGGER: 'TRIGGER',
  ACTION: 'ACTION',
  CONDITION: 'CONDITION'
})

const StreamNodeSpecificationTag = z.nativeEnum({
  PREVIEW: 'PREVIEW',
  EXPERIMENTAL: 'EXPERIMENTAL'
})

const StreamNodeSpecificationPackage = z.nativeEnum({
  CORE: 'CORE',
  DEV: 'DEV',
  THIRD_PARTY: 'THIRD_PARTY',
  CUSTOM: 'CUSTOM'
})

const nodeSpecificationSchemaV1 = z.object({
  specVersion: z.literal(1),
  name: z.string(),
  description: z.string(),
  type: StreamNodeSpecificationType,
  package: StreamNodeSpecificationPackage,
  category: z.string(),
  version: StreamSemanticVersion,
  author: StreamNodeSpecificationAuthor,
  tag: StreamNodeSpecificationTag.optional(),
  inputs: z.array(StreamNodeSpecificationInput).optional(),
  outputs: z.array(StreamNodeSpecificationOutput).optional(),
  additionalConnectors: z
    .array(StreamNodeSpecificationAdditionalConnector)
    .optional(),
  path: z.string().optional(),
  customNode: StreamCustomNodeSpecification.optional()
})

const nodeSpecificationSchemaV2 = z.object({
  specVersion: z.literal(2),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  version: StreamSemanticVersion,
  author: StreamNodeSpecificationAuthor,
  tag: StreamNodeSpecificationTag.array().optional(),
  inputs: z.array(StreamNodeSpecificationInput).optional(),
  outputs: z.array(StreamNodeSpecificationOutputV2).optional(),
  additionalConnectors: z
    .array(StreamNodeSpecificationAdditionalConnector)
    .optional(),
  path: z.string().optional(),
  customNode: StreamCustomNodeSpecification.optional()
})

const nodeSpecificationSchema = z.discriminatedUnion('specVersion', [
  nodeSpecificationSchemaV1,
  nodeSpecificationSchemaV2
])

export const specificationSchema = z.object({
  nodes: z.array(nodeSpecificationSchema),
  engineVersion: z.string().optional(),
  specVersion: z.number().optional()
})

const nodeConstructorSchema = z.function()

export const catalogSchema = z.object({
  name: z.string(),
  logoUrl: z.string(),
  description: z.string(),
  nodes: z.array(nodeConstructorSchema),
  nodeCatalog: z.record(nodeConstructorSchema)
})
