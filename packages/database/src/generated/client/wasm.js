
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  displayName: 'displayName',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GithubInstallationScalarFieldEnum = {
  id: 'id',
  githubInstallationId: 'githubInstallationId',
  accountLogin: 'accountLogin',
  accountType: 'accountType',
  encryptedCredentialsRef: 'encryptedCredentialsRef',
  createdAt: 'createdAt'
};

exports.Prisma.RepositoryScalarFieldEnum = {
  id: 'id',
  githubRepositoryId: 'githubRepositoryId',
  installationId: 'installationId',
  owner: 'owner',
  name: 'name',
  defaultBranch: 'defaultBranch',
  isEnabled: 'isEnabled',
  reviewConfig: 'reviewConfig',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PullRequestScalarFieldEnum = {
  id: 'id',
  repositoryId: 'repositoryId',
  githubPrNumber: 'githubPrNumber',
  title: 'title',
  author: 'author',
  baseSha: 'baseSha',
  headSha: 'headSha',
  state: 'state',
  updatedAt: 'updatedAt'
};

exports.Prisma.WebhookDeliveryScalarFieldEnum = {
  id: 'id',
  githubDeliveryId: 'githubDeliveryId',
  eventType: 'eventType',
  repositoryId: 'repositoryId',
  receivedAt: 'receivedAt',
  processingStatus: 'processingStatus'
};

exports.Prisma.ReviewJobScalarFieldEnum = {
  id: 'id',
  repositoryId: 'repositoryId',
  pullRequestId: 'pullRequestId',
  headSha: 'headSha',
  idempotencyKey: 'idempotencyKey',
  status: 'status',
  configVersion: 'configVersion',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  errorCode: 'errorCode',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt'
};

exports.Prisma.AgentRunScalarFieldEnum = {
  id: 'id',
  reviewJobId: 'reviewJobId',
  agentType: 'agentType',
  status: 'status',
  modelProvider: 'modelProvider',
  modelName: 'modelName',
  inputTokens: 'inputTokens',
  outputTokens: 'outputTokens',
  durationMs: 'durationMs',
  outputJson: 'outputJson',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt'
};

exports.Prisma.FindingScalarFieldEnum = {
  id: 'id',
  reviewJobId: 'reviewJobId',
  agentRunId: 'agentRunId',
  fingerprint: 'fingerprint',
  title: 'title',
  category: 'category',
  severity: 'severity',
  confidence: 'confidence',
  filePath: 'filePath',
  line: 'line',
  endLine: 'endLine',
  description: 'description',
  evidence: 'evidence',
  recommendation: 'recommendation',
  verificationStatus: 'verificationStatus',
  publicationStatus: 'publicationStatus',
  githubCommentId: 'githubCommentId',
  createdAt: 'createdAt'
};

exports.Prisma.FindingFeedbackScalarFieldEnum = {
  id: 'id',
  findingId: 'findingId',
  userId: 'userId',
  feedbackType: 'feedbackType',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.FixProposalScalarFieldEnum = {
  id: 'id',
  findingId: 'findingId',
  patch: 'patch',
  sandboxStatus: 'sandboxStatus',
  testResults: 'testResults',
  approvalStatus: 'approvalStatus',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  User: 'User',
  GithubInstallation: 'GithubInstallation',
  Repository: 'Repository',
  PullRequest: 'PullRequest',
  WebhookDelivery: 'WebhookDelivery',
  ReviewJob: 'ReviewJob',
  AgentRun: 'AgentRun',
  Finding: 'Finding',
  FindingFeedback: 'FindingFeedback',
  FixProposal: 'FixProposal'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
