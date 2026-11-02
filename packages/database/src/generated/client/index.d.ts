
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model GithubInstallation
 * 
 */
export type GithubInstallation = $Result.DefaultSelection<Prisma.$GithubInstallationPayload>
/**
 * Model Repository
 * 
 */
export type Repository = $Result.DefaultSelection<Prisma.$RepositoryPayload>
/**
 * Model PullRequest
 * 
 */
export type PullRequest = $Result.DefaultSelection<Prisma.$PullRequestPayload>
/**
 * Model WebhookDelivery
 * 
 */
export type WebhookDelivery = $Result.DefaultSelection<Prisma.$WebhookDeliveryPayload>
/**
 * Model ReviewJob
 * 
 */
export type ReviewJob = $Result.DefaultSelection<Prisma.$ReviewJobPayload>
/**
 * Model AgentRun
 * 
 */
export type AgentRun = $Result.DefaultSelection<Prisma.$AgentRunPayload>
/**
 * Model Finding
 * 
 */
export type Finding = $Result.DefaultSelection<Prisma.$FindingPayload>
/**
 * Model FindingFeedback
 * 
 */
export type FindingFeedback = $Result.DefaultSelection<Prisma.$FindingFeedbackPayload>
/**
 * Model FixProposal
 * 
 */
export type FixProposal = $Result.DefaultSelection<Prisma.$FixProposalPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.githubInstallation`: Exposes CRUD operations for the **GithubInstallation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GithubInstallations
    * const githubInstallations = await prisma.githubInstallation.findMany()
    * ```
    */
  get githubInstallation(): Prisma.GithubInstallationDelegate<ExtArgs>;

  /**
   * `prisma.repository`: Exposes CRUD operations for the **Repository** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Repositories
    * const repositories = await prisma.repository.findMany()
    * ```
    */
  get repository(): Prisma.RepositoryDelegate<ExtArgs>;

  /**
   * `prisma.pullRequest`: Exposes CRUD operations for the **PullRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PullRequests
    * const pullRequests = await prisma.pullRequest.findMany()
    * ```
    */
  get pullRequest(): Prisma.PullRequestDelegate<ExtArgs>;

  /**
   * `prisma.webhookDelivery`: Exposes CRUD operations for the **WebhookDelivery** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WebhookDeliveries
    * const webhookDeliveries = await prisma.webhookDelivery.findMany()
    * ```
    */
  get webhookDelivery(): Prisma.WebhookDeliveryDelegate<ExtArgs>;

  /**
   * `prisma.reviewJob`: Exposes CRUD operations for the **ReviewJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReviewJobs
    * const reviewJobs = await prisma.reviewJob.findMany()
    * ```
    */
  get reviewJob(): Prisma.ReviewJobDelegate<ExtArgs>;

  /**
   * `prisma.agentRun`: Exposes CRUD operations for the **AgentRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentRuns
    * const agentRuns = await prisma.agentRun.findMany()
    * ```
    */
  get agentRun(): Prisma.AgentRunDelegate<ExtArgs>;

  /**
   * `prisma.finding`: Exposes CRUD operations for the **Finding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Findings
    * const findings = await prisma.finding.findMany()
    * ```
    */
  get finding(): Prisma.FindingDelegate<ExtArgs>;

  /**
   * `prisma.findingFeedback`: Exposes CRUD operations for the **FindingFeedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FindingFeedbacks
    * const findingFeedbacks = await prisma.findingFeedback.findMany()
    * ```
    */
  get findingFeedback(): Prisma.FindingFeedbackDelegate<ExtArgs>;

  /**
   * `prisma.fixProposal`: Exposes CRUD operations for the **FixProposal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FixProposals
    * const fixProposals = await prisma.fixProposal.findMany()
    * ```
    */
  get fixProposal(): Prisma.FixProposalDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "githubInstallation" | "repository" | "pullRequest" | "webhookDelivery" | "reviewJob" | "agentRun" | "finding" | "findingFeedback" | "fixProposal"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      GithubInstallation: {
        payload: Prisma.$GithubInstallationPayload<ExtArgs>
        fields: Prisma.GithubInstallationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GithubInstallationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubInstallationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GithubInstallationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubInstallationPayload>
          }
          findFirst: {
            args: Prisma.GithubInstallationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubInstallationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GithubInstallationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubInstallationPayload>
          }
          findMany: {
            args: Prisma.GithubInstallationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubInstallationPayload>[]
          }
          create: {
            args: Prisma.GithubInstallationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubInstallationPayload>
          }
          createMany: {
            args: Prisma.GithubInstallationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GithubInstallationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubInstallationPayload>[]
          }
          delete: {
            args: Prisma.GithubInstallationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubInstallationPayload>
          }
          update: {
            args: Prisma.GithubInstallationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubInstallationPayload>
          }
          deleteMany: {
            args: Prisma.GithubInstallationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GithubInstallationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GithubInstallationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubInstallationPayload>
          }
          aggregate: {
            args: Prisma.GithubInstallationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGithubInstallation>
          }
          groupBy: {
            args: Prisma.GithubInstallationGroupByArgs<ExtArgs>
            result: $Utils.Optional<GithubInstallationGroupByOutputType>[]
          }
          count: {
            args: Prisma.GithubInstallationCountArgs<ExtArgs>
            result: $Utils.Optional<GithubInstallationCountAggregateOutputType> | number
          }
        }
      }
      Repository: {
        payload: Prisma.$RepositoryPayload<ExtArgs>
        fields: Prisma.RepositoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RepositoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepositoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RepositoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepositoryPayload>
          }
          findFirst: {
            args: Prisma.RepositoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepositoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RepositoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepositoryPayload>
          }
          findMany: {
            args: Prisma.RepositoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepositoryPayload>[]
          }
          create: {
            args: Prisma.RepositoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepositoryPayload>
          }
          createMany: {
            args: Prisma.RepositoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RepositoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepositoryPayload>[]
          }
          delete: {
            args: Prisma.RepositoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepositoryPayload>
          }
          update: {
            args: Prisma.RepositoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepositoryPayload>
          }
          deleteMany: {
            args: Prisma.RepositoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RepositoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RepositoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepositoryPayload>
          }
          aggregate: {
            args: Prisma.RepositoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRepository>
          }
          groupBy: {
            args: Prisma.RepositoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<RepositoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.RepositoryCountArgs<ExtArgs>
            result: $Utils.Optional<RepositoryCountAggregateOutputType> | number
          }
        }
      }
      PullRequest: {
        payload: Prisma.$PullRequestPayload<ExtArgs>
        fields: Prisma.PullRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PullRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PullRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          findFirst: {
            args: Prisma.PullRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PullRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          findMany: {
            args: Prisma.PullRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>[]
          }
          create: {
            args: Prisma.PullRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          createMany: {
            args: Prisma.PullRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PullRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>[]
          }
          delete: {
            args: Prisma.PullRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          update: {
            args: Prisma.PullRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          deleteMany: {
            args: Prisma.PullRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PullRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PullRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          aggregate: {
            args: Prisma.PullRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePullRequest>
          }
          groupBy: {
            args: Prisma.PullRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<PullRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.PullRequestCountArgs<ExtArgs>
            result: $Utils.Optional<PullRequestCountAggregateOutputType> | number
          }
        }
      }
      WebhookDelivery: {
        payload: Prisma.$WebhookDeliveryPayload<ExtArgs>
        fields: Prisma.WebhookDeliveryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WebhookDeliveryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WebhookDeliveryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          findFirst: {
            args: Prisma.WebhookDeliveryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WebhookDeliveryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          findMany: {
            args: Prisma.WebhookDeliveryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>[]
          }
          create: {
            args: Prisma.WebhookDeliveryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          createMany: {
            args: Prisma.WebhookDeliveryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WebhookDeliveryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>[]
          }
          delete: {
            args: Prisma.WebhookDeliveryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          update: {
            args: Prisma.WebhookDeliveryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          deleteMany: {
            args: Prisma.WebhookDeliveryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WebhookDeliveryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WebhookDeliveryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          aggregate: {
            args: Prisma.WebhookDeliveryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWebhookDelivery>
          }
          groupBy: {
            args: Prisma.WebhookDeliveryGroupByArgs<ExtArgs>
            result: $Utils.Optional<WebhookDeliveryGroupByOutputType>[]
          }
          count: {
            args: Prisma.WebhookDeliveryCountArgs<ExtArgs>
            result: $Utils.Optional<WebhookDeliveryCountAggregateOutputType> | number
          }
        }
      }
      ReviewJob: {
        payload: Prisma.$ReviewJobPayload<ExtArgs>
        fields: Prisma.ReviewJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReviewJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReviewJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewJobPayload>
          }
          findFirst: {
            args: Prisma.ReviewJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReviewJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewJobPayload>
          }
          findMany: {
            args: Prisma.ReviewJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewJobPayload>[]
          }
          create: {
            args: Prisma.ReviewJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewJobPayload>
          }
          createMany: {
            args: Prisma.ReviewJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReviewJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewJobPayload>[]
          }
          delete: {
            args: Prisma.ReviewJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewJobPayload>
          }
          update: {
            args: Prisma.ReviewJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewJobPayload>
          }
          deleteMany: {
            args: Prisma.ReviewJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReviewJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReviewJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewJobPayload>
          }
          aggregate: {
            args: Prisma.ReviewJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReviewJob>
          }
          groupBy: {
            args: Prisma.ReviewJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReviewJobCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewJobCountAggregateOutputType> | number
          }
        }
      }
      AgentRun: {
        payload: Prisma.$AgentRunPayload<ExtArgs>
        fields: Prisma.AgentRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          findFirst: {
            args: Prisma.AgentRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          findMany: {
            args: Prisma.AgentRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          create: {
            args: Prisma.AgentRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          createMany: {
            args: Prisma.AgentRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          delete: {
            args: Prisma.AgentRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          update: {
            args: Prisma.AgentRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          deleteMany: {
            args: Prisma.AgentRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AgentRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          aggregate: {
            args: Prisma.AgentRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentRun>
          }
          groupBy: {
            args: Prisma.AgentRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentRunCountArgs<ExtArgs>
            result: $Utils.Optional<AgentRunCountAggregateOutputType> | number
          }
        }
      }
      Finding: {
        payload: Prisma.$FindingPayload<ExtArgs>
        fields: Prisma.FindingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FindingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FindingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          findFirst: {
            args: Prisma.FindingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FindingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          findMany: {
            args: Prisma.FindingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>[]
          }
          create: {
            args: Prisma.FindingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          createMany: {
            args: Prisma.FindingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FindingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>[]
          }
          delete: {
            args: Prisma.FindingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          update: {
            args: Prisma.FindingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          deleteMany: {
            args: Prisma.FindingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FindingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FindingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          aggregate: {
            args: Prisma.FindingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFinding>
          }
          groupBy: {
            args: Prisma.FindingGroupByArgs<ExtArgs>
            result: $Utils.Optional<FindingGroupByOutputType>[]
          }
          count: {
            args: Prisma.FindingCountArgs<ExtArgs>
            result: $Utils.Optional<FindingCountAggregateOutputType> | number
          }
        }
      }
      FindingFeedback: {
        payload: Prisma.$FindingFeedbackPayload<ExtArgs>
        fields: Prisma.FindingFeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FindingFeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingFeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FindingFeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingFeedbackPayload>
          }
          findFirst: {
            args: Prisma.FindingFeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingFeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FindingFeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingFeedbackPayload>
          }
          findMany: {
            args: Prisma.FindingFeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingFeedbackPayload>[]
          }
          create: {
            args: Prisma.FindingFeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingFeedbackPayload>
          }
          createMany: {
            args: Prisma.FindingFeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FindingFeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingFeedbackPayload>[]
          }
          delete: {
            args: Prisma.FindingFeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingFeedbackPayload>
          }
          update: {
            args: Prisma.FindingFeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingFeedbackPayload>
          }
          deleteMany: {
            args: Prisma.FindingFeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FindingFeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FindingFeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingFeedbackPayload>
          }
          aggregate: {
            args: Prisma.FindingFeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFindingFeedback>
          }
          groupBy: {
            args: Prisma.FindingFeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<FindingFeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.FindingFeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<FindingFeedbackCountAggregateOutputType> | number
          }
        }
      }
      FixProposal: {
        payload: Prisma.$FixProposalPayload<ExtArgs>
        fields: Prisma.FixProposalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FixProposalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FixProposalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FixProposalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FixProposalPayload>
          }
          findFirst: {
            args: Prisma.FixProposalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FixProposalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FixProposalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FixProposalPayload>
          }
          findMany: {
            args: Prisma.FixProposalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FixProposalPayload>[]
          }
          create: {
            args: Prisma.FixProposalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FixProposalPayload>
          }
          createMany: {
            args: Prisma.FixProposalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FixProposalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FixProposalPayload>[]
          }
          delete: {
            args: Prisma.FixProposalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FixProposalPayload>
          }
          update: {
            args: Prisma.FixProposalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FixProposalPayload>
          }
          deleteMany: {
            args: Prisma.FixProposalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FixProposalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FixProposalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FixProposalPayload>
          }
          aggregate: {
            args: Prisma.FixProposalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFixProposal>
          }
          groupBy: {
            args: Prisma.FixProposalGroupByArgs<ExtArgs>
            result: $Utils.Optional<FixProposalGroupByOutputType>[]
          }
          count: {
            args: Prisma.FixProposalCountArgs<ExtArgs>
            result: $Utils.Optional<FixProposalCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    feedbacks: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    feedbacks?: boolean | UserCountOutputTypeCountFeedbacksArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFeedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FindingFeedbackWhereInput
  }


  /**
   * Count Type GithubInstallationCountOutputType
   */

  export type GithubInstallationCountOutputType = {
    repositories: number
  }

  export type GithubInstallationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repositories?: boolean | GithubInstallationCountOutputTypeCountRepositoriesArgs
  }

  // Custom InputTypes
  /**
   * GithubInstallationCountOutputType without action
   */
  export type GithubInstallationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallationCountOutputType
     */
    select?: GithubInstallationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GithubInstallationCountOutputType without action
   */
  export type GithubInstallationCountOutputTypeCountRepositoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RepositoryWhereInput
  }


  /**
   * Count Type RepositoryCountOutputType
   */

  export type RepositoryCountOutputType = {
    pullRequests: number
    reviewJobs: number
  }

  export type RepositoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pullRequests?: boolean | RepositoryCountOutputTypeCountPullRequestsArgs
    reviewJobs?: boolean | RepositoryCountOutputTypeCountReviewJobsArgs
  }

  // Custom InputTypes
  /**
   * RepositoryCountOutputType without action
   */
  export type RepositoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepositoryCountOutputType
     */
    select?: RepositoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RepositoryCountOutputType without action
   */
  export type RepositoryCountOutputTypeCountPullRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PullRequestWhereInput
  }

  /**
   * RepositoryCountOutputType without action
   */
  export type RepositoryCountOutputTypeCountReviewJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewJobWhereInput
  }


  /**
   * Count Type PullRequestCountOutputType
   */

  export type PullRequestCountOutputType = {
    reviewJobs: number
  }

  export type PullRequestCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviewJobs?: boolean | PullRequestCountOutputTypeCountReviewJobsArgs
  }

  // Custom InputTypes
  /**
   * PullRequestCountOutputType without action
   */
  export type PullRequestCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequestCountOutputType
     */
    select?: PullRequestCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PullRequestCountOutputType without action
   */
  export type PullRequestCountOutputTypeCountReviewJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewJobWhereInput
  }


  /**
   * Count Type ReviewJobCountOutputType
   */

  export type ReviewJobCountOutputType = {
    agentRuns: number
    findings: number
  }

  export type ReviewJobCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentRuns?: boolean | ReviewJobCountOutputTypeCountAgentRunsArgs
    findings?: boolean | ReviewJobCountOutputTypeCountFindingsArgs
  }

  // Custom InputTypes
  /**
   * ReviewJobCountOutputType without action
   */
  export type ReviewJobCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJobCountOutputType
     */
    select?: ReviewJobCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReviewJobCountOutputType without action
   */
  export type ReviewJobCountOutputTypeCountAgentRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentRunWhereInput
  }

  /**
   * ReviewJobCountOutputType without action
   */
  export type ReviewJobCountOutputTypeCountFindingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FindingWhereInput
  }


  /**
   * Count Type AgentRunCountOutputType
   */

  export type AgentRunCountOutputType = {
    findings: number
  }

  export type AgentRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    findings?: boolean | AgentRunCountOutputTypeCountFindingsArgs
  }

  // Custom InputTypes
  /**
   * AgentRunCountOutputType without action
   */
  export type AgentRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRunCountOutputType
     */
    select?: AgentRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AgentRunCountOutputType without action
   */
  export type AgentRunCountOutputTypeCountFindingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FindingWhereInput
  }


  /**
   * Count Type FindingCountOutputType
   */

  export type FindingCountOutputType = {
    feedbacks: number
  }

  export type FindingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    feedbacks?: boolean | FindingCountOutputTypeCountFeedbacksArgs
  }

  // Custom InputTypes
  /**
   * FindingCountOutputType without action
   */
  export type FindingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingCountOutputType
     */
    select?: FindingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FindingCountOutputType without action
   */
  export type FindingCountOutputTypeCountFeedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FindingFeedbackWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    displayName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    displayName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    displayName: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    displayName: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    feedbacks?: boolean | User$feedbacksArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    feedbacks?: boolean | User$feedbacksArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      feedbacks: Prisma.$FindingFeedbackPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      displayName: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    feedbacks<T extends User$feedbacksArgs<ExtArgs> = {}>(args?: Subset<T, User$feedbacksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly displayName: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.feedbacks
   */
  export type User$feedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    where?: FindingFeedbackWhereInput
    orderBy?: FindingFeedbackOrderByWithRelationInput | FindingFeedbackOrderByWithRelationInput[]
    cursor?: FindingFeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FindingFeedbackScalarFieldEnum | FindingFeedbackScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model GithubInstallation
   */

  export type AggregateGithubInstallation = {
    _count: GithubInstallationCountAggregateOutputType | null
    _avg: GithubInstallationAvgAggregateOutputType | null
    _sum: GithubInstallationSumAggregateOutputType | null
    _min: GithubInstallationMinAggregateOutputType | null
    _max: GithubInstallationMaxAggregateOutputType | null
  }

  export type GithubInstallationAvgAggregateOutputType = {
    githubInstallationId: number | null
  }

  export type GithubInstallationSumAggregateOutputType = {
    githubInstallationId: number | null
  }

  export type GithubInstallationMinAggregateOutputType = {
    id: string | null
    githubInstallationId: number | null
    accountLogin: string | null
    accountType: string | null
    encryptedCredentialsRef: string | null
    createdAt: Date | null
  }

  export type GithubInstallationMaxAggregateOutputType = {
    id: string | null
    githubInstallationId: number | null
    accountLogin: string | null
    accountType: string | null
    encryptedCredentialsRef: string | null
    createdAt: Date | null
  }

  export type GithubInstallationCountAggregateOutputType = {
    id: number
    githubInstallationId: number
    accountLogin: number
    accountType: number
    encryptedCredentialsRef: number
    createdAt: number
    _all: number
  }


  export type GithubInstallationAvgAggregateInputType = {
    githubInstallationId?: true
  }

  export type GithubInstallationSumAggregateInputType = {
    githubInstallationId?: true
  }

  export type GithubInstallationMinAggregateInputType = {
    id?: true
    githubInstallationId?: true
    accountLogin?: true
    accountType?: true
    encryptedCredentialsRef?: true
    createdAt?: true
  }

  export type GithubInstallationMaxAggregateInputType = {
    id?: true
    githubInstallationId?: true
    accountLogin?: true
    accountType?: true
    encryptedCredentialsRef?: true
    createdAt?: true
  }

  export type GithubInstallationCountAggregateInputType = {
    id?: true
    githubInstallationId?: true
    accountLogin?: true
    accountType?: true
    encryptedCredentialsRef?: true
    createdAt?: true
    _all?: true
  }

  export type GithubInstallationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GithubInstallation to aggregate.
     */
    where?: GithubInstallationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GithubInstallations to fetch.
     */
    orderBy?: GithubInstallationOrderByWithRelationInput | GithubInstallationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GithubInstallationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GithubInstallations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GithubInstallations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GithubInstallations
    **/
    _count?: true | GithubInstallationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GithubInstallationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GithubInstallationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GithubInstallationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GithubInstallationMaxAggregateInputType
  }

  export type GetGithubInstallationAggregateType<T extends GithubInstallationAggregateArgs> = {
        [P in keyof T & keyof AggregateGithubInstallation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGithubInstallation[P]>
      : GetScalarType<T[P], AggregateGithubInstallation[P]>
  }




  export type GithubInstallationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GithubInstallationWhereInput
    orderBy?: GithubInstallationOrderByWithAggregationInput | GithubInstallationOrderByWithAggregationInput[]
    by: GithubInstallationScalarFieldEnum[] | GithubInstallationScalarFieldEnum
    having?: GithubInstallationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GithubInstallationCountAggregateInputType | true
    _avg?: GithubInstallationAvgAggregateInputType
    _sum?: GithubInstallationSumAggregateInputType
    _min?: GithubInstallationMinAggregateInputType
    _max?: GithubInstallationMaxAggregateInputType
  }

  export type GithubInstallationGroupByOutputType = {
    id: string
    githubInstallationId: number
    accountLogin: string
    accountType: string
    encryptedCredentialsRef: string | null
    createdAt: Date
    _count: GithubInstallationCountAggregateOutputType | null
    _avg: GithubInstallationAvgAggregateOutputType | null
    _sum: GithubInstallationSumAggregateOutputType | null
    _min: GithubInstallationMinAggregateOutputType | null
    _max: GithubInstallationMaxAggregateOutputType | null
  }

  type GetGithubInstallationGroupByPayload<T extends GithubInstallationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GithubInstallationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GithubInstallationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GithubInstallationGroupByOutputType[P]>
            : GetScalarType<T[P], GithubInstallationGroupByOutputType[P]>
        }
      >
    >


  export type GithubInstallationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    githubInstallationId?: boolean
    accountLogin?: boolean
    accountType?: boolean
    encryptedCredentialsRef?: boolean
    createdAt?: boolean
    repositories?: boolean | GithubInstallation$repositoriesArgs<ExtArgs>
    _count?: boolean | GithubInstallationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["githubInstallation"]>

  export type GithubInstallationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    githubInstallationId?: boolean
    accountLogin?: boolean
    accountType?: boolean
    encryptedCredentialsRef?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["githubInstallation"]>

  export type GithubInstallationSelectScalar = {
    id?: boolean
    githubInstallationId?: boolean
    accountLogin?: boolean
    accountType?: boolean
    encryptedCredentialsRef?: boolean
    createdAt?: boolean
  }

  export type GithubInstallationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repositories?: boolean | GithubInstallation$repositoriesArgs<ExtArgs>
    _count?: boolean | GithubInstallationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GithubInstallationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GithubInstallationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GithubInstallation"
    objects: {
      repositories: Prisma.$RepositoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      githubInstallationId: number
      accountLogin: string
      accountType: string
      encryptedCredentialsRef: string | null
      createdAt: Date
    }, ExtArgs["result"]["githubInstallation"]>
    composites: {}
  }

  type GithubInstallationGetPayload<S extends boolean | null | undefined | GithubInstallationDefaultArgs> = $Result.GetResult<Prisma.$GithubInstallationPayload, S>

  type GithubInstallationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GithubInstallationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GithubInstallationCountAggregateInputType | true
    }

  export interface GithubInstallationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GithubInstallation'], meta: { name: 'GithubInstallation' } }
    /**
     * Find zero or one GithubInstallation that matches the filter.
     * @param {GithubInstallationFindUniqueArgs} args - Arguments to find a GithubInstallation
     * @example
     * // Get one GithubInstallation
     * const githubInstallation = await prisma.githubInstallation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GithubInstallationFindUniqueArgs>(args: SelectSubset<T, GithubInstallationFindUniqueArgs<ExtArgs>>): Prisma__GithubInstallationClient<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GithubInstallation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GithubInstallationFindUniqueOrThrowArgs} args - Arguments to find a GithubInstallation
     * @example
     * // Get one GithubInstallation
     * const githubInstallation = await prisma.githubInstallation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GithubInstallationFindUniqueOrThrowArgs>(args: SelectSubset<T, GithubInstallationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GithubInstallationClient<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GithubInstallation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubInstallationFindFirstArgs} args - Arguments to find a GithubInstallation
     * @example
     * // Get one GithubInstallation
     * const githubInstallation = await prisma.githubInstallation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GithubInstallationFindFirstArgs>(args?: SelectSubset<T, GithubInstallationFindFirstArgs<ExtArgs>>): Prisma__GithubInstallationClient<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GithubInstallation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubInstallationFindFirstOrThrowArgs} args - Arguments to find a GithubInstallation
     * @example
     * // Get one GithubInstallation
     * const githubInstallation = await prisma.githubInstallation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GithubInstallationFindFirstOrThrowArgs>(args?: SelectSubset<T, GithubInstallationFindFirstOrThrowArgs<ExtArgs>>): Prisma__GithubInstallationClient<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GithubInstallations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubInstallationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GithubInstallations
     * const githubInstallations = await prisma.githubInstallation.findMany()
     * 
     * // Get first 10 GithubInstallations
     * const githubInstallations = await prisma.githubInstallation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const githubInstallationWithIdOnly = await prisma.githubInstallation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GithubInstallationFindManyArgs>(args?: SelectSubset<T, GithubInstallationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GithubInstallation.
     * @param {GithubInstallationCreateArgs} args - Arguments to create a GithubInstallation.
     * @example
     * // Create one GithubInstallation
     * const GithubInstallation = await prisma.githubInstallation.create({
     *   data: {
     *     // ... data to create a GithubInstallation
     *   }
     * })
     * 
     */
    create<T extends GithubInstallationCreateArgs>(args: SelectSubset<T, GithubInstallationCreateArgs<ExtArgs>>): Prisma__GithubInstallationClient<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GithubInstallations.
     * @param {GithubInstallationCreateManyArgs} args - Arguments to create many GithubInstallations.
     * @example
     * // Create many GithubInstallations
     * const githubInstallation = await prisma.githubInstallation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GithubInstallationCreateManyArgs>(args?: SelectSubset<T, GithubInstallationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GithubInstallations and returns the data saved in the database.
     * @param {GithubInstallationCreateManyAndReturnArgs} args - Arguments to create many GithubInstallations.
     * @example
     * // Create many GithubInstallations
     * const githubInstallation = await prisma.githubInstallation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GithubInstallations and only return the `id`
     * const githubInstallationWithIdOnly = await prisma.githubInstallation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GithubInstallationCreateManyAndReturnArgs>(args?: SelectSubset<T, GithubInstallationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GithubInstallation.
     * @param {GithubInstallationDeleteArgs} args - Arguments to delete one GithubInstallation.
     * @example
     * // Delete one GithubInstallation
     * const GithubInstallation = await prisma.githubInstallation.delete({
     *   where: {
     *     // ... filter to delete one GithubInstallation
     *   }
     * })
     * 
     */
    delete<T extends GithubInstallationDeleteArgs>(args: SelectSubset<T, GithubInstallationDeleteArgs<ExtArgs>>): Prisma__GithubInstallationClient<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GithubInstallation.
     * @param {GithubInstallationUpdateArgs} args - Arguments to update one GithubInstallation.
     * @example
     * // Update one GithubInstallation
     * const githubInstallation = await prisma.githubInstallation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GithubInstallationUpdateArgs>(args: SelectSubset<T, GithubInstallationUpdateArgs<ExtArgs>>): Prisma__GithubInstallationClient<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GithubInstallations.
     * @param {GithubInstallationDeleteManyArgs} args - Arguments to filter GithubInstallations to delete.
     * @example
     * // Delete a few GithubInstallations
     * const { count } = await prisma.githubInstallation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GithubInstallationDeleteManyArgs>(args?: SelectSubset<T, GithubInstallationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GithubInstallations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubInstallationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GithubInstallations
     * const githubInstallation = await prisma.githubInstallation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GithubInstallationUpdateManyArgs>(args: SelectSubset<T, GithubInstallationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GithubInstallation.
     * @param {GithubInstallationUpsertArgs} args - Arguments to update or create a GithubInstallation.
     * @example
     * // Update or create a GithubInstallation
     * const githubInstallation = await prisma.githubInstallation.upsert({
     *   create: {
     *     // ... data to create a GithubInstallation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GithubInstallation we want to update
     *   }
     * })
     */
    upsert<T extends GithubInstallationUpsertArgs>(args: SelectSubset<T, GithubInstallationUpsertArgs<ExtArgs>>): Prisma__GithubInstallationClient<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GithubInstallations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubInstallationCountArgs} args - Arguments to filter GithubInstallations to count.
     * @example
     * // Count the number of GithubInstallations
     * const count = await prisma.githubInstallation.count({
     *   where: {
     *     // ... the filter for the GithubInstallations we want to count
     *   }
     * })
    **/
    count<T extends GithubInstallationCountArgs>(
      args?: Subset<T, GithubInstallationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GithubInstallationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GithubInstallation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubInstallationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GithubInstallationAggregateArgs>(args: Subset<T, GithubInstallationAggregateArgs>): Prisma.PrismaPromise<GetGithubInstallationAggregateType<T>>

    /**
     * Group by GithubInstallation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubInstallationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GithubInstallationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GithubInstallationGroupByArgs['orderBy'] }
        : { orderBy?: GithubInstallationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GithubInstallationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGithubInstallationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GithubInstallation model
   */
  readonly fields: GithubInstallationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GithubInstallation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GithubInstallationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    repositories<T extends GithubInstallation$repositoriesArgs<ExtArgs> = {}>(args?: Subset<T, GithubInstallation$repositoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GithubInstallation model
   */ 
  interface GithubInstallationFieldRefs {
    readonly id: FieldRef<"GithubInstallation", 'String'>
    readonly githubInstallationId: FieldRef<"GithubInstallation", 'Int'>
    readonly accountLogin: FieldRef<"GithubInstallation", 'String'>
    readonly accountType: FieldRef<"GithubInstallation", 'String'>
    readonly encryptedCredentialsRef: FieldRef<"GithubInstallation", 'String'>
    readonly createdAt: FieldRef<"GithubInstallation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GithubInstallation findUnique
   */
  export type GithubInstallationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubInstallationInclude<ExtArgs> | null
    /**
     * Filter, which GithubInstallation to fetch.
     */
    where: GithubInstallationWhereUniqueInput
  }

  /**
   * GithubInstallation findUniqueOrThrow
   */
  export type GithubInstallationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubInstallationInclude<ExtArgs> | null
    /**
     * Filter, which GithubInstallation to fetch.
     */
    where: GithubInstallationWhereUniqueInput
  }

  /**
   * GithubInstallation findFirst
   */
  export type GithubInstallationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubInstallationInclude<ExtArgs> | null
    /**
     * Filter, which GithubInstallation to fetch.
     */
    where?: GithubInstallationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GithubInstallations to fetch.
     */
    orderBy?: GithubInstallationOrderByWithRelationInput | GithubInstallationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GithubInstallations.
     */
    cursor?: GithubInstallationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GithubInstallations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GithubInstallations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GithubInstallations.
     */
    distinct?: GithubInstallationScalarFieldEnum | GithubInstallationScalarFieldEnum[]
  }

  /**
   * GithubInstallation findFirstOrThrow
   */
  export type GithubInstallationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubInstallationInclude<ExtArgs> | null
    /**
     * Filter, which GithubInstallation to fetch.
     */
    where?: GithubInstallationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GithubInstallations to fetch.
     */
    orderBy?: GithubInstallationOrderByWithRelationInput | GithubInstallationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GithubInstallations.
     */
    cursor?: GithubInstallationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GithubInstallations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GithubInstallations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GithubInstallations.
     */
    distinct?: GithubInstallationScalarFieldEnum | GithubInstallationScalarFieldEnum[]
  }

  /**
   * GithubInstallation findMany
   */
  export type GithubInstallationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubInstallationInclude<ExtArgs> | null
    /**
     * Filter, which GithubInstallations to fetch.
     */
    where?: GithubInstallationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GithubInstallations to fetch.
     */
    orderBy?: GithubInstallationOrderByWithRelationInput | GithubInstallationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GithubInstallations.
     */
    cursor?: GithubInstallationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GithubInstallations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GithubInstallations.
     */
    skip?: number
    distinct?: GithubInstallationScalarFieldEnum | GithubInstallationScalarFieldEnum[]
  }

  /**
   * GithubInstallation create
   */
  export type GithubInstallationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubInstallationInclude<ExtArgs> | null
    /**
     * The data needed to create a GithubInstallation.
     */
    data: XOR<GithubInstallationCreateInput, GithubInstallationUncheckedCreateInput>
  }

  /**
   * GithubInstallation createMany
   */
  export type GithubInstallationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GithubInstallations.
     */
    data: GithubInstallationCreateManyInput | GithubInstallationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GithubInstallation createManyAndReturn
   */
  export type GithubInstallationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GithubInstallations.
     */
    data: GithubInstallationCreateManyInput | GithubInstallationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GithubInstallation update
   */
  export type GithubInstallationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubInstallationInclude<ExtArgs> | null
    /**
     * The data needed to update a GithubInstallation.
     */
    data: XOR<GithubInstallationUpdateInput, GithubInstallationUncheckedUpdateInput>
    /**
     * Choose, which GithubInstallation to update.
     */
    where: GithubInstallationWhereUniqueInput
  }

  /**
   * GithubInstallation updateMany
   */
  export type GithubInstallationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GithubInstallations.
     */
    data: XOR<GithubInstallationUpdateManyMutationInput, GithubInstallationUncheckedUpdateManyInput>
    /**
     * Filter which GithubInstallations to update
     */
    where?: GithubInstallationWhereInput
  }

  /**
   * GithubInstallation upsert
   */
  export type GithubInstallationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubInstallationInclude<ExtArgs> | null
    /**
     * The filter to search for the GithubInstallation to update in case it exists.
     */
    where: GithubInstallationWhereUniqueInput
    /**
     * In case the GithubInstallation found by the `where` argument doesn't exist, create a new GithubInstallation with this data.
     */
    create: XOR<GithubInstallationCreateInput, GithubInstallationUncheckedCreateInput>
    /**
     * In case the GithubInstallation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GithubInstallationUpdateInput, GithubInstallationUncheckedUpdateInput>
  }

  /**
   * GithubInstallation delete
   */
  export type GithubInstallationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubInstallationInclude<ExtArgs> | null
    /**
     * Filter which GithubInstallation to delete.
     */
    where: GithubInstallationWhereUniqueInput
  }

  /**
   * GithubInstallation deleteMany
   */
  export type GithubInstallationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GithubInstallations to delete
     */
    where?: GithubInstallationWhereInput
  }

  /**
   * GithubInstallation.repositories
   */
  export type GithubInstallation$repositoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
    where?: RepositoryWhereInput
    orderBy?: RepositoryOrderByWithRelationInput | RepositoryOrderByWithRelationInput[]
    cursor?: RepositoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RepositoryScalarFieldEnum | RepositoryScalarFieldEnum[]
  }

  /**
   * GithubInstallation without action
   */
  export type GithubInstallationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubInstallation
     */
    select?: GithubInstallationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubInstallationInclude<ExtArgs> | null
  }


  /**
   * Model Repository
   */

  export type AggregateRepository = {
    _count: RepositoryCountAggregateOutputType | null
    _avg: RepositoryAvgAggregateOutputType | null
    _sum: RepositorySumAggregateOutputType | null
    _min: RepositoryMinAggregateOutputType | null
    _max: RepositoryMaxAggregateOutputType | null
  }

  export type RepositoryAvgAggregateOutputType = {
    githubRepositoryId: number | null
  }

  export type RepositorySumAggregateOutputType = {
    githubRepositoryId: number | null
  }

  export type RepositoryMinAggregateOutputType = {
    id: string | null
    githubRepositoryId: number | null
    installationId: string | null
    owner: string | null
    name: string | null
    defaultBranch: string | null
    isEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RepositoryMaxAggregateOutputType = {
    id: string | null
    githubRepositoryId: number | null
    installationId: string | null
    owner: string | null
    name: string | null
    defaultBranch: string | null
    isEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RepositoryCountAggregateOutputType = {
    id: number
    githubRepositoryId: number
    installationId: number
    owner: number
    name: number
    defaultBranch: number
    isEnabled: number
    reviewConfig: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RepositoryAvgAggregateInputType = {
    githubRepositoryId?: true
  }

  export type RepositorySumAggregateInputType = {
    githubRepositoryId?: true
  }

  export type RepositoryMinAggregateInputType = {
    id?: true
    githubRepositoryId?: true
    installationId?: true
    owner?: true
    name?: true
    defaultBranch?: true
    isEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RepositoryMaxAggregateInputType = {
    id?: true
    githubRepositoryId?: true
    installationId?: true
    owner?: true
    name?: true
    defaultBranch?: true
    isEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RepositoryCountAggregateInputType = {
    id?: true
    githubRepositoryId?: true
    installationId?: true
    owner?: true
    name?: true
    defaultBranch?: true
    isEnabled?: true
    reviewConfig?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RepositoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Repository to aggregate.
     */
    where?: RepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repositories to fetch.
     */
    orderBy?: RepositoryOrderByWithRelationInput | RepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Repositories
    **/
    _count?: true | RepositoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RepositoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RepositorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RepositoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RepositoryMaxAggregateInputType
  }

  export type GetRepositoryAggregateType<T extends RepositoryAggregateArgs> = {
        [P in keyof T & keyof AggregateRepository]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRepository[P]>
      : GetScalarType<T[P], AggregateRepository[P]>
  }




  export type RepositoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RepositoryWhereInput
    orderBy?: RepositoryOrderByWithAggregationInput | RepositoryOrderByWithAggregationInput[]
    by: RepositoryScalarFieldEnum[] | RepositoryScalarFieldEnum
    having?: RepositoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RepositoryCountAggregateInputType | true
    _avg?: RepositoryAvgAggregateInputType
    _sum?: RepositorySumAggregateInputType
    _min?: RepositoryMinAggregateInputType
    _max?: RepositoryMaxAggregateInputType
  }

  export type RepositoryGroupByOutputType = {
    id: string
    githubRepositoryId: number
    installationId: string
    owner: string
    name: string
    defaultBranch: string
    isEnabled: boolean
    reviewConfig: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: RepositoryCountAggregateOutputType | null
    _avg: RepositoryAvgAggregateOutputType | null
    _sum: RepositorySumAggregateOutputType | null
    _min: RepositoryMinAggregateOutputType | null
    _max: RepositoryMaxAggregateOutputType | null
  }

  type GetRepositoryGroupByPayload<T extends RepositoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RepositoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RepositoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RepositoryGroupByOutputType[P]>
            : GetScalarType<T[P], RepositoryGroupByOutputType[P]>
        }
      >
    >


  export type RepositorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    githubRepositoryId?: boolean
    installationId?: boolean
    owner?: boolean
    name?: boolean
    defaultBranch?: boolean
    isEnabled?: boolean
    reviewConfig?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    installation?: boolean | GithubInstallationDefaultArgs<ExtArgs>
    pullRequests?: boolean | Repository$pullRequestsArgs<ExtArgs>
    reviewJobs?: boolean | Repository$reviewJobsArgs<ExtArgs>
    _count?: boolean | RepositoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repository"]>

  export type RepositorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    githubRepositoryId?: boolean
    installationId?: boolean
    owner?: boolean
    name?: boolean
    defaultBranch?: boolean
    isEnabled?: boolean
    reviewConfig?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    installation?: boolean | GithubInstallationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repository"]>

  export type RepositorySelectScalar = {
    id?: boolean
    githubRepositoryId?: boolean
    installationId?: boolean
    owner?: boolean
    name?: boolean
    defaultBranch?: boolean
    isEnabled?: boolean
    reviewConfig?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RepositoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    installation?: boolean | GithubInstallationDefaultArgs<ExtArgs>
    pullRequests?: boolean | Repository$pullRequestsArgs<ExtArgs>
    reviewJobs?: boolean | Repository$reviewJobsArgs<ExtArgs>
    _count?: boolean | RepositoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RepositoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    installation?: boolean | GithubInstallationDefaultArgs<ExtArgs>
  }

  export type $RepositoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Repository"
    objects: {
      installation: Prisma.$GithubInstallationPayload<ExtArgs>
      pullRequests: Prisma.$PullRequestPayload<ExtArgs>[]
      reviewJobs: Prisma.$ReviewJobPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      githubRepositoryId: number
      installationId: string
      owner: string
      name: string
      defaultBranch: string
      isEnabled: boolean
      reviewConfig: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["repository"]>
    composites: {}
  }

  type RepositoryGetPayload<S extends boolean | null | undefined | RepositoryDefaultArgs> = $Result.GetResult<Prisma.$RepositoryPayload, S>

  type RepositoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RepositoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RepositoryCountAggregateInputType | true
    }

  export interface RepositoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Repository'], meta: { name: 'Repository' } }
    /**
     * Find zero or one Repository that matches the filter.
     * @param {RepositoryFindUniqueArgs} args - Arguments to find a Repository
     * @example
     * // Get one Repository
     * const repository = await prisma.repository.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RepositoryFindUniqueArgs>(args: SelectSubset<T, RepositoryFindUniqueArgs<ExtArgs>>): Prisma__RepositoryClient<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Repository that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RepositoryFindUniqueOrThrowArgs} args - Arguments to find a Repository
     * @example
     * // Get one Repository
     * const repository = await prisma.repository.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RepositoryFindUniqueOrThrowArgs>(args: SelectSubset<T, RepositoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RepositoryClient<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Repository that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryFindFirstArgs} args - Arguments to find a Repository
     * @example
     * // Get one Repository
     * const repository = await prisma.repository.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RepositoryFindFirstArgs>(args?: SelectSubset<T, RepositoryFindFirstArgs<ExtArgs>>): Prisma__RepositoryClient<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Repository that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryFindFirstOrThrowArgs} args - Arguments to find a Repository
     * @example
     * // Get one Repository
     * const repository = await prisma.repository.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RepositoryFindFirstOrThrowArgs>(args?: SelectSubset<T, RepositoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__RepositoryClient<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Repositories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Repositories
     * const repositories = await prisma.repository.findMany()
     * 
     * // Get first 10 Repositories
     * const repositories = await prisma.repository.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const repositoryWithIdOnly = await prisma.repository.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RepositoryFindManyArgs>(args?: SelectSubset<T, RepositoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Repository.
     * @param {RepositoryCreateArgs} args - Arguments to create a Repository.
     * @example
     * // Create one Repository
     * const Repository = await prisma.repository.create({
     *   data: {
     *     // ... data to create a Repository
     *   }
     * })
     * 
     */
    create<T extends RepositoryCreateArgs>(args: SelectSubset<T, RepositoryCreateArgs<ExtArgs>>): Prisma__RepositoryClient<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Repositories.
     * @param {RepositoryCreateManyArgs} args - Arguments to create many Repositories.
     * @example
     * // Create many Repositories
     * const repository = await prisma.repository.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RepositoryCreateManyArgs>(args?: SelectSubset<T, RepositoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Repositories and returns the data saved in the database.
     * @param {RepositoryCreateManyAndReturnArgs} args - Arguments to create many Repositories.
     * @example
     * // Create many Repositories
     * const repository = await prisma.repository.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Repositories and only return the `id`
     * const repositoryWithIdOnly = await prisma.repository.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RepositoryCreateManyAndReturnArgs>(args?: SelectSubset<T, RepositoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Repository.
     * @param {RepositoryDeleteArgs} args - Arguments to delete one Repository.
     * @example
     * // Delete one Repository
     * const Repository = await prisma.repository.delete({
     *   where: {
     *     // ... filter to delete one Repository
     *   }
     * })
     * 
     */
    delete<T extends RepositoryDeleteArgs>(args: SelectSubset<T, RepositoryDeleteArgs<ExtArgs>>): Prisma__RepositoryClient<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Repository.
     * @param {RepositoryUpdateArgs} args - Arguments to update one Repository.
     * @example
     * // Update one Repository
     * const repository = await prisma.repository.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RepositoryUpdateArgs>(args: SelectSubset<T, RepositoryUpdateArgs<ExtArgs>>): Prisma__RepositoryClient<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Repositories.
     * @param {RepositoryDeleteManyArgs} args - Arguments to filter Repositories to delete.
     * @example
     * // Delete a few Repositories
     * const { count } = await prisma.repository.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RepositoryDeleteManyArgs>(args?: SelectSubset<T, RepositoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Repositories
     * const repository = await prisma.repository.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RepositoryUpdateManyArgs>(args: SelectSubset<T, RepositoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Repository.
     * @param {RepositoryUpsertArgs} args - Arguments to update or create a Repository.
     * @example
     * // Update or create a Repository
     * const repository = await prisma.repository.upsert({
     *   create: {
     *     // ... data to create a Repository
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Repository we want to update
     *   }
     * })
     */
    upsert<T extends RepositoryUpsertArgs>(args: SelectSubset<T, RepositoryUpsertArgs<ExtArgs>>): Prisma__RepositoryClient<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryCountArgs} args - Arguments to filter Repositories to count.
     * @example
     * // Count the number of Repositories
     * const count = await prisma.repository.count({
     *   where: {
     *     // ... the filter for the Repositories we want to count
     *   }
     * })
    **/
    count<T extends RepositoryCountArgs>(
      args?: Subset<T, RepositoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RepositoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Repository.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RepositoryAggregateArgs>(args: Subset<T, RepositoryAggregateArgs>): Prisma.PrismaPromise<GetRepositoryAggregateType<T>>

    /**
     * Group by Repository.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RepositoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RepositoryGroupByArgs['orderBy'] }
        : { orderBy?: RepositoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RepositoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRepositoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Repository model
   */
  readonly fields: RepositoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Repository.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RepositoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    installation<T extends GithubInstallationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GithubInstallationDefaultArgs<ExtArgs>>): Prisma__GithubInstallationClient<$Result.GetResult<Prisma.$GithubInstallationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    pullRequests<T extends Repository$pullRequestsArgs<ExtArgs> = {}>(args?: Subset<T, Repository$pullRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findMany"> | Null>
    reviewJobs<T extends Repository$reviewJobsArgs<ExtArgs> = {}>(args?: Subset<T, Repository$reviewJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Repository model
   */ 
  interface RepositoryFieldRefs {
    readonly id: FieldRef<"Repository", 'String'>
    readonly githubRepositoryId: FieldRef<"Repository", 'Int'>
    readonly installationId: FieldRef<"Repository", 'String'>
    readonly owner: FieldRef<"Repository", 'String'>
    readonly name: FieldRef<"Repository", 'String'>
    readonly defaultBranch: FieldRef<"Repository", 'String'>
    readonly isEnabled: FieldRef<"Repository", 'Boolean'>
    readonly reviewConfig: FieldRef<"Repository", 'Json'>
    readonly createdAt: FieldRef<"Repository", 'DateTime'>
    readonly updatedAt: FieldRef<"Repository", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Repository findUnique
   */
  export type RepositoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
    /**
     * Filter, which Repository to fetch.
     */
    where: RepositoryWhereUniqueInput
  }

  /**
   * Repository findUniqueOrThrow
   */
  export type RepositoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
    /**
     * Filter, which Repository to fetch.
     */
    where: RepositoryWhereUniqueInput
  }

  /**
   * Repository findFirst
   */
  export type RepositoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
    /**
     * Filter, which Repository to fetch.
     */
    where?: RepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repositories to fetch.
     */
    orderBy?: RepositoryOrderByWithRelationInput | RepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Repositories.
     */
    cursor?: RepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Repositories.
     */
    distinct?: RepositoryScalarFieldEnum | RepositoryScalarFieldEnum[]
  }

  /**
   * Repository findFirstOrThrow
   */
  export type RepositoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
    /**
     * Filter, which Repository to fetch.
     */
    where?: RepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repositories to fetch.
     */
    orderBy?: RepositoryOrderByWithRelationInput | RepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Repositories.
     */
    cursor?: RepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Repositories.
     */
    distinct?: RepositoryScalarFieldEnum | RepositoryScalarFieldEnum[]
  }

  /**
   * Repository findMany
   */
  export type RepositoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
    /**
     * Filter, which Repositories to fetch.
     */
    where?: RepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repositories to fetch.
     */
    orderBy?: RepositoryOrderByWithRelationInput | RepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Repositories.
     */
    cursor?: RepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repositories.
     */
    skip?: number
    distinct?: RepositoryScalarFieldEnum | RepositoryScalarFieldEnum[]
  }

  /**
   * Repository create
   */
  export type RepositoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Repository.
     */
    data: XOR<RepositoryCreateInput, RepositoryUncheckedCreateInput>
  }

  /**
   * Repository createMany
   */
  export type RepositoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Repositories.
     */
    data: RepositoryCreateManyInput | RepositoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Repository createManyAndReturn
   */
  export type RepositoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Repositories.
     */
    data: RepositoryCreateManyInput | RepositoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Repository update
   */
  export type RepositoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Repository.
     */
    data: XOR<RepositoryUpdateInput, RepositoryUncheckedUpdateInput>
    /**
     * Choose, which Repository to update.
     */
    where: RepositoryWhereUniqueInput
  }

  /**
   * Repository updateMany
   */
  export type RepositoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Repositories.
     */
    data: XOR<RepositoryUpdateManyMutationInput, RepositoryUncheckedUpdateManyInput>
    /**
     * Filter which Repositories to update
     */
    where?: RepositoryWhereInput
  }

  /**
   * Repository upsert
   */
  export type RepositoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Repository to update in case it exists.
     */
    where: RepositoryWhereUniqueInput
    /**
     * In case the Repository found by the `where` argument doesn't exist, create a new Repository with this data.
     */
    create: XOR<RepositoryCreateInput, RepositoryUncheckedCreateInput>
    /**
     * In case the Repository was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RepositoryUpdateInput, RepositoryUncheckedUpdateInput>
  }

  /**
   * Repository delete
   */
  export type RepositoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
    /**
     * Filter which Repository to delete.
     */
    where: RepositoryWhereUniqueInput
  }

  /**
   * Repository deleteMany
   */
  export type RepositoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Repositories to delete
     */
    where?: RepositoryWhereInput
  }

  /**
   * Repository.pullRequests
   */
  export type Repository$pullRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    where?: PullRequestWhereInput
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    cursor?: PullRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PullRequestScalarFieldEnum | PullRequestScalarFieldEnum[]
  }

  /**
   * Repository.reviewJobs
   */
  export type Repository$reviewJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    where?: ReviewJobWhereInput
    orderBy?: ReviewJobOrderByWithRelationInput | ReviewJobOrderByWithRelationInput[]
    cursor?: ReviewJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewJobScalarFieldEnum | ReviewJobScalarFieldEnum[]
  }

  /**
   * Repository without action
   */
  export type RepositoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repository
     */
    select?: RepositorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepositoryInclude<ExtArgs> | null
  }


  /**
   * Model PullRequest
   */

  export type AggregatePullRequest = {
    _count: PullRequestCountAggregateOutputType | null
    _avg: PullRequestAvgAggregateOutputType | null
    _sum: PullRequestSumAggregateOutputType | null
    _min: PullRequestMinAggregateOutputType | null
    _max: PullRequestMaxAggregateOutputType | null
  }

  export type PullRequestAvgAggregateOutputType = {
    githubPrNumber: number | null
  }

  export type PullRequestSumAggregateOutputType = {
    githubPrNumber: number | null
  }

  export type PullRequestMinAggregateOutputType = {
    id: string | null
    repositoryId: string | null
    githubPrNumber: number | null
    title: string | null
    author: string | null
    baseSha: string | null
    headSha: string | null
    state: string | null
    updatedAt: Date | null
  }

  export type PullRequestMaxAggregateOutputType = {
    id: string | null
    repositoryId: string | null
    githubPrNumber: number | null
    title: string | null
    author: string | null
    baseSha: string | null
    headSha: string | null
    state: string | null
    updatedAt: Date | null
  }

  export type PullRequestCountAggregateOutputType = {
    id: number
    repositoryId: number
    githubPrNumber: number
    title: number
    author: number
    baseSha: number
    headSha: number
    state: number
    updatedAt: number
    _all: number
  }


  export type PullRequestAvgAggregateInputType = {
    githubPrNumber?: true
  }

  export type PullRequestSumAggregateInputType = {
    githubPrNumber?: true
  }

  export type PullRequestMinAggregateInputType = {
    id?: true
    repositoryId?: true
    githubPrNumber?: true
    title?: true
    author?: true
    baseSha?: true
    headSha?: true
    state?: true
    updatedAt?: true
  }

  export type PullRequestMaxAggregateInputType = {
    id?: true
    repositoryId?: true
    githubPrNumber?: true
    title?: true
    author?: true
    baseSha?: true
    headSha?: true
    state?: true
    updatedAt?: true
  }

  export type PullRequestCountAggregateInputType = {
    id?: true
    repositoryId?: true
    githubPrNumber?: true
    title?: true
    author?: true
    baseSha?: true
    headSha?: true
    state?: true
    updatedAt?: true
    _all?: true
  }

  export type PullRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PullRequest to aggregate.
     */
    where?: PullRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PullRequests to fetch.
     */
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PullRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PullRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PullRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PullRequests
    **/
    _count?: true | PullRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PullRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PullRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PullRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PullRequestMaxAggregateInputType
  }

  export type GetPullRequestAggregateType<T extends PullRequestAggregateArgs> = {
        [P in keyof T & keyof AggregatePullRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePullRequest[P]>
      : GetScalarType<T[P], AggregatePullRequest[P]>
  }




  export type PullRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PullRequestWhereInput
    orderBy?: PullRequestOrderByWithAggregationInput | PullRequestOrderByWithAggregationInput[]
    by: PullRequestScalarFieldEnum[] | PullRequestScalarFieldEnum
    having?: PullRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PullRequestCountAggregateInputType | true
    _avg?: PullRequestAvgAggregateInputType
    _sum?: PullRequestSumAggregateInputType
    _min?: PullRequestMinAggregateInputType
    _max?: PullRequestMaxAggregateInputType
  }

  export type PullRequestGroupByOutputType = {
    id: string
    repositoryId: string
    githubPrNumber: number
    title: string
    author: string
    baseSha: string
    headSha: string
    state: string
    updatedAt: Date
    _count: PullRequestCountAggregateOutputType | null
    _avg: PullRequestAvgAggregateOutputType | null
    _sum: PullRequestSumAggregateOutputType | null
    _min: PullRequestMinAggregateOutputType | null
    _max: PullRequestMaxAggregateOutputType | null
  }

  type GetPullRequestGroupByPayload<T extends PullRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PullRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PullRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PullRequestGroupByOutputType[P]>
            : GetScalarType<T[P], PullRequestGroupByOutputType[P]>
        }
      >
    >


  export type PullRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repositoryId?: boolean
    githubPrNumber?: boolean
    title?: boolean
    author?: boolean
    baseSha?: boolean
    headSha?: boolean
    state?: boolean
    updatedAt?: boolean
    repository?: boolean | RepositoryDefaultArgs<ExtArgs>
    reviewJobs?: boolean | PullRequest$reviewJobsArgs<ExtArgs>
    _count?: boolean | PullRequestCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pullRequest"]>

  export type PullRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repositoryId?: boolean
    githubPrNumber?: boolean
    title?: boolean
    author?: boolean
    baseSha?: boolean
    headSha?: boolean
    state?: boolean
    updatedAt?: boolean
    repository?: boolean | RepositoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pullRequest"]>

  export type PullRequestSelectScalar = {
    id?: boolean
    repositoryId?: boolean
    githubPrNumber?: boolean
    title?: boolean
    author?: boolean
    baseSha?: boolean
    headSha?: boolean
    state?: boolean
    updatedAt?: boolean
  }

  export type PullRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repository?: boolean | RepositoryDefaultArgs<ExtArgs>
    reviewJobs?: boolean | PullRequest$reviewJobsArgs<ExtArgs>
    _count?: boolean | PullRequestCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PullRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repository?: boolean | RepositoryDefaultArgs<ExtArgs>
  }

  export type $PullRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PullRequest"
    objects: {
      repository: Prisma.$RepositoryPayload<ExtArgs>
      reviewJobs: Prisma.$ReviewJobPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      repositoryId: string
      githubPrNumber: number
      title: string
      author: string
      baseSha: string
      headSha: string
      state: string
      updatedAt: Date
    }, ExtArgs["result"]["pullRequest"]>
    composites: {}
  }

  type PullRequestGetPayload<S extends boolean | null | undefined | PullRequestDefaultArgs> = $Result.GetResult<Prisma.$PullRequestPayload, S>

  type PullRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PullRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PullRequestCountAggregateInputType | true
    }

  export interface PullRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PullRequest'], meta: { name: 'PullRequest' } }
    /**
     * Find zero or one PullRequest that matches the filter.
     * @param {PullRequestFindUniqueArgs} args - Arguments to find a PullRequest
     * @example
     * // Get one PullRequest
     * const pullRequest = await prisma.pullRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PullRequestFindUniqueArgs>(args: SelectSubset<T, PullRequestFindUniqueArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PullRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PullRequestFindUniqueOrThrowArgs} args - Arguments to find a PullRequest
     * @example
     * // Get one PullRequest
     * const pullRequest = await prisma.pullRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PullRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, PullRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PullRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestFindFirstArgs} args - Arguments to find a PullRequest
     * @example
     * // Get one PullRequest
     * const pullRequest = await prisma.pullRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PullRequestFindFirstArgs>(args?: SelectSubset<T, PullRequestFindFirstArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PullRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestFindFirstOrThrowArgs} args - Arguments to find a PullRequest
     * @example
     * // Get one PullRequest
     * const pullRequest = await prisma.pullRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PullRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, PullRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PullRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PullRequests
     * const pullRequests = await prisma.pullRequest.findMany()
     * 
     * // Get first 10 PullRequests
     * const pullRequests = await prisma.pullRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pullRequestWithIdOnly = await prisma.pullRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PullRequestFindManyArgs>(args?: SelectSubset<T, PullRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PullRequest.
     * @param {PullRequestCreateArgs} args - Arguments to create a PullRequest.
     * @example
     * // Create one PullRequest
     * const PullRequest = await prisma.pullRequest.create({
     *   data: {
     *     // ... data to create a PullRequest
     *   }
     * })
     * 
     */
    create<T extends PullRequestCreateArgs>(args: SelectSubset<T, PullRequestCreateArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PullRequests.
     * @param {PullRequestCreateManyArgs} args - Arguments to create many PullRequests.
     * @example
     * // Create many PullRequests
     * const pullRequest = await prisma.pullRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PullRequestCreateManyArgs>(args?: SelectSubset<T, PullRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PullRequests and returns the data saved in the database.
     * @param {PullRequestCreateManyAndReturnArgs} args - Arguments to create many PullRequests.
     * @example
     * // Create many PullRequests
     * const pullRequest = await prisma.pullRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PullRequests and only return the `id`
     * const pullRequestWithIdOnly = await prisma.pullRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PullRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, PullRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PullRequest.
     * @param {PullRequestDeleteArgs} args - Arguments to delete one PullRequest.
     * @example
     * // Delete one PullRequest
     * const PullRequest = await prisma.pullRequest.delete({
     *   where: {
     *     // ... filter to delete one PullRequest
     *   }
     * })
     * 
     */
    delete<T extends PullRequestDeleteArgs>(args: SelectSubset<T, PullRequestDeleteArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PullRequest.
     * @param {PullRequestUpdateArgs} args - Arguments to update one PullRequest.
     * @example
     * // Update one PullRequest
     * const pullRequest = await prisma.pullRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PullRequestUpdateArgs>(args: SelectSubset<T, PullRequestUpdateArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PullRequests.
     * @param {PullRequestDeleteManyArgs} args - Arguments to filter PullRequests to delete.
     * @example
     * // Delete a few PullRequests
     * const { count } = await prisma.pullRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PullRequestDeleteManyArgs>(args?: SelectSubset<T, PullRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PullRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PullRequests
     * const pullRequest = await prisma.pullRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PullRequestUpdateManyArgs>(args: SelectSubset<T, PullRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PullRequest.
     * @param {PullRequestUpsertArgs} args - Arguments to update or create a PullRequest.
     * @example
     * // Update or create a PullRequest
     * const pullRequest = await prisma.pullRequest.upsert({
     *   create: {
     *     // ... data to create a PullRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PullRequest we want to update
     *   }
     * })
     */
    upsert<T extends PullRequestUpsertArgs>(args: SelectSubset<T, PullRequestUpsertArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PullRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestCountArgs} args - Arguments to filter PullRequests to count.
     * @example
     * // Count the number of PullRequests
     * const count = await prisma.pullRequest.count({
     *   where: {
     *     // ... the filter for the PullRequests we want to count
     *   }
     * })
    **/
    count<T extends PullRequestCountArgs>(
      args?: Subset<T, PullRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PullRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PullRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PullRequestAggregateArgs>(args: Subset<T, PullRequestAggregateArgs>): Prisma.PrismaPromise<GetPullRequestAggregateType<T>>

    /**
     * Group by PullRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PullRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PullRequestGroupByArgs['orderBy'] }
        : { orderBy?: PullRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PullRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPullRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PullRequest model
   */
  readonly fields: PullRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PullRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PullRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    repository<T extends RepositoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RepositoryDefaultArgs<ExtArgs>>): Prisma__RepositoryClient<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    reviewJobs<T extends PullRequest$reviewJobsArgs<ExtArgs> = {}>(args?: Subset<T, PullRequest$reviewJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PullRequest model
   */ 
  interface PullRequestFieldRefs {
    readonly id: FieldRef<"PullRequest", 'String'>
    readonly repositoryId: FieldRef<"PullRequest", 'String'>
    readonly githubPrNumber: FieldRef<"PullRequest", 'Int'>
    readonly title: FieldRef<"PullRequest", 'String'>
    readonly author: FieldRef<"PullRequest", 'String'>
    readonly baseSha: FieldRef<"PullRequest", 'String'>
    readonly headSha: FieldRef<"PullRequest", 'String'>
    readonly state: FieldRef<"PullRequest", 'String'>
    readonly updatedAt: FieldRef<"PullRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PullRequest findUnique
   */
  export type PullRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter, which PullRequest to fetch.
     */
    where: PullRequestWhereUniqueInput
  }

  /**
   * PullRequest findUniqueOrThrow
   */
  export type PullRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter, which PullRequest to fetch.
     */
    where: PullRequestWhereUniqueInput
  }

  /**
   * PullRequest findFirst
   */
  export type PullRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter, which PullRequest to fetch.
     */
    where?: PullRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PullRequests to fetch.
     */
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PullRequests.
     */
    cursor?: PullRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PullRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PullRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PullRequests.
     */
    distinct?: PullRequestScalarFieldEnum | PullRequestScalarFieldEnum[]
  }

  /**
   * PullRequest findFirstOrThrow
   */
  export type PullRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter, which PullRequest to fetch.
     */
    where?: PullRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PullRequests to fetch.
     */
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PullRequests.
     */
    cursor?: PullRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PullRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PullRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PullRequests.
     */
    distinct?: PullRequestScalarFieldEnum | PullRequestScalarFieldEnum[]
  }

  /**
   * PullRequest findMany
   */
  export type PullRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter, which PullRequests to fetch.
     */
    where?: PullRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PullRequests to fetch.
     */
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PullRequests.
     */
    cursor?: PullRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PullRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PullRequests.
     */
    skip?: number
    distinct?: PullRequestScalarFieldEnum | PullRequestScalarFieldEnum[]
  }

  /**
   * PullRequest create
   */
  export type PullRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a PullRequest.
     */
    data: XOR<PullRequestCreateInput, PullRequestUncheckedCreateInput>
  }

  /**
   * PullRequest createMany
   */
  export type PullRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PullRequests.
     */
    data: PullRequestCreateManyInput | PullRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PullRequest createManyAndReturn
   */
  export type PullRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PullRequests.
     */
    data: PullRequestCreateManyInput | PullRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PullRequest update
   */
  export type PullRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a PullRequest.
     */
    data: XOR<PullRequestUpdateInput, PullRequestUncheckedUpdateInput>
    /**
     * Choose, which PullRequest to update.
     */
    where: PullRequestWhereUniqueInput
  }

  /**
   * PullRequest updateMany
   */
  export type PullRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PullRequests.
     */
    data: XOR<PullRequestUpdateManyMutationInput, PullRequestUncheckedUpdateManyInput>
    /**
     * Filter which PullRequests to update
     */
    where?: PullRequestWhereInput
  }

  /**
   * PullRequest upsert
   */
  export type PullRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the PullRequest to update in case it exists.
     */
    where: PullRequestWhereUniqueInput
    /**
     * In case the PullRequest found by the `where` argument doesn't exist, create a new PullRequest with this data.
     */
    create: XOR<PullRequestCreateInput, PullRequestUncheckedCreateInput>
    /**
     * In case the PullRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PullRequestUpdateInput, PullRequestUncheckedUpdateInput>
  }

  /**
   * PullRequest delete
   */
  export type PullRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter which PullRequest to delete.
     */
    where: PullRequestWhereUniqueInput
  }

  /**
   * PullRequest deleteMany
   */
  export type PullRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PullRequests to delete
     */
    where?: PullRequestWhereInput
  }

  /**
   * PullRequest.reviewJobs
   */
  export type PullRequest$reviewJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    where?: ReviewJobWhereInput
    orderBy?: ReviewJobOrderByWithRelationInput | ReviewJobOrderByWithRelationInput[]
    cursor?: ReviewJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewJobScalarFieldEnum | ReviewJobScalarFieldEnum[]
  }

  /**
   * PullRequest without action
   */
  export type PullRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
  }


  /**
   * Model WebhookDelivery
   */

  export type AggregateWebhookDelivery = {
    _count: WebhookDeliveryCountAggregateOutputType | null
    _min: WebhookDeliveryMinAggregateOutputType | null
    _max: WebhookDeliveryMaxAggregateOutputType | null
  }

  export type WebhookDeliveryMinAggregateOutputType = {
    id: string | null
    githubDeliveryId: string | null
    eventType: string | null
    repositoryId: string | null
    receivedAt: Date | null
    processingStatus: string | null
  }

  export type WebhookDeliveryMaxAggregateOutputType = {
    id: string | null
    githubDeliveryId: string | null
    eventType: string | null
    repositoryId: string | null
    receivedAt: Date | null
    processingStatus: string | null
  }

  export type WebhookDeliveryCountAggregateOutputType = {
    id: number
    githubDeliveryId: number
    eventType: number
    repositoryId: number
    receivedAt: number
    processingStatus: number
    _all: number
  }


  export type WebhookDeliveryMinAggregateInputType = {
    id?: true
    githubDeliveryId?: true
    eventType?: true
    repositoryId?: true
    receivedAt?: true
    processingStatus?: true
  }

  export type WebhookDeliveryMaxAggregateInputType = {
    id?: true
    githubDeliveryId?: true
    eventType?: true
    repositoryId?: true
    receivedAt?: true
    processingStatus?: true
  }

  export type WebhookDeliveryCountAggregateInputType = {
    id?: true
    githubDeliveryId?: true
    eventType?: true
    repositoryId?: true
    receivedAt?: true
    processingStatus?: true
    _all?: true
  }

  export type WebhookDeliveryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebhookDelivery to aggregate.
     */
    where?: WebhookDeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookDeliveries to fetch.
     */
    orderBy?: WebhookDeliveryOrderByWithRelationInput | WebhookDeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WebhookDeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookDeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookDeliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WebhookDeliveries
    **/
    _count?: true | WebhookDeliveryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WebhookDeliveryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WebhookDeliveryMaxAggregateInputType
  }

  export type GetWebhookDeliveryAggregateType<T extends WebhookDeliveryAggregateArgs> = {
        [P in keyof T & keyof AggregateWebhookDelivery]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWebhookDelivery[P]>
      : GetScalarType<T[P], AggregateWebhookDelivery[P]>
  }




  export type WebhookDeliveryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebhookDeliveryWhereInput
    orderBy?: WebhookDeliveryOrderByWithAggregationInput | WebhookDeliveryOrderByWithAggregationInput[]
    by: WebhookDeliveryScalarFieldEnum[] | WebhookDeliveryScalarFieldEnum
    having?: WebhookDeliveryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WebhookDeliveryCountAggregateInputType | true
    _min?: WebhookDeliveryMinAggregateInputType
    _max?: WebhookDeliveryMaxAggregateInputType
  }

  export type WebhookDeliveryGroupByOutputType = {
    id: string
    githubDeliveryId: string
    eventType: string
    repositoryId: string | null
    receivedAt: Date
    processingStatus: string
    _count: WebhookDeliveryCountAggregateOutputType | null
    _min: WebhookDeliveryMinAggregateOutputType | null
    _max: WebhookDeliveryMaxAggregateOutputType | null
  }

  type GetWebhookDeliveryGroupByPayload<T extends WebhookDeliveryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WebhookDeliveryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WebhookDeliveryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WebhookDeliveryGroupByOutputType[P]>
            : GetScalarType<T[P], WebhookDeliveryGroupByOutputType[P]>
        }
      >
    >


  export type WebhookDeliverySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    githubDeliveryId?: boolean
    eventType?: boolean
    repositoryId?: boolean
    receivedAt?: boolean
    processingStatus?: boolean
  }, ExtArgs["result"]["webhookDelivery"]>

  export type WebhookDeliverySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    githubDeliveryId?: boolean
    eventType?: boolean
    repositoryId?: boolean
    receivedAt?: boolean
    processingStatus?: boolean
  }, ExtArgs["result"]["webhookDelivery"]>

  export type WebhookDeliverySelectScalar = {
    id?: boolean
    githubDeliveryId?: boolean
    eventType?: boolean
    repositoryId?: boolean
    receivedAt?: boolean
    processingStatus?: boolean
  }


  export type $WebhookDeliveryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WebhookDelivery"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      githubDeliveryId: string
      eventType: string
      repositoryId: string | null
      receivedAt: Date
      processingStatus: string
    }, ExtArgs["result"]["webhookDelivery"]>
    composites: {}
  }

  type WebhookDeliveryGetPayload<S extends boolean | null | undefined | WebhookDeliveryDefaultArgs> = $Result.GetResult<Prisma.$WebhookDeliveryPayload, S>

  type WebhookDeliveryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WebhookDeliveryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WebhookDeliveryCountAggregateInputType | true
    }

  export interface WebhookDeliveryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WebhookDelivery'], meta: { name: 'WebhookDelivery' } }
    /**
     * Find zero or one WebhookDelivery that matches the filter.
     * @param {WebhookDeliveryFindUniqueArgs} args - Arguments to find a WebhookDelivery
     * @example
     * // Get one WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WebhookDeliveryFindUniqueArgs>(args: SelectSubset<T, WebhookDeliveryFindUniqueArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WebhookDelivery that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WebhookDeliveryFindUniqueOrThrowArgs} args - Arguments to find a WebhookDelivery
     * @example
     * // Get one WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WebhookDeliveryFindUniqueOrThrowArgs>(args: SelectSubset<T, WebhookDeliveryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WebhookDelivery that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryFindFirstArgs} args - Arguments to find a WebhookDelivery
     * @example
     * // Get one WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WebhookDeliveryFindFirstArgs>(args?: SelectSubset<T, WebhookDeliveryFindFirstArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WebhookDelivery that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryFindFirstOrThrowArgs} args - Arguments to find a WebhookDelivery
     * @example
     * // Get one WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WebhookDeliveryFindFirstOrThrowArgs>(args?: SelectSubset<T, WebhookDeliveryFindFirstOrThrowArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WebhookDeliveries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WebhookDeliveries
     * const webhookDeliveries = await prisma.webhookDelivery.findMany()
     * 
     * // Get first 10 WebhookDeliveries
     * const webhookDeliveries = await prisma.webhookDelivery.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const webhookDeliveryWithIdOnly = await prisma.webhookDelivery.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WebhookDeliveryFindManyArgs>(args?: SelectSubset<T, WebhookDeliveryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WebhookDelivery.
     * @param {WebhookDeliveryCreateArgs} args - Arguments to create a WebhookDelivery.
     * @example
     * // Create one WebhookDelivery
     * const WebhookDelivery = await prisma.webhookDelivery.create({
     *   data: {
     *     // ... data to create a WebhookDelivery
     *   }
     * })
     * 
     */
    create<T extends WebhookDeliveryCreateArgs>(args: SelectSubset<T, WebhookDeliveryCreateArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WebhookDeliveries.
     * @param {WebhookDeliveryCreateManyArgs} args - Arguments to create many WebhookDeliveries.
     * @example
     * // Create many WebhookDeliveries
     * const webhookDelivery = await prisma.webhookDelivery.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WebhookDeliveryCreateManyArgs>(args?: SelectSubset<T, WebhookDeliveryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WebhookDeliveries and returns the data saved in the database.
     * @param {WebhookDeliveryCreateManyAndReturnArgs} args - Arguments to create many WebhookDeliveries.
     * @example
     * // Create many WebhookDeliveries
     * const webhookDelivery = await prisma.webhookDelivery.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WebhookDeliveries and only return the `id`
     * const webhookDeliveryWithIdOnly = await prisma.webhookDelivery.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WebhookDeliveryCreateManyAndReturnArgs>(args?: SelectSubset<T, WebhookDeliveryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WebhookDelivery.
     * @param {WebhookDeliveryDeleteArgs} args - Arguments to delete one WebhookDelivery.
     * @example
     * // Delete one WebhookDelivery
     * const WebhookDelivery = await prisma.webhookDelivery.delete({
     *   where: {
     *     // ... filter to delete one WebhookDelivery
     *   }
     * })
     * 
     */
    delete<T extends WebhookDeliveryDeleteArgs>(args: SelectSubset<T, WebhookDeliveryDeleteArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WebhookDelivery.
     * @param {WebhookDeliveryUpdateArgs} args - Arguments to update one WebhookDelivery.
     * @example
     * // Update one WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WebhookDeliveryUpdateArgs>(args: SelectSubset<T, WebhookDeliveryUpdateArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WebhookDeliveries.
     * @param {WebhookDeliveryDeleteManyArgs} args - Arguments to filter WebhookDeliveries to delete.
     * @example
     * // Delete a few WebhookDeliveries
     * const { count } = await prisma.webhookDelivery.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WebhookDeliveryDeleteManyArgs>(args?: SelectSubset<T, WebhookDeliveryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebhookDeliveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WebhookDeliveries
     * const webhookDelivery = await prisma.webhookDelivery.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WebhookDeliveryUpdateManyArgs>(args: SelectSubset<T, WebhookDeliveryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WebhookDelivery.
     * @param {WebhookDeliveryUpsertArgs} args - Arguments to update or create a WebhookDelivery.
     * @example
     * // Update or create a WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.upsert({
     *   create: {
     *     // ... data to create a WebhookDelivery
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WebhookDelivery we want to update
     *   }
     * })
     */
    upsert<T extends WebhookDeliveryUpsertArgs>(args: SelectSubset<T, WebhookDeliveryUpsertArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WebhookDeliveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryCountArgs} args - Arguments to filter WebhookDeliveries to count.
     * @example
     * // Count the number of WebhookDeliveries
     * const count = await prisma.webhookDelivery.count({
     *   where: {
     *     // ... the filter for the WebhookDeliveries we want to count
     *   }
     * })
    **/
    count<T extends WebhookDeliveryCountArgs>(
      args?: Subset<T, WebhookDeliveryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WebhookDeliveryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WebhookDelivery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WebhookDeliveryAggregateArgs>(args: Subset<T, WebhookDeliveryAggregateArgs>): Prisma.PrismaPromise<GetWebhookDeliveryAggregateType<T>>

    /**
     * Group by WebhookDelivery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WebhookDeliveryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WebhookDeliveryGroupByArgs['orderBy'] }
        : { orderBy?: WebhookDeliveryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WebhookDeliveryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWebhookDeliveryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WebhookDelivery model
   */
  readonly fields: WebhookDeliveryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WebhookDelivery.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WebhookDeliveryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WebhookDelivery model
   */ 
  interface WebhookDeliveryFieldRefs {
    readonly id: FieldRef<"WebhookDelivery", 'String'>
    readonly githubDeliveryId: FieldRef<"WebhookDelivery", 'String'>
    readonly eventType: FieldRef<"WebhookDelivery", 'String'>
    readonly repositoryId: FieldRef<"WebhookDelivery", 'String'>
    readonly receivedAt: FieldRef<"WebhookDelivery", 'DateTime'>
    readonly processingStatus: FieldRef<"WebhookDelivery", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WebhookDelivery findUnique
   */
  export type WebhookDeliveryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Filter, which WebhookDelivery to fetch.
     */
    where: WebhookDeliveryWhereUniqueInput
  }

  /**
   * WebhookDelivery findUniqueOrThrow
   */
  export type WebhookDeliveryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Filter, which WebhookDelivery to fetch.
     */
    where: WebhookDeliveryWhereUniqueInput
  }

  /**
   * WebhookDelivery findFirst
   */
  export type WebhookDeliveryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Filter, which WebhookDelivery to fetch.
     */
    where?: WebhookDeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookDeliveries to fetch.
     */
    orderBy?: WebhookDeliveryOrderByWithRelationInput | WebhookDeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebhookDeliveries.
     */
    cursor?: WebhookDeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookDeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookDeliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookDeliveries.
     */
    distinct?: WebhookDeliveryScalarFieldEnum | WebhookDeliveryScalarFieldEnum[]
  }

  /**
   * WebhookDelivery findFirstOrThrow
   */
  export type WebhookDeliveryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Filter, which WebhookDelivery to fetch.
     */
    where?: WebhookDeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookDeliveries to fetch.
     */
    orderBy?: WebhookDeliveryOrderByWithRelationInput | WebhookDeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebhookDeliveries.
     */
    cursor?: WebhookDeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookDeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookDeliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookDeliveries.
     */
    distinct?: WebhookDeliveryScalarFieldEnum | WebhookDeliveryScalarFieldEnum[]
  }

  /**
   * WebhookDelivery findMany
   */
  export type WebhookDeliveryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Filter, which WebhookDeliveries to fetch.
     */
    where?: WebhookDeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookDeliveries to fetch.
     */
    orderBy?: WebhookDeliveryOrderByWithRelationInput | WebhookDeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WebhookDeliveries.
     */
    cursor?: WebhookDeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookDeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookDeliveries.
     */
    skip?: number
    distinct?: WebhookDeliveryScalarFieldEnum | WebhookDeliveryScalarFieldEnum[]
  }

  /**
   * WebhookDelivery create
   */
  export type WebhookDeliveryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * The data needed to create a WebhookDelivery.
     */
    data: XOR<WebhookDeliveryCreateInput, WebhookDeliveryUncheckedCreateInput>
  }

  /**
   * WebhookDelivery createMany
   */
  export type WebhookDeliveryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WebhookDeliveries.
     */
    data: WebhookDeliveryCreateManyInput | WebhookDeliveryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WebhookDelivery createManyAndReturn
   */
  export type WebhookDeliveryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WebhookDeliveries.
     */
    data: WebhookDeliveryCreateManyInput | WebhookDeliveryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WebhookDelivery update
   */
  export type WebhookDeliveryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * The data needed to update a WebhookDelivery.
     */
    data: XOR<WebhookDeliveryUpdateInput, WebhookDeliveryUncheckedUpdateInput>
    /**
     * Choose, which WebhookDelivery to update.
     */
    where: WebhookDeliveryWhereUniqueInput
  }

  /**
   * WebhookDelivery updateMany
   */
  export type WebhookDeliveryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WebhookDeliveries.
     */
    data: XOR<WebhookDeliveryUpdateManyMutationInput, WebhookDeliveryUncheckedUpdateManyInput>
    /**
     * Filter which WebhookDeliveries to update
     */
    where?: WebhookDeliveryWhereInput
  }

  /**
   * WebhookDelivery upsert
   */
  export type WebhookDeliveryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * The filter to search for the WebhookDelivery to update in case it exists.
     */
    where: WebhookDeliveryWhereUniqueInput
    /**
     * In case the WebhookDelivery found by the `where` argument doesn't exist, create a new WebhookDelivery with this data.
     */
    create: XOR<WebhookDeliveryCreateInput, WebhookDeliveryUncheckedCreateInput>
    /**
     * In case the WebhookDelivery was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WebhookDeliveryUpdateInput, WebhookDeliveryUncheckedUpdateInput>
  }

  /**
   * WebhookDelivery delete
   */
  export type WebhookDeliveryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Filter which WebhookDelivery to delete.
     */
    where: WebhookDeliveryWhereUniqueInput
  }

  /**
   * WebhookDelivery deleteMany
   */
  export type WebhookDeliveryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebhookDeliveries to delete
     */
    where?: WebhookDeliveryWhereInput
  }

  /**
   * WebhookDelivery without action
   */
  export type WebhookDeliveryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
  }


  /**
   * Model ReviewJob
   */

  export type AggregateReviewJob = {
    _count: ReviewJobCountAggregateOutputType | null
    _avg: ReviewJobAvgAggregateOutputType | null
    _sum: ReviewJobSumAggregateOutputType | null
    _min: ReviewJobMinAggregateOutputType | null
    _max: ReviewJobMaxAggregateOutputType | null
  }

  export type ReviewJobAvgAggregateOutputType = {
    configVersion: number | null
  }

  export type ReviewJobSumAggregateOutputType = {
    configVersion: number | null
  }

  export type ReviewJobMinAggregateOutputType = {
    id: string | null
    repositoryId: string | null
    pullRequestId: string | null
    headSha: string | null
    idempotencyKey: string | null
    status: string | null
    configVersion: number | null
    startedAt: Date | null
    completedAt: Date | null
    errorCode: string | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type ReviewJobMaxAggregateOutputType = {
    id: string | null
    repositoryId: string | null
    pullRequestId: string | null
    headSha: string | null
    idempotencyKey: string | null
    status: string | null
    configVersion: number | null
    startedAt: Date | null
    completedAt: Date | null
    errorCode: string | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type ReviewJobCountAggregateOutputType = {
    id: number
    repositoryId: number
    pullRequestId: number
    headSha: number
    idempotencyKey: number
    status: number
    configVersion: number
    startedAt: number
    completedAt: number
    errorCode: number
    errorMessage: number
    createdAt: number
    _all: number
  }


  export type ReviewJobAvgAggregateInputType = {
    configVersion?: true
  }

  export type ReviewJobSumAggregateInputType = {
    configVersion?: true
  }

  export type ReviewJobMinAggregateInputType = {
    id?: true
    repositoryId?: true
    pullRequestId?: true
    headSha?: true
    idempotencyKey?: true
    status?: true
    configVersion?: true
    startedAt?: true
    completedAt?: true
    errorCode?: true
    errorMessage?: true
    createdAt?: true
  }

  export type ReviewJobMaxAggregateInputType = {
    id?: true
    repositoryId?: true
    pullRequestId?: true
    headSha?: true
    idempotencyKey?: true
    status?: true
    configVersion?: true
    startedAt?: true
    completedAt?: true
    errorCode?: true
    errorMessage?: true
    createdAt?: true
  }

  export type ReviewJobCountAggregateInputType = {
    id?: true
    repositoryId?: true
    pullRequestId?: true
    headSha?: true
    idempotencyKey?: true
    status?: true
    configVersion?: true
    startedAt?: true
    completedAt?: true
    errorCode?: true
    errorMessage?: true
    createdAt?: true
    _all?: true
  }

  export type ReviewJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReviewJob to aggregate.
     */
    where?: ReviewJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReviewJobs to fetch.
     */
    orderBy?: ReviewJobOrderByWithRelationInput | ReviewJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReviewJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReviewJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReviewJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReviewJobs
    **/
    _count?: true | ReviewJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReviewJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReviewJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewJobMaxAggregateInputType
  }

  export type GetReviewJobAggregateType<T extends ReviewJobAggregateArgs> = {
        [P in keyof T & keyof AggregateReviewJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReviewJob[P]>
      : GetScalarType<T[P], AggregateReviewJob[P]>
  }




  export type ReviewJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewJobWhereInput
    orderBy?: ReviewJobOrderByWithAggregationInput | ReviewJobOrderByWithAggregationInput[]
    by: ReviewJobScalarFieldEnum[] | ReviewJobScalarFieldEnum
    having?: ReviewJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewJobCountAggregateInputType | true
    _avg?: ReviewJobAvgAggregateInputType
    _sum?: ReviewJobSumAggregateInputType
    _min?: ReviewJobMinAggregateInputType
    _max?: ReviewJobMaxAggregateInputType
  }

  export type ReviewJobGroupByOutputType = {
    id: string
    repositoryId: string
    pullRequestId: string
    headSha: string
    idempotencyKey: string
    status: string
    configVersion: number
    startedAt: Date | null
    completedAt: Date | null
    errorCode: string | null
    errorMessage: string | null
    createdAt: Date
    _count: ReviewJobCountAggregateOutputType | null
    _avg: ReviewJobAvgAggregateOutputType | null
    _sum: ReviewJobSumAggregateOutputType | null
    _min: ReviewJobMinAggregateOutputType | null
    _max: ReviewJobMaxAggregateOutputType | null
  }

  type GetReviewJobGroupByPayload<T extends ReviewJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewJobGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewJobGroupByOutputType[P]>
        }
      >
    >


  export type ReviewJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repositoryId?: boolean
    pullRequestId?: boolean
    headSha?: boolean
    idempotencyKey?: boolean
    status?: boolean
    configVersion?: boolean
    startedAt?: boolean
    completedAt?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    repository?: boolean | RepositoryDefaultArgs<ExtArgs>
    pullRequest?: boolean | PullRequestDefaultArgs<ExtArgs>
    agentRuns?: boolean | ReviewJob$agentRunsArgs<ExtArgs>
    findings?: boolean | ReviewJob$findingsArgs<ExtArgs>
    _count?: boolean | ReviewJobCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reviewJob"]>

  export type ReviewJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repositoryId?: boolean
    pullRequestId?: boolean
    headSha?: boolean
    idempotencyKey?: boolean
    status?: boolean
    configVersion?: boolean
    startedAt?: boolean
    completedAt?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    repository?: boolean | RepositoryDefaultArgs<ExtArgs>
    pullRequest?: boolean | PullRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reviewJob"]>

  export type ReviewJobSelectScalar = {
    id?: boolean
    repositoryId?: boolean
    pullRequestId?: boolean
    headSha?: boolean
    idempotencyKey?: boolean
    status?: boolean
    configVersion?: boolean
    startedAt?: boolean
    completedAt?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }

  export type ReviewJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repository?: boolean | RepositoryDefaultArgs<ExtArgs>
    pullRequest?: boolean | PullRequestDefaultArgs<ExtArgs>
    agentRuns?: boolean | ReviewJob$agentRunsArgs<ExtArgs>
    findings?: boolean | ReviewJob$findingsArgs<ExtArgs>
    _count?: boolean | ReviewJobCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ReviewJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repository?: boolean | RepositoryDefaultArgs<ExtArgs>
    pullRequest?: boolean | PullRequestDefaultArgs<ExtArgs>
  }

  export type $ReviewJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReviewJob"
    objects: {
      repository: Prisma.$RepositoryPayload<ExtArgs>
      pullRequest: Prisma.$PullRequestPayload<ExtArgs>
      agentRuns: Prisma.$AgentRunPayload<ExtArgs>[]
      findings: Prisma.$FindingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      repositoryId: string
      pullRequestId: string
      headSha: string
      idempotencyKey: string
      status: string
      configVersion: number
      startedAt: Date | null
      completedAt: Date | null
      errorCode: string | null
      errorMessage: string | null
      createdAt: Date
    }, ExtArgs["result"]["reviewJob"]>
    composites: {}
  }

  type ReviewJobGetPayload<S extends boolean | null | undefined | ReviewJobDefaultArgs> = $Result.GetResult<Prisma.$ReviewJobPayload, S>

  type ReviewJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReviewJobFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReviewJobCountAggregateInputType | true
    }

  export interface ReviewJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReviewJob'], meta: { name: 'ReviewJob' } }
    /**
     * Find zero or one ReviewJob that matches the filter.
     * @param {ReviewJobFindUniqueArgs} args - Arguments to find a ReviewJob
     * @example
     * // Get one ReviewJob
     * const reviewJob = await prisma.reviewJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReviewJobFindUniqueArgs>(args: SelectSubset<T, ReviewJobFindUniqueArgs<ExtArgs>>): Prisma__ReviewJobClient<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReviewJob that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReviewJobFindUniqueOrThrowArgs} args - Arguments to find a ReviewJob
     * @example
     * // Get one ReviewJob
     * const reviewJob = await prisma.reviewJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReviewJobFindUniqueOrThrowArgs>(args: SelectSubset<T, ReviewJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReviewJobClient<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReviewJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewJobFindFirstArgs} args - Arguments to find a ReviewJob
     * @example
     * // Get one ReviewJob
     * const reviewJob = await prisma.reviewJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReviewJobFindFirstArgs>(args?: SelectSubset<T, ReviewJobFindFirstArgs<ExtArgs>>): Prisma__ReviewJobClient<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReviewJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewJobFindFirstOrThrowArgs} args - Arguments to find a ReviewJob
     * @example
     * // Get one ReviewJob
     * const reviewJob = await prisma.reviewJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReviewJobFindFirstOrThrowArgs>(args?: SelectSubset<T, ReviewJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReviewJobClient<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReviewJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReviewJobs
     * const reviewJobs = await prisma.reviewJob.findMany()
     * 
     * // Get first 10 ReviewJobs
     * const reviewJobs = await prisma.reviewJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewJobWithIdOnly = await prisma.reviewJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReviewJobFindManyArgs>(args?: SelectSubset<T, ReviewJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReviewJob.
     * @param {ReviewJobCreateArgs} args - Arguments to create a ReviewJob.
     * @example
     * // Create one ReviewJob
     * const ReviewJob = await prisma.reviewJob.create({
     *   data: {
     *     // ... data to create a ReviewJob
     *   }
     * })
     * 
     */
    create<T extends ReviewJobCreateArgs>(args: SelectSubset<T, ReviewJobCreateArgs<ExtArgs>>): Prisma__ReviewJobClient<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReviewJobs.
     * @param {ReviewJobCreateManyArgs} args - Arguments to create many ReviewJobs.
     * @example
     * // Create many ReviewJobs
     * const reviewJob = await prisma.reviewJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReviewJobCreateManyArgs>(args?: SelectSubset<T, ReviewJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReviewJobs and returns the data saved in the database.
     * @param {ReviewJobCreateManyAndReturnArgs} args - Arguments to create many ReviewJobs.
     * @example
     * // Create many ReviewJobs
     * const reviewJob = await prisma.reviewJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReviewJobs and only return the `id`
     * const reviewJobWithIdOnly = await prisma.reviewJob.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReviewJobCreateManyAndReturnArgs>(args?: SelectSubset<T, ReviewJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReviewJob.
     * @param {ReviewJobDeleteArgs} args - Arguments to delete one ReviewJob.
     * @example
     * // Delete one ReviewJob
     * const ReviewJob = await prisma.reviewJob.delete({
     *   where: {
     *     // ... filter to delete one ReviewJob
     *   }
     * })
     * 
     */
    delete<T extends ReviewJobDeleteArgs>(args: SelectSubset<T, ReviewJobDeleteArgs<ExtArgs>>): Prisma__ReviewJobClient<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReviewJob.
     * @param {ReviewJobUpdateArgs} args - Arguments to update one ReviewJob.
     * @example
     * // Update one ReviewJob
     * const reviewJob = await prisma.reviewJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReviewJobUpdateArgs>(args: SelectSubset<T, ReviewJobUpdateArgs<ExtArgs>>): Prisma__ReviewJobClient<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReviewJobs.
     * @param {ReviewJobDeleteManyArgs} args - Arguments to filter ReviewJobs to delete.
     * @example
     * // Delete a few ReviewJobs
     * const { count } = await prisma.reviewJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReviewJobDeleteManyArgs>(args?: SelectSubset<T, ReviewJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReviewJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReviewJobs
     * const reviewJob = await prisma.reviewJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReviewJobUpdateManyArgs>(args: SelectSubset<T, ReviewJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReviewJob.
     * @param {ReviewJobUpsertArgs} args - Arguments to update or create a ReviewJob.
     * @example
     * // Update or create a ReviewJob
     * const reviewJob = await prisma.reviewJob.upsert({
     *   create: {
     *     // ... data to create a ReviewJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReviewJob we want to update
     *   }
     * })
     */
    upsert<T extends ReviewJobUpsertArgs>(args: SelectSubset<T, ReviewJobUpsertArgs<ExtArgs>>): Prisma__ReviewJobClient<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReviewJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewJobCountArgs} args - Arguments to filter ReviewJobs to count.
     * @example
     * // Count the number of ReviewJobs
     * const count = await prisma.reviewJob.count({
     *   where: {
     *     // ... the filter for the ReviewJobs we want to count
     *   }
     * })
    **/
    count<T extends ReviewJobCountArgs>(
      args?: Subset<T, ReviewJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReviewJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReviewJobAggregateArgs>(args: Subset<T, ReviewJobAggregateArgs>): Prisma.PrismaPromise<GetReviewJobAggregateType<T>>

    /**
     * Group by ReviewJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReviewJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReviewJobGroupByArgs['orderBy'] }
        : { orderBy?: ReviewJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReviewJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReviewJob model
   */
  readonly fields: ReviewJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReviewJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReviewJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    repository<T extends RepositoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RepositoryDefaultArgs<ExtArgs>>): Prisma__RepositoryClient<$Result.GetResult<Prisma.$RepositoryPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    pullRequest<T extends PullRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PullRequestDefaultArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    agentRuns<T extends ReviewJob$agentRunsArgs<ExtArgs> = {}>(args?: Subset<T, ReviewJob$agentRunsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findMany"> | Null>
    findings<T extends ReviewJob$findingsArgs<ExtArgs> = {}>(args?: Subset<T, ReviewJob$findingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReviewJob model
   */ 
  interface ReviewJobFieldRefs {
    readonly id: FieldRef<"ReviewJob", 'String'>
    readonly repositoryId: FieldRef<"ReviewJob", 'String'>
    readonly pullRequestId: FieldRef<"ReviewJob", 'String'>
    readonly headSha: FieldRef<"ReviewJob", 'String'>
    readonly idempotencyKey: FieldRef<"ReviewJob", 'String'>
    readonly status: FieldRef<"ReviewJob", 'String'>
    readonly configVersion: FieldRef<"ReviewJob", 'Int'>
    readonly startedAt: FieldRef<"ReviewJob", 'DateTime'>
    readonly completedAt: FieldRef<"ReviewJob", 'DateTime'>
    readonly errorCode: FieldRef<"ReviewJob", 'String'>
    readonly errorMessage: FieldRef<"ReviewJob", 'String'>
    readonly createdAt: FieldRef<"ReviewJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReviewJob findUnique
   */
  export type ReviewJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    /**
     * Filter, which ReviewJob to fetch.
     */
    where: ReviewJobWhereUniqueInput
  }

  /**
   * ReviewJob findUniqueOrThrow
   */
  export type ReviewJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    /**
     * Filter, which ReviewJob to fetch.
     */
    where: ReviewJobWhereUniqueInput
  }

  /**
   * ReviewJob findFirst
   */
  export type ReviewJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    /**
     * Filter, which ReviewJob to fetch.
     */
    where?: ReviewJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReviewJobs to fetch.
     */
    orderBy?: ReviewJobOrderByWithRelationInput | ReviewJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReviewJobs.
     */
    cursor?: ReviewJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReviewJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReviewJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReviewJobs.
     */
    distinct?: ReviewJobScalarFieldEnum | ReviewJobScalarFieldEnum[]
  }

  /**
   * ReviewJob findFirstOrThrow
   */
  export type ReviewJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    /**
     * Filter, which ReviewJob to fetch.
     */
    where?: ReviewJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReviewJobs to fetch.
     */
    orderBy?: ReviewJobOrderByWithRelationInput | ReviewJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReviewJobs.
     */
    cursor?: ReviewJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReviewJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReviewJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReviewJobs.
     */
    distinct?: ReviewJobScalarFieldEnum | ReviewJobScalarFieldEnum[]
  }

  /**
   * ReviewJob findMany
   */
  export type ReviewJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    /**
     * Filter, which ReviewJobs to fetch.
     */
    where?: ReviewJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReviewJobs to fetch.
     */
    orderBy?: ReviewJobOrderByWithRelationInput | ReviewJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReviewJobs.
     */
    cursor?: ReviewJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReviewJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReviewJobs.
     */
    skip?: number
    distinct?: ReviewJobScalarFieldEnum | ReviewJobScalarFieldEnum[]
  }

  /**
   * ReviewJob create
   */
  export type ReviewJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    /**
     * The data needed to create a ReviewJob.
     */
    data: XOR<ReviewJobCreateInput, ReviewJobUncheckedCreateInput>
  }

  /**
   * ReviewJob createMany
   */
  export type ReviewJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReviewJobs.
     */
    data: ReviewJobCreateManyInput | ReviewJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReviewJob createManyAndReturn
   */
  export type ReviewJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReviewJobs.
     */
    data: ReviewJobCreateManyInput | ReviewJobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReviewJob update
   */
  export type ReviewJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    /**
     * The data needed to update a ReviewJob.
     */
    data: XOR<ReviewJobUpdateInput, ReviewJobUncheckedUpdateInput>
    /**
     * Choose, which ReviewJob to update.
     */
    where: ReviewJobWhereUniqueInput
  }

  /**
   * ReviewJob updateMany
   */
  export type ReviewJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReviewJobs.
     */
    data: XOR<ReviewJobUpdateManyMutationInput, ReviewJobUncheckedUpdateManyInput>
    /**
     * Filter which ReviewJobs to update
     */
    where?: ReviewJobWhereInput
  }

  /**
   * ReviewJob upsert
   */
  export type ReviewJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    /**
     * The filter to search for the ReviewJob to update in case it exists.
     */
    where: ReviewJobWhereUniqueInput
    /**
     * In case the ReviewJob found by the `where` argument doesn't exist, create a new ReviewJob with this data.
     */
    create: XOR<ReviewJobCreateInput, ReviewJobUncheckedCreateInput>
    /**
     * In case the ReviewJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReviewJobUpdateInput, ReviewJobUncheckedUpdateInput>
  }

  /**
   * ReviewJob delete
   */
  export type ReviewJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
    /**
     * Filter which ReviewJob to delete.
     */
    where: ReviewJobWhereUniqueInput
  }

  /**
   * ReviewJob deleteMany
   */
  export type ReviewJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReviewJobs to delete
     */
    where?: ReviewJobWhereInput
  }

  /**
   * ReviewJob.agentRuns
   */
  export type ReviewJob$agentRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    where?: AgentRunWhereInput
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    cursor?: AgentRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * ReviewJob.findings
   */
  export type ReviewJob$findingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    where?: FindingWhereInput
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    cursor?: FindingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * ReviewJob without action
   */
  export type ReviewJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewJob
     */
    select?: ReviewJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewJobInclude<ExtArgs> | null
  }


  /**
   * Model AgentRun
   */

  export type AggregateAgentRun = {
    _count: AgentRunCountAggregateOutputType | null
    _avg: AgentRunAvgAggregateOutputType | null
    _sum: AgentRunSumAggregateOutputType | null
    _min: AgentRunMinAggregateOutputType | null
    _max: AgentRunMaxAggregateOutputType | null
  }

  export type AgentRunAvgAggregateOutputType = {
    inputTokens: number | null
    outputTokens: number | null
    durationMs: number | null
  }

  export type AgentRunSumAggregateOutputType = {
    inputTokens: number | null
    outputTokens: number | null
    durationMs: number | null
  }

  export type AgentRunMinAggregateOutputType = {
    id: string | null
    reviewJobId: string | null
    agentType: string | null
    status: string | null
    modelProvider: string | null
    modelName: string | null
    inputTokens: number | null
    outputTokens: number | null
    durationMs: number | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type AgentRunMaxAggregateOutputType = {
    id: string | null
    reviewJobId: string | null
    agentType: string | null
    status: string | null
    modelProvider: string | null
    modelName: string | null
    inputTokens: number | null
    outputTokens: number | null
    durationMs: number | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type AgentRunCountAggregateOutputType = {
    id: number
    reviewJobId: number
    agentType: number
    status: number
    modelProvider: number
    modelName: number
    inputTokens: number
    outputTokens: number
    durationMs: number
    outputJson: number
    errorMessage: number
    createdAt: number
    _all: number
  }


  export type AgentRunAvgAggregateInputType = {
    inputTokens?: true
    outputTokens?: true
    durationMs?: true
  }

  export type AgentRunSumAggregateInputType = {
    inputTokens?: true
    outputTokens?: true
    durationMs?: true
  }

  export type AgentRunMinAggregateInputType = {
    id?: true
    reviewJobId?: true
    agentType?: true
    status?: true
    modelProvider?: true
    modelName?: true
    inputTokens?: true
    outputTokens?: true
    durationMs?: true
    errorMessage?: true
    createdAt?: true
  }

  export type AgentRunMaxAggregateInputType = {
    id?: true
    reviewJobId?: true
    agentType?: true
    status?: true
    modelProvider?: true
    modelName?: true
    inputTokens?: true
    outputTokens?: true
    durationMs?: true
    errorMessage?: true
    createdAt?: true
  }

  export type AgentRunCountAggregateInputType = {
    id?: true
    reviewJobId?: true
    agentType?: true
    status?: true
    modelProvider?: true
    modelName?: true
    inputTokens?: true
    outputTokens?: true
    durationMs?: true
    outputJson?: true
    errorMessage?: true
    createdAt?: true
    _all?: true
  }

  export type AgentRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentRun to aggregate.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentRuns
    **/
    _count?: true | AgentRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgentRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgentRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentRunMaxAggregateInputType
  }

  export type GetAgentRunAggregateType<T extends AgentRunAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentRun[P]>
      : GetScalarType<T[P], AggregateAgentRun[P]>
  }




  export type AgentRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentRunWhereInput
    orderBy?: AgentRunOrderByWithAggregationInput | AgentRunOrderByWithAggregationInput[]
    by: AgentRunScalarFieldEnum[] | AgentRunScalarFieldEnum
    having?: AgentRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentRunCountAggregateInputType | true
    _avg?: AgentRunAvgAggregateInputType
    _sum?: AgentRunSumAggregateInputType
    _min?: AgentRunMinAggregateInputType
    _max?: AgentRunMaxAggregateInputType
  }

  export type AgentRunGroupByOutputType = {
    id: string
    reviewJobId: string
    agentType: string
    status: string
    modelProvider: string | null
    modelName: string | null
    inputTokens: number | null
    outputTokens: number | null
    durationMs: number | null
    outputJson: JsonValue | null
    errorMessage: string | null
    createdAt: Date
    _count: AgentRunCountAggregateOutputType | null
    _avg: AgentRunAvgAggregateOutputType | null
    _sum: AgentRunSumAggregateOutputType | null
    _min: AgentRunMinAggregateOutputType | null
    _max: AgentRunMaxAggregateOutputType | null
  }

  type GetAgentRunGroupByPayload<T extends AgentRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentRunGroupByOutputType[P]>
            : GetScalarType<T[P], AgentRunGroupByOutputType[P]>
        }
      >
    >


  export type AgentRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reviewJobId?: boolean
    agentType?: boolean
    status?: boolean
    modelProvider?: boolean
    modelName?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    durationMs?: boolean
    outputJson?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    reviewJob?: boolean | ReviewJobDefaultArgs<ExtArgs>
    findings?: boolean | AgentRun$findingsArgs<ExtArgs>
    _count?: boolean | AgentRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reviewJobId?: boolean
    agentType?: boolean
    status?: boolean
    modelProvider?: boolean
    modelName?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    durationMs?: boolean
    outputJson?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    reviewJob?: boolean | ReviewJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectScalar = {
    id?: boolean
    reviewJobId?: boolean
    agentType?: boolean
    status?: boolean
    modelProvider?: boolean
    modelName?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    durationMs?: boolean
    outputJson?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }

  export type AgentRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviewJob?: boolean | ReviewJobDefaultArgs<ExtArgs>
    findings?: boolean | AgentRun$findingsArgs<ExtArgs>
    _count?: boolean | AgentRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AgentRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviewJob?: boolean | ReviewJobDefaultArgs<ExtArgs>
  }

  export type $AgentRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentRun"
    objects: {
      reviewJob: Prisma.$ReviewJobPayload<ExtArgs>
      findings: Prisma.$FindingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reviewJobId: string
      agentType: string
      status: string
      modelProvider: string | null
      modelName: string | null
      inputTokens: number | null
      outputTokens: number | null
      durationMs: number | null
      outputJson: Prisma.JsonValue | null
      errorMessage: string | null
      createdAt: Date
    }, ExtArgs["result"]["agentRun"]>
    composites: {}
  }

  type AgentRunGetPayload<S extends boolean | null | undefined | AgentRunDefaultArgs> = $Result.GetResult<Prisma.$AgentRunPayload, S>

  type AgentRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AgentRunFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AgentRunCountAggregateInputType | true
    }

  export interface AgentRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentRun'], meta: { name: 'AgentRun' } }
    /**
     * Find zero or one AgentRun that matches the filter.
     * @param {AgentRunFindUniqueArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentRunFindUniqueArgs>(args: SelectSubset<T, AgentRunFindUniqueArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AgentRun that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AgentRunFindUniqueOrThrowArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentRunFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AgentRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindFirstArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentRunFindFirstArgs>(args?: SelectSubset<T, AgentRunFindFirstArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AgentRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindFirstOrThrowArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentRunFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AgentRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentRuns
     * const agentRuns = await prisma.agentRun.findMany()
     * 
     * // Get first 10 AgentRuns
     * const agentRuns = await prisma.agentRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentRunFindManyArgs>(args?: SelectSubset<T, AgentRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AgentRun.
     * @param {AgentRunCreateArgs} args - Arguments to create a AgentRun.
     * @example
     * // Create one AgentRun
     * const AgentRun = await prisma.agentRun.create({
     *   data: {
     *     // ... data to create a AgentRun
     *   }
     * })
     * 
     */
    create<T extends AgentRunCreateArgs>(args: SelectSubset<T, AgentRunCreateArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AgentRuns.
     * @param {AgentRunCreateManyArgs} args - Arguments to create many AgentRuns.
     * @example
     * // Create many AgentRuns
     * const agentRun = await prisma.agentRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentRunCreateManyArgs>(args?: SelectSubset<T, AgentRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentRuns and returns the data saved in the database.
     * @param {AgentRunCreateManyAndReturnArgs} args - Arguments to create many AgentRuns.
     * @example
     * // Create many AgentRuns
     * const agentRun = await prisma.agentRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentRuns and only return the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentRunCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AgentRun.
     * @param {AgentRunDeleteArgs} args - Arguments to delete one AgentRun.
     * @example
     * // Delete one AgentRun
     * const AgentRun = await prisma.agentRun.delete({
     *   where: {
     *     // ... filter to delete one AgentRun
     *   }
     * })
     * 
     */
    delete<T extends AgentRunDeleteArgs>(args: SelectSubset<T, AgentRunDeleteArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AgentRun.
     * @param {AgentRunUpdateArgs} args - Arguments to update one AgentRun.
     * @example
     * // Update one AgentRun
     * const agentRun = await prisma.agentRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentRunUpdateArgs>(args: SelectSubset<T, AgentRunUpdateArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AgentRuns.
     * @param {AgentRunDeleteManyArgs} args - Arguments to filter AgentRuns to delete.
     * @example
     * // Delete a few AgentRuns
     * const { count } = await prisma.agentRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentRunDeleteManyArgs>(args?: SelectSubset<T, AgentRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentRuns
     * const agentRun = await prisma.agentRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentRunUpdateManyArgs>(args: SelectSubset<T, AgentRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AgentRun.
     * @param {AgentRunUpsertArgs} args - Arguments to update or create a AgentRun.
     * @example
     * // Update or create a AgentRun
     * const agentRun = await prisma.agentRun.upsert({
     *   create: {
     *     // ... data to create a AgentRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentRun we want to update
     *   }
     * })
     */
    upsert<T extends AgentRunUpsertArgs>(args: SelectSubset<T, AgentRunUpsertArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AgentRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunCountArgs} args - Arguments to filter AgentRuns to count.
     * @example
     * // Count the number of AgentRuns
     * const count = await prisma.agentRun.count({
     *   where: {
     *     // ... the filter for the AgentRuns we want to count
     *   }
     * })
    **/
    count<T extends AgentRunCountArgs>(
      args?: Subset<T, AgentRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentRunAggregateArgs>(args: Subset<T, AgentRunAggregateArgs>): Prisma.PrismaPromise<GetAgentRunAggregateType<T>>

    /**
     * Group by AgentRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentRunGroupByArgs['orderBy'] }
        : { orderBy?: AgentRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentRun model
   */
  readonly fields: AgentRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reviewJob<T extends ReviewJobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReviewJobDefaultArgs<ExtArgs>>): Prisma__ReviewJobClient<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    findings<T extends AgentRun$findingsArgs<ExtArgs> = {}>(args?: Subset<T, AgentRun$findingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentRun model
   */ 
  interface AgentRunFieldRefs {
    readonly id: FieldRef<"AgentRun", 'String'>
    readonly reviewJobId: FieldRef<"AgentRun", 'String'>
    readonly agentType: FieldRef<"AgentRun", 'String'>
    readonly status: FieldRef<"AgentRun", 'String'>
    readonly modelProvider: FieldRef<"AgentRun", 'String'>
    readonly modelName: FieldRef<"AgentRun", 'String'>
    readonly inputTokens: FieldRef<"AgentRun", 'Int'>
    readonly outputTokens: FieldRef<"AgentRun", 'Int'>
    readonly durationMs: FieldRef<"AgentRun", 'Int'>
    readonly outputJson: FieldRef<"AgentRun", 'Json'>
    readonly errorMessage: FieldRef<"AgentRun", 'String'>
    readonly createdAt: FieldRef<"AgentRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentRun findUnique
   */
  export type AgentRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun findUniqueOrThrow
   */
  export type AgentRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun findFirst
   */
  export type AgentRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentRuns.
     */
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun findFirstOrThrow
   */
  export type AgentRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentRuns.
     */
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun findMany
   */
  export type AgentRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRuns to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun create
   */
  export type AgentRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentRun.
     */
    data: XOR<AgentRunCreateInput, AgentRunUncheckedCreateInput>
  }

  /**
   * AgentRun createMany
   */
  export type AgentRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentRuns.
     */
    data: AgentRunCreateManyInput | AgentRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentRun createManyAndReturn
   */
  export type AgentRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AgentRuns.
     */
    data: AgentRunCreateManyInput | AgentRunCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentRun update
   */
  export type AgentRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentRun.
     */
    data: XOR<AgentRunUpdateInput, AgentRunUncheckedUpdateInput>
    /**
     * Choose, which AgentRun to update.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun updateMany
   */
  export type AgentRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentRuns.
     */
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyInput>
    /**
     * Filter which AgentRuns to update
     */
    where?: AgentRunWhereInput
  }

  /**
   * AgentRun upsert
   */
  export type AgentRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentRun to update in case it exists.
     */
    where: AgentRunWhereUniqueInput
    /**
     * In case the AgentRun found by the `where` argument doesn't exist, create a new AgentRun with this data.
     */
    create: XOR<AgentRunCreateInput, AgentRunUncheckedCreateInput>
    /**
     * In case the AgentRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentRunUpdateInput, AgentRunUncheckedUpdateInput>
  }

  /**
   * AgentRun delete
   */
  export type AgentRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter which AgentRun to delete.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun deleteMany
   */
  export type AgentRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentRuns to delete
     */
    where?: AgentRunWhereInput
  }

  /**
   * AgentRun.findings
   */
  export type AgentRun$findingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    where?: FindingWhereInput
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    cursor?: FindingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * AgentRun without action
   */
  export type AgentRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
  }


  /**
   * Model Finding
   */

  export type AggregateFinding = {
    _count: FindingCountAggregateOutputType | null
    _avg: FindingAvgAggregateOutputType | null
    _sum: FindingSumAggregateOutputType | null
    _min: FindingMinAggregateOutputType | null
    _max: FindingMaxAggregateOutputType | null
  }

  export type FindingAvgAggregateOutputType = {
    confidence: number | null
    line: number | null
    endLine: number | null
  }

  export type FindingSumAggregateOutputType = {
    confidence: number | null
    line: number | null
    endLine: number | null
  }

  export type FindingMinAggregateOutputType = {
    id: string | null
    reviewJobId: string | null
    agentRunId: string | null
    fingerprint: string | null
    title: string | null
    category: string | null
    severity: string | null
    confidence: number | null
    filePath: string | null
    line: number | null
    endLine: number | null
    description: string | null
    evidence: string | null
    recommendation: string | null
    verificationStatus: string | null
    publicationStatus: string | null
    githubCommentId: string | null
    createdAt: Date | null
  }

  export type FindingMaxAggregateOutputType = {
    id: string | null
    reviewJobId: string | null
    agentRunId: string | null
    fingerprint: string | null
    title: string | null
    category: string | null
    severity: string | null
    confidence: number | null
    filePath: string | null
    line: number | null
    endLine: number | null
    description: string | null
    evidence: string | null
    recommendation: string | null
    verificationStatus: string | null
    publicationStatus: string | null
    githubCommentId: string | null
    createdAt: Date | null
  }

  export type FindingCountAggregateOutputType = {
    id: number
    reviewJobId: number
    agentRunId: number
    fingerprint: number
    title: number
    category: number
    severity: number
    confidence: number
    filePath: number
    line: number
    endLine: number
    description: number
    evidence: number
    recommendation: number
    verificationStatus: number
    publicationStatus: number
    githubCommentId: number
    createdAt: number
    _all: number
  }


  export type FindingAvgAggregateInputType = {
    confidence?: true
    line?: true
    endLine?: true
  }

  export type FindingSumAggregateInputType = {
    confidence?: true
    line?: true
    endLine?: true
  }

  export type FindingMinAggregateInputType = {
    id?: true
    reviewJobId?: true
    agentRunId?: true
    fingerprint?: true
    title?: true
    category?: true
    severity?: true
    confidence?: true
    filePath?: true
    line?: true
    endLine?: true
    description?: true
    evidence?: true
    recommendation?: true
    verificationStatus?: true
    publicationStatus?: true
    githubCommentId?: true
    createdAt?: true
  }

  export type FindingMaxAggregateInputType = {
    id?: true
    reviewJobId?: true
    agentRunId?: true
    fingerprint?: true
    title?: true
    category?: true
    severity?: true
    confidence?: true
    filePath?: true
    line?: true
    endLine?: true
    description?: true
    evidence?: true
    recommendation?: true
    verificationStatus?: true
    publicationStatus?: true
    githubCommentId?: true
    createdAt?: true
  }

  export type FindingCountAggregateInputType = {
    id?: true
    reviewJobId?: true
    agentRunId?: true
    fingerprint?: true
    title?: true
    category?: true
    severity?: true
    confidence?: true
    filePath?: true
    line?: true
    endLine?: true
    description?: true
    evidence?: true
    recommendation?: true
    verificationStatus?: true
    publicationStatus?: true
    githubCommentId?: true
    createdAt?: true
    _all?: true
  }

  export type FindingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Finding to aggregate.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Findings
    **/
    _count?: true | FindingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FindingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FindingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FindingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FindingMaxAggregateInputType
  }

  export type GetFindingAggregateType<T extends FindingAggregateArgs> = {
        [P in keyof T & keyof AggregateFinding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFinding[P]>
      : GetScalarType<T[P], AggregateFinding[P]>
  }




  export type FindingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FindingWhereInput
    orderBy?: FindingOrderByWithAggregationInput | FindingOrderByWithAggregationInput[]
    by: FindingScalarFieldEnum[] | FindingScalarFieldEnum
    having?: FindingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FindingCountAggregateInputType | true
    _avg?: FindingAvgAggregateInputType
    _sum?: FindingSumAggregateInputType
    _min?: FindingMinAggregateInputType
    _max?: FindingMaxAggregateInputType
  }

  export type FindingGroupByOutputType = {
    id: string
    reviewJobId: string
    agentRunId: string | null
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine: number | null
    description: string
    evidence: string
    recommendation: string | null
    verificationStatus: string
    publicationStatus: string
    githubCommentId: string | null
    createdAt: Date
    _count: FindingCountAggregateOutputType | null
    _avg: FindingAvgAggregateOutputType | null
    _sum: FindingSumAggregateOutputType | null
    _min: FindingMinAggregateOutputType | null
    _max: FindingMaxAggregateOutputType | null
  }

  type GetFindingGroupByPayload<T extends FindingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FindingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FindingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FindingGroupByOutputType[P]>
            : GetScalarType<T[P], FindingGroupByOutputType[P]>
        }
      >
    >


  export type FindingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reviewJobId?: boolean
    agentRunId?: boolean
    fingerprint?: boolean
    title?: boolean
    category?: boolean
    severity?: boolean
    confidence?: boolean
    filePath?: boolean
    line?: boolean
    endLine?: boolean
    description?: boolean
    evidence?: boolean
    recommendation?: boolean
    verificationStatus?: boolean
    publicationStatus?: boolean
    githubCommentId?: boolean
    createdAt?: boolean
    reviewJob?: boolean | ReviewJobDefaultArgs<ExtArgs>
    agentRun?: boolean | Finding$agentRunArgs<ExtArgs>
    feedbacks?: boolean | Finding$feedbacksArgs<ExtArgs>
    _count?: boolean | FindingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["finding"]>

  export type FindingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reviewJobId?: boolean
    agentRunId?: boolean
    fingerprint?: boolean
    title?: boolean
    category?: boolean
    severity?: boolean
    confidence?: boolean
    filePath?: boolean
    line?: boolean
    endLine?: boolean
    description?: boolean
    evidence?: boolean
    recommendation?: boolean
    verificationStatus?: boolean
    publicationStatus?: boolean
    githubCommentId?: boolean
    createdAt?: boolean
    reviewJob?: boolean | ReviewJobDefaultArgs<ExtArgs>
    agentRun?: boolean | Finding$agentRunArgs<ExtArgs>
  }, ExtArgs["result"]["finding"]>

  export type FindingSelectScalar = {
    id?: boolean
    reviewJobId?: boolean
    agentRunId?: boolean
    fingerprint?: boolean
    title?: boolean
    category?: boolean
    severity?: boolean
    confidence?: boolean
    filePath?: boolean
    line?: boolean
    endLine?: boolean
    description?: boolean
    evidence?: boolean
    recommendation?: boolean
    verificationStatus?: boolean
    publicationStatus?: boolean
    githubCommentId?: boolean
    createdAt?: boolean
  }

  export type FindingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviewJob?: boolean | ReviewJobDefaultArgs<ExtArgs>
    agentRun?: boolean | Finding$agentRunArgs<ExtArgs>
    feedbacks?: boolean | Finding$feedbacksArgs<ExtArgs>
    _count?: boolean | FindingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FindingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviewJob?: boolean | ReviewJobDefaultArgs<ExtArgs>
    agentRun?: boolean | Finding$agentRunArgs<ExtArgs>
  }

  export type $FindingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Finding"
    objects: {
      reviewJob: Prisma.$ReviewJobPayload<ExtArgs>
      agentRun: Prisma.$AgentRunPayload<ExtArgs> | null
      feedbacks: Prisma.$FindingFeedbackPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reviewJobId: string
      agentRunId: string | null
      fingerprint: string
      title: string
      category: string
      severity: string
      confidence: number
      filePath: string
      line: number
      endLine: number | null
      description: string
      evidence: string
      recommendation: string | null
      verificationStatus: string
      publicationStatus: string
      githubCommentId: string | null
      createdAt: Date
    }, ExtArgs["result"]["finding"]>
    composites: {}
  }

  type FindingGetPayload<S extends boolean | null | undefined | FindingDefaultArgs> = $Result.GetResult<Prisma.$FindingPayload, S>

  type FindingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FindingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FindingCountAggregateInputType | true
    }

  export interface FindingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Finding'], meta: { name: 'Finding' } }
    /**
     * Find zero or one Finding that matches the filter.
     * @param {FindingFindUniqueArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FindingFindUniqueArgs>(args: SelectSubset<T, FindingFindUniqueArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Finding that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FindingFindUniqueOrThrowArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FindingFindUniqueOrThrowArgs>(args: SelectSubset<T, FindingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Finding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFindFirstArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FindingFindFirstArgs>(args?: SelectSubset<T, FindingFindFirstArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Finding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFindFirstOrThrowArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FindingFindFirstOrThrowArgs>(args?: SelectSubset<T, FindingFindFirstOrThrowArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Findings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Findings
     * const findings = await prisma.finding.findMany()
     * 
     * // Get first 10 Findings
     * const findings = await prisma.finding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const findingWithIdOnly = await prisma.finding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FindingFindManyArgs>(args?: SelectSubset<T, FindingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Finding.
     * @param {FindingCreateArgs} args - Arguments to create a Finding.
     * @example
     * // Create one Finding
     * const Finding = await prisma.finding.create({
     *   data: {
     *     // ... data to create a Finding
     *   }
     * })
     * 
     */
    create<T extends FindingCreateArgs>(args: SelectSubset<T, FindingCreateArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Findings.
     * @param {FindingCreateManyArgs} args - Arguments to create many Findings.
     * @example
     * // Create many Findings
     * const finding = await prisma.finding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FindingCreateManyArgs>(args?: SelectSubset<T, FindingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Findings and returns the data saved in the database.
     * @param {FindingCreateManyAndReturnArgs} args - Arguments to create many Findings.
     * @example
     * // Create many Findings
     * const finding = await prisma.finding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Findings and only return the `id`
     * const findingWithIdOnly = await prisma.finding.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FindingCreateManyAndReturnArgs>(args?: SelectSubset<T, FindingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Finding.
     * @param {FindingDeleteArgs} args - Arguments to delete one Finding.
     * @example
     * // Delete one Finding
     * const Finding = await prisma.finding.delete({
     *   where: {
     *     // ... filter to delete one Finding
     *   }
     * })
     * 
     */
    delete<T extends FindingDeleteArgs>(args: SelectSubset<T, FindingDeleteArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Finding.
     * @param {FindingUpdateArgs} args - Arguments to update one Finding.
     * @example
     * // Update one Finding
     * const finding = await prisma.finding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FindingUpdateArgs>(args: SelectSubset<T, FindingUpdateArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Findings.
     * @param {FindingDeleteManyArgs} args - Arguments to filter Findings to delete.
     * @example
     * // Delete a few Findings
     * const { count } = await prisma.finding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FindingDeleteManyArgs>(args?: SelectSubset<T, FindingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Findings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Findings
     * const finding = await prisma.finding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FindingUpdateManyArgs>(args: SelectSubset<T, FindingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Finding.
     * @param {FindingUpsertArgs} args - Arguments to update or create a Finding.
     * @example
     * // Update or create a Finding
     * const finding = await prisma.finding.upsert({
     *   create: {
     *     // ... data to create a Finding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Finding we want to update
     *   }
     * })
     */
    upsert<T extends FindingUpsertArgs>(args: SelectSubset<T, FindingUpsertArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Findings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingCountArgs} args - Arguments to filter Findings to count.
     * @example
     * // Count the number of Findings
     * const count = await prisma.finding.count({
     *   where: {
     *     // ... the filter for the Findings we want to count
     *   }
     * })
    **/
    count<T extends FindingCountArgs>(
      args?: Subset<T, FindingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FindingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Finding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FindingAggregateArgs>(args: Subset<T, FindingAggregateArgs>): Prisma.PrismaPromise<GetFindingAggregateType<T>>

    /**
     * Group by Finding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FindingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FindingGroupByArgs['orderBy'] }
        : { orderBy?: FindingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FindingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFindingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Finding model
   */
  readonly fields: FindingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Finding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FindingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reviewJob<T extends ReviewJobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReviewJobDefaultArgs<ExtArgs>>): Prisma__ReviewJobClient<$Result.GetResult<Prisma.$ReviewJobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    agentRun<T extends Finding$agentRunArgs<ExtArgs> = {}>(args?: Subset<T, Finding$agentRunArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    feedbacks<T extends Finding$feedbacksArgs<ExtArgs> = {}>(args?: Subset<T, Finding$feedbacksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Finding model
   */ 
  interface FindingFieldRefs {
    readonly id: FieldRef<"Finding", 'String'>
    readonly reviewJobId: FieldRef<"Finding", 'String'>
    readonly agentRunId: FieldRef<"Finding", 'String'>
    readonly fingerprint: FieldRef<"Finding", 'String'>
    readonly title: FieldRef<"Finding", 'String'>
    readonly category: FieldRef<"Finding", 'String'>
    readonly severity: FieldRef<"Finding", 'String'>
    readonly confidence: FieldRef<"Finding", 'Float'>
    readonly filePath: FieldRef<"Finding", 'String'>
    readonly line: FieldRef<"Finding", 'Int'>
    readonly endLine: FieldRef<"Finding", 'Int'>
    readonly description: FieldRef<"Finding", 'String'>
    readonly evidence: FieldRef<"Finding", 'String'>
    readonly recommendation: FieldRef<"Finding", 'String'>
    readonly verificationStatus: FieldRef<"Finding", 'String'>
    readonly publicationStatus: FieldRef<"Finding", 'String'>
    readonly githubCommentId: FieldRef<"Finding", 'String'>
    readonly createdAt: FieldRef<"Finding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Finding findUnique
   */
  export type FindingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding findUniqueOrThrow
   */
  export type FindingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding findFirst
   */
  export type FindingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Findings.
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Findings.
     */
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * Finding findFirstOrThrow
   */
  export type FindingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Findings.
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Findings.
     */
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * Finding findMany
   */
  export type FindingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Findings to fetch.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Findings.
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * Finding create
   */
  export type FindingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * The data needed to create a Finding.
     */
    data: XOR<FindingCreateInput, FindingUncheckedCreateInput>
  }

  /**
   * Finding createMany
   */
  export type FindingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Findings.
     */
    data: FindingCreateManyInput | FindingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Finding createManyAndReturn
   */
  export type FindingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Findings.
     */
    data: FindingCreateManyInput | FindingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Finding update
   */
  export type FindingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * The data needed to update a Finding.
     */
    data: XOR<FindingUpdateInput, FindingUncheckedUpdateInput>
    /**
     * Choose, which Finding to update.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding updateMany
   */
  export type FindingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Findings.
     */
    data: XOR<FindingUpdateManyMutationInput, FindingUncheckedUpdateManyInput>
    /**
     * Filter which Findings to update
     */
    where?: FindingWhereInput
  }

  /**
   * Finding upsert
   */
  export type FindingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * The filter to search for the Finding to update in case it exists.
     */
    where: FindingWhereUniqueInput
    /**
     * In case the Finding found by the `where` argument doesn't exist, create a new Finding with this data.
     */
    create: XOR<FindingCreateInput, FindingUncheckedCreateInput>
    /**
     * In case the Finding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FindingUpdateInput, FindingUncheckedUpdateInput>
  }

  /**
   * Finding delete
   */
  export type FindingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter which Finding to delete.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding deleteMany
   */
  export type FindingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Findings to delete
     */
    where?: FindingWhereInput
  }

  /**
   * Finding.agentRun
   */
  export type Finding$agentRunArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    where?: AgentRunWhereInput
  }

  /**
   * Finding.feedbacks
   */
  export type Finding$feedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    where?: FindingFeedbackWhereInput
    orderBy?: FindingFeedbackOrderByWithRelationInput | FindingFeedbackOrderByWithRelationInput[]
    cursor?: FindingFeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FindingFeedbackScalarFieldEnum | FindingFeedbackScalarFieldEnum[]
  }

  /**
   * Finding without action
   */
  export type FindingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
  }


  /**
   * Model FindingFeedback
   */

  export type AggregateFindingFeedback = {
    _count: FindingFeedbackCountAggregateOutputType | null
    _min: FindingFeedbackMinAggregateOutputType | null
    _max: FindingFeedbackMaxAggregateOutputType | null
  }

  export type FindingFeedbackMinAggregateOutputType = {
    id: string | null
    findingId: string | null
    userId: string | null
    feedbackType: string | null
    comment: string | null
    createdAt: Date | null
  }

  export type FindingFeedbackMaxAggregateOutputType = {
    id: string | null
    findingId: string | null
    userId: string | null
    feedbackType: string | null
    comment: string | null
    createdAt: Date | null
  }

  export type FindingFeedbackCountAggregateOutputType = {
    id: number
    findingId: number
    userId: number
    feedbackType: number
    comment: number
    createdAt: number
    _all: number
  }


  export type FindingFeedbackMinAggregateInputType = {
    id?: true
    findingId?: true
    userId?: true
    feedbackType?: true
    comment?: true
    createdAt?: true
  }

  export type FindingFeedbackMaxAggregateInputType = {
    id?: true
    findingId?: true
    userId?: true
    feedbackType?: true
    comment?: true
    createdAt?: true
  }

  export type FindingFeedbackCountAggregateInputType = {
    id?: true
    findingId?: true
    userId?: true
    feedbackType?: true
    comment?: true
    createdAt?: true
    _all?: true
  }

  export type FindingFeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FindingFeedback to aggregate.
     */
    where?: FindingFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FindingFeedbacks to fetch.
     */
    orderBy?: FindingFeedbackOrderByWithRelationInput | FindingFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FindingFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FindingFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FindingFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FindingFeedbacks
    **/
    _count?: true | FindingFeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FindingFeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FindingFeedbackMaxAggregateInputType
  }

  export type GetFindingFeedbackAggregateType<T extends FindingFeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateFindingFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFindingFeedback[P]>
      : GetScalarType<T[P], AggregateFindingFeedback[P]>
  }




  export type FindingFeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FindingFeedbackWhereInput
    orderBy?: FindingFeedbackOrderByWithAggregationInput | FindingFeedbackOrderByWithAggregationInput[]
    by: FindingFeedbackScalarFieldEnum[] | FindingFeedbackScalarFieldEnum
    having?: FindingFeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FindingFeedbackCountAggregateInputType | true
    _min?: FindingFeedbackMinAggregateInputType
    _max?: FindingFeedbackMaxAggregateInputType
  }

  export type FindingFeedbackGroupByOutputType = {
    id: string
    findingId: string
    userId: string
    feedbackType: string
    comment: string | null
    createdAt: Date
    _count: FindingFeedbackCountAggregateOutputType | null
    _min: FindingFeedbackMinAggregateOutputType | null
    _max: FindingFeedbackMaxAggregateOutputType | null
  }

  type GetFindingFeedbackGroupByPayload<T extends FindingFeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FindingFeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FindingFeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FindingFeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], FindingFeedbackGroupByOutputType[P]>
        }
      >
    >


  export type FindingFeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    findingId?: boolean
    userId?: boolean
    feedbackType?: boolean
    comment?: boolean
    createdAt?: boolean
    finding?: boolean | FindingDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["findingFeedback"]>

  export type FindingFeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    findingId?: boolean
    userId?: boolean
    feedbackType?: boolean
    comment?: boolean
    createdAt?: boolean
    finding?: boolean | FindingDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["findingFeedback"]>

  export type FindingFeedbackSelectScalar = {
    id?: boolean
    findingId?: boolean
    userId?: boolean
    feedbackType?: boolean
    comment?: boolean
    createdAt?: boolean
  }

  export type FindingFeedbackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    finding?: boolean | FindingDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FindingFeedbackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    finding?: boolean | FindingDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FindingFeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FindingFeedback"
    objects: {
      finding: Prisma.$FindingPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      findingId: string
      userId: string
      feedbackType: string
      comment: string | null
      createdAt: Date
    }, ExtArgs["result"]["findingFeedback"]>
    composites: {}
  }

  type FindingFeedbackGetPayload<S extends boolean | null | undefined | FindingFeedbackDefaultArgs> = $Result.GetResult<Prisma.$FindingFeedbackPayload, S>

  type FindingFeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FindingFeedbackFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FindingFeedbackCountAggregateInputType | true
    }

  export interface FindingFeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FindingFeedback'], meta: { name: 'FindingFeedback' } }
    /**
     * Find zero or one FindingFeedback that matches the filter.
     * @param {FindingFeedbackFindUniqueArgs} args - Arguments to find a FindingFeedback
     * @example
     * // Get one FindingFeedback
     * const findingFeedback = await prisma.findingFeedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FindingFeedbackFindUniqueArgs>(args: SelectSubset<T, FindingFeedbackFindUniqueArgs<ExtArgs>>): Prisma__FindingFeedbackClient<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FindingFeedback that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FindingFeedbackFindUniqueOrThrowArgs} args - Arguments to find a FindingFeedback
     * @example
     * // Get one FindingFeedback
     * const findingFeedback = await prisma.findingFeedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FindingFeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, FindingFeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FindingFeedbackClient<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FindingFeedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFeedbackFindFirstArgs} args - Arguments to find a FindingFeedback
     * @example
     * // Get one FindingFeedback
     * const findingFeedback = await prisma.findingFeedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FindingFeedbackFindFirstArgs>(args?: SelectSubset<T, FindingFeedbackFindFirstArgs<ExtArgs>>): Prisma__FindingFeedbackClient<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FindingFeedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFeedbackFindFirstOrThrowArgs} args - Arguments to find a FindingFeedback
     * @example
     * // Get one FindingFeedback
     * const findingFeedback = await prisma.findingFeedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FindingFeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, FindingFeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__FindingFeedbackClient<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FindingFeedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FindingFeedbacks
     * const findingFeedbacks = await prisma.findingFeedback.findMany()
     * 
     * // Get first 10 FindingFeedbacks
     * const findingFeedbacks = await prisma.findingFeedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const findingFeedbackWithIdOnly = await prisma.findingFeedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FindingFeedbackFindManyArgs>(args?: SelectSubset<T, FindingFeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FindingFeedback.
     * @param {FindingFeedbackCreateArgs} args - Arguments to create a FindingFeedback.
     * @example
     * // Create one FindingFeedback
     * const FindingFeedback = await prisma.findingFeedback.create({
     *   data: {
     *     // ... data to create a FindingFeedback
     *   }
     * })
     * 
     */
    create<T extends FindingFeedbackCreateArgs>(args: SelectSubset<T, FindingFeedbackCreateArgs<ExtArgs>>): Prisma__FindingFeedbackClient<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FindingFeedbacks.
     * @param {FindingFeedbackCreateManyArgs} args - Arguments to create many FindingFeedbacks.
     * @example
     * // Create many FindingFeedbacks
     * const findingFeedback = await prisma.findingFeedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FindingFeedbackCreateManyArgs>(args?: SelectSubset<T, FindingFeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FindingFeedbacks and returns the data saved in the database.
     * @param {FindingFeedbackCreateManyAndReturnArgs} args - Arguments to create many FindingFeedbacks.
     * @example
     * // Create many FindingFeedbacks
     * const findingFeedback = await prisma.findingFeedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FindingFeedbacks and only return the `id`
     * const findingFeedbackWithIdOnly = await prisma.findingFeedback.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FindingFeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, FindingFeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FindingFeedback.
     * @param {FindingFeedbackDeleteArgs} args - Arguments to delete one FindingFeedback.
     * @example
     * // Delete one FindingFeedback
     * const FindingFeedback = await prisma.findingFeedback.delete({
     *   where: {
     *     // ... filter to delete one FindingFeedback
     *   }
     * })
     * 
     */
    delete<T extends FindingFeedbackDeleteArgs>(args: SelectSubset<T, FindingFeedbackDeleteArgs<ExtArgs>>): Prisma__FindingFeedbackClient<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FindingFeedback.
     * @param {FindingFeedbackUpdateArgs} args - Arguments to update one FindingFeedback.
     * @example
     * // Update one FindingFeedback
     * const findingFeedback = await prisma.findingFeedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FindingFeedbackUpdateArgs>(args: SelectSubset<T, FindingFeedbackUpdateArgs<ExtArgs>>): Prisma__FindingFeedbackClient<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FindingFeedbacks.
     * @param {FindingFeedbackDeleteManyArgs} args - Arguments to filter FindingFeedbacks to delete.
     * @example
     * // Delete a few FindingFeedbacks
     * const { count } = await prisma.findingFeedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FindingFeedbackDeleteManyArgs>(args?: SelectSubset<T, FindingFeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FindingFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FindingFeedbacks
     * const findingFeedback = await prisma.findingFeedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FindingFeedbackUpdateManyArgs>(args: SelectSubset<T, FindingFeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FindingFeedback.
     * @param {FindingFeedbackUpsertArgs} args - Arguments to update or create a FindingFeedback.
     * @example
     * // Update or create a FindingFeedback
     * const findingFeedback = await prisma.findingFeedback.upsert({
     *   create: {
     *     // ... data to create a FindingFeedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FindingFeedback we want to update
     *   }
     * })
     */
    upsert<T extends FindingFeedbackUpsertArgs>(args: SelectSubset<T, FindingFeedbackUpsertArgs<ExtArgs>>): Prisma__FindingFeedbackClient<$Result.GetResult<Prisma.$FindingFeedbackPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FindingFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFeedbackCountArgs} args - Arguments to filter FindingFeedbacks to count.
     * @example
     * // Count the number of FindingFeedbacks
     * const count = await prisma.findingFeedback.count({
     *   where: {
     *     // ... the filter for the FindingFeedbacks we want to count
     *   }
     * })
    **/
    count<T extends FindingFeedbackCountArgs>(
      args?: Subset<T, FindingFeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FindingFeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FindingFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FindingFeedbackAggregateArgs>(args: Subset<T, FindingFeedbackAggregateArgs>): Prisma.PrismaPromise<GetFindingFeedbackAggregateType<T>>

    /**
     * Group by FindingFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FindingFeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FindingFeedbackGroupByArgs['orderBy'] }
        : { orderBy?: FindingFeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FindingFeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFindingFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FindingFeedback model
   */
  readonly fields: FindingFeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FindingFeedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FindingFeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    finding<T extends FindingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FindingDefaultArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FindingFeedback model
   */ 
  interface FindingFeedbackFieldRefs {
    readonly id: FieldRef<"FindingFeedback", 'String'>
    readonly findingId: FieldRef<"FindingFeedback", 'String'>
    readonly userId: FieldRef<"FindingFeedback", 'String'>
    readonly feedbackType: FieldRef<"FindingFeedback", 'String'>
    readonly comment: FieldRef<"FindingFeedback", 'String'>
    readonly createdAt: FieldRef<"FindingFeedback", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FindingFeedback findUnique
   */
  export type FindingFeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which FindingFeedback to fetch.
     */
    where: FindingFeedbackWhereUniqueInput
  }

  /**
   * FindingFeedback findUniqueOrThrow
   */
  export type FindingFeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which FindingFeedback to fetch.
     */
    where: FindingFeedbackWhereUniqueInput
  }

  /**
   * FindingFeedback findFirst
   */
  export type FindingFeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which FindingFeedback to fetch.
     */
    where?: FindingFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FindingFeedbacks to fetch.
     */
    orderBy?: FindingFeedbackOrderByWithRelationInput | FindingFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FindingFeedbacks.
     */
    cursor?: FindingFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FindingFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FindingFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FindingFeedbacks.
     */
    distinct?: FindingFeedbackScalarFieldEnum | FindingFeedbackScalarFieldEnum[]
  }

  /**
   * FindingFeedback findFirstOrThrow
   */
  export type FindingFeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which FindingFeedback to fetch.
     */
    where?: FindingFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FindingFeedbacks to fetch.
     */
    orderBy?: FindingFeedbackOrderByWithRelationInput | FindingFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FindingFeedbacks.
     */
    cursor?: FindingFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FindingFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FindingFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FindingFeedbacks.
     */
    distinct?: FindingFeedbackScalarFieldEnum | FindingFeedbackScalarFieldEnum[]
  }

  /**
   * FindingFeedback findMany
   */
  export type FindingFeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which FindingFeedbacks to fetch.
     */
    where?: FindingFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FindingFeedbacks to fetch.
     */
    orderBy?: FindingFeedbackOrderByWithRelationInput | FindingFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FindingFeedbacks.
     */
    cursor?: FindingFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FindingFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FindingFeedbacks.
     */
    skip?: number
    distinct?: FindingFeedbackScalarFieldEnum | FindingFeedbackScalarFieldEnum[]
  }

  /**
   * FindingFeedback create
   */
  export type FindingFeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    /**
     * The data needed to create a FindingFeedback.
     */
    data: XOR<FindingFeedbackCreateInput, FindingFeedbackUncheckedCreateInput>
  }

  /**
   * FindingFeedback createMany
   */
  export type FindingFeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FindingFeedbacks.
     */
    data: FindingFeedbackCreateManyInput | FindingFeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FindingFeedback createManyAndReturn
   */
  export type FindingFeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FindingFeedbacks.
     */
    data: FindingFeedbackCreateManyInput | FindingFeedbackCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FindingFeedback update
   */
  export type FindingFeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    /**
     * The data needed to update a FindingFeedback.
     */
    data: XOR<FindingFeedbackUpdateInput, FindingFeedbackUncheckedUpdateInput>
    /**
     * Choose, which FindingFeedback to update.
     */
    where: FindingFeedbackWhereUniqueInput
  }

  /**
   * FindingFeedback updateMany
   */
  export type FindingFeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FindingFeedbacks.
     */
    data: XOR<FindingFeedbackUpdateManyMutationInput, FindingFeedbackUncheckedUpdateManyInput>
    /**
     * Filter which FindingFeedbacks to update
     */
    where?: FindingFeedbackWhereInput
  }

  /**
   * FindingFeedback upsert
   */
  export type FindingFeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    /**
     * The filter to search for the FindingFeedback to update in case it exists.
     */
    where: FindingFeedbackWhereUniqueInput
    /**
     * In case the FindingFeedback found by the `where` argument doesn't exist, create a new FindingFeedback with this data.
     */
    create: XOR<FindingFeedbackCreateInput, FindingFeedbackUncheckedCreateInput>
    /**
     * In case the FindingFeedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FindingFeedbackUpdateInput, FindingFeedbackUncheckedUpdateInput>
  }

  /**
   * FindingFeedback delete
   */
  export type FindingFeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
    /**
     * Filter which FindingFeedback to delete.
     */
    where: FindingFeedbackWhereUniqueInput
  }

  /**
   * FindingFeedback deleteMany
   */
  export type FindingFeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FindingFeedbacks to delete
     */
    where?: FindingFeedbackWhereInput
  }

  /**
   * FindingFeedback without action
   */
  export type FindingFeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingFeedback
     */
    select?: FindingFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingFeedbackInclude<ExtArgs> | null
  }


  /**
   * Model FixProposal
   */

  export type AggregateFixProposal = {
    _count: FixProposalCountAggregateOutputType | null
    _min: FixProposalMinAggregateOutputType | null
    _max: FixProposalMaxAggregateOutputType | null
  }

  export type FixProposalMinAggregateOutputType = {
    id: string | null
    findingId: string | null
    patch: string | null
    sandboxStatus: string | null
    approvalStatus: string | null
    createdAt: Date | null
  }

  export type FixProposalMaxAggregateOutputType = {
    id: string | null
    findingId: string | null
    patch: string | null
    sandboxStatus: string | null
    approvalStatus: string | null
    createdAt: Date | null
  }

  export type FixProposalCountAggregateOutputType = {
    id: number
    findingId: number
    patch: number
    sandboxStatus: number
    testResults: number
    approvalStatus: number
    createdAt: number
    _all: number
  }


  export type FixProposalMinAggregateInputType = {
    id?: true
    findingId?: true
    patch?: true
    sandboxStatus?: true
    approvalStatus?: true
    createdAt?: true
  }

  export type FixProposalMaxAggregateInputType = {
    id?: true
    findingId?: true
    patch?: true
    sandboxStatus?: true
    approvalStatus?: true
    createdAt?: true
  }

  export type FixProposalCountAggregateInputType = {
    id?: true
    findingId?: true
    patch?: true
    sandboxStatus?: true
    testResults?: true
    approvalStatus?: true
    createdAt?: true
    _all?: true
  }

  export type FixProposalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FixProposal to aggregate.
     */
    where?: FixProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FixProposals to fetch.
     */
    orderBy?: FixProposalOrderByWithRelationInput | FixProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FixProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FixProposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FixProposals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FixProposals
    **/
    _count?: true | FixProposalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FixProposalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FixProposalMaxAggregateInputType
  }

  export type GetFixProposalAggregateType<T extends FixProposalAggregateArgs> = {
        [P in keyof T & keyof AggregateFixProposal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFixProposal[P]>
      : GetScalarType<T[P], AggregateFixProposal[P]>
  }




  export type FixProposalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FixProposalWhereInput
    orderBy?: FixProposalOrderByWithAggregationInput | FixProposalOrderByWithAggregationInput[]
    by: FixProposalScalarFieldEnum[] | FixProposalScalarFieldEnum
    having?: FixProposalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FixProposalCountAggregateInputType | true
    _min?: FixProposalMinAggregateInputType
    _max?: FixProposalMaxAggregateInputType
  }

  export type FixProposalGroupByOutputType = {
    id: string
    findingId: string
    patch: string
    sandboxStatus: string
    testResults: JsonValue | null
    approvalStatus: string
    createdAt: Date
    _count: FixProposalCountAggregateOutputType | null
    _min: FixProposalMinAggregateOutputType | null
    _max: FixProposalMaxAggregateOutputType | null
  }

  type GetFixProposalGroupByPayload<T extends FixProposalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FixProposalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FixProposalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FixProposalGroupByOutputType[P]>
            : GetScalarType<T[P], FixProposalGroupByOutputType[P]>
        }
      >
    >


  export type FixProposalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    findingId?: boolean
    patch?: boolean
    sandboxStatus?: boolean
    testResults?: boolean
    approvalStatus?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["fixProposal"]>

  export type FixProposalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    findingId?: boolean
    patch?: boolean
    sandboxStatus?: boolean
    testResults?: boolean
    approvalStatus?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["fixProposal"]>

  export type FixProposalSelectScalar = {
    id?: boolean
    findingId?: boolean
    patch?: boolean
    sandboxStatus?: boolean
    testResults?: boolean
    approvalStatus?: boolean
    createdAt?: boolean
  }


  export type $FixProposalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FixProposal"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      findingId: string
      patch: string
      sandboxStatus: string
      testResults: Prisma.JsonValue | null
      approvalStatus: string
      createdAt: Date
    }, ExtArgs["result"]["fixProposal"]>
    composites: {}
  }

  type FixProposalGetPayload<S extends boolean | null | undefined | FixProposalDefaultArgs> = $Result.GetResult<Prisma.$FixProposalPayload, S>

  type FixProposalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FixProposalFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FixProposalCountAggregateInputType | true
    }

  export interface FixProposalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FixProposal'], meta: { name: 'FixProposal' } }
    /**
     * Find zero or one FixProposal that matches the filter.
     * @param {FixProposalFindUniqueArgs} args - Arguments to find a FixProposal
     * @example
     * // Get one FixProposal
     * const fixProposal = await prisma.fixProposal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FixProposalFindUniqueArgs>(args: SelectSubset<T, FixProposalFindUniqueArgs<ExtArgs>>): Prisma__FixProposalClient<$Result.GetResult<Prisma.$FixProposalPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FixProposal that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FixProposalFindUniqueOrThrowArgs} args - Arguments to find a FixProposal
     * @example
     * // Get one FixProposal
     * const fixProposal = await prisma.fixProposal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FixProposalFindUniqueOrThrowArgs>(args: SelectSubset<T, FixProposalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FixProposalClient<$Result.GetResult<Prisma.$FixProposalPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FixProposal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixProposalFindFirstArgs} args - Arguments to find a FixProposal
     * @example
     * // Get one FixProposal
     * const fixProposal = await prisma.fixProposal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FixProposalFindFirstArgs>(args?: SelectSubset<T, FixProposalFindFirstArgs<ExtArgs>>): Prisma__FixProposalClient<$Result.GetResult<Prisma.$FixProposalPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FixProposal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixProposalFindFirstOrThrowArgs} args - Arguments to find a FixProposal
     * @example
     * // Get one FixProposal
     * const fixProposal = await prisma.fixProposal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FixProposalFindFirstOrThrowArgs>(args?: SelectSubset<T, FixProposalFindFirstOrThrowArgs<ExtArgs>>): Prisma__FixProposalClient<$Result.GetResult<Prisma.$FixProposalPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FixProposals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixProposalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FixProposals
     * const fixProposals = await prisma.fixProposal.findMany()
     * 
     * // Get first 10 FixProposals
     * const fixProposals = await prisma.fixProposal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fixProposalWithIdOnly = await prisma.fixProposal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FixProposalFindManyArgs>(args?: SelectSubset<T, FixProposalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FixProposalPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FixProposal.
     * @param {FixProposalCreateArgs} args - Arguments to create a FixProposal.
     * @example
     * // Create one FixProposal
     * const FixProposal = await prisma.fixProposal.create({
     *   data: {
     *     // ... data to create a FixProposal
     *   }
     * })
     * 
     */
    create<T extends FixProposalCreateArgs>(args: SelectSubset<T, FixProposalCreateArgs<ExtArgs>>): Prisma__FixProposalClient<$Result.GetResult<Prisma.$FixProposalPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FixProposals.
     * @param {FixProposalCreateManyArgs} args - Arguments to create many FixProposals.
     * @example
     * // Create many FixProposals
     * const fixProposal = await prisma.fixProposal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FixProposalCreateManyArgs>(args?: SelectSubset<T, FixProposalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FixProposals and returns the data saved in the database.
     * @param {FixProposalCreateManyAndReturnArgs} args - Arguments to create many FixProposals.
     * @example
     * // Create many FixProposals
     * const fixProposal = await prisma.fixProposal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FixProposals and only return the `id`
     * const fixProposalWithIdOnly = await prisma.fixProposal.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FixProposalCreateManyAndReturnArgs>(args?: SelectSubset<T, FixProposalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FixProposalPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FixProposal.
     * @param {FixProposalDeleteArgs} args - Arguments to delete one FixProposal.
     * @example
     * // Delete one FixProposal
     * const FixProposal = await prisma.fixProposal.delete({
     *   where: {
     *     // ... filter to delete one FixProposal
     *   }
     * })
     * 
     */
    delete<T extends FixProposalDeleteArgs>(args: SelectSubset<T, FixProposalDeleteArgs<ExtArgs>>): Prisma__FixProposalClient<$Result.GetResult<Prisma.$FixProposalPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FixProposal.
     * @param {FixProposalUpdateArgs} args - Arguments to update one FixProposal.
     * @example
     * // Update one FixProposal
     * const fixProposal = await prisma.fixProposal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FixProposalUpdateArgs>(args: SelectSubset<T, FixProposalUpdateArgs<ExtArgs>>): Prisma__FixProposalClient<$Result.GetResult<Prisma.$FixProposalPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FixProposals.
     * @param {FixProposalDeleteManyArgs} args - Arguments to filter FixProposals to delete.
     * @example
     * // Delete a few FixProposals
     * const { count } = await prisma.fixProposal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FixProposalDeleteManyArgs>(args?: SelectSubset<T, FixProposalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FixProposals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixProposalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FixProposals
     * const fixProposal = await prisma.fixProposal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FixProposalUpdateManyArgs>(args: SelectSubset<T, FixProposalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FixProposal.
     * @param {FixProposalUpsertArgs} args - Arguments to update or create a FixProposal.
     * @example
     * // Update or create a FixProposal
     * const fixProposal = await prisma.fixProposal.upsert({
     *   create: {
     *     // ... data to create a FixProposal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FixProposal we want to update
     *   }
     * })
     */
    upsert<T extends FixProposalUpsertArgs>(args: SelectSubset<T, FixProposalUpsertArgs<ExtArgs>>): Prisma__FixProposalClient<$Result.GetResult<Prisma.$FixProposalPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FixProposals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixProposalCountArgs} args - Arguments to filter FixProposals to count.
     * @example
     * // Count the number of FixProposals
     * const count = await prisma.fixProposal.count({
     *   where: {
     *     // ... the filter for the FixProposals we want to count
     *   }
     * })
    **/
    count<T extends FixProposalCountArgs>(
      args?: Subset<T, FixProposalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FixProposalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FixProposal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixProposalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FixProposalAggregateArgs>(args: Subset<T, FixProposalAggregateArgs>): Prisma.PrismaPromise<GetFixProposalAggregateType<T>>

    /**
     * Group by FixProposal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixProposalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FixProposalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FixProposalGroupByArgs['orderBy'] }
        : { orderBy?: FixProposalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FixProposalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFixProposalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FixProposal model
   */
  readonly fields: FixProposalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FixProposal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FixProposalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FixProposal model
   */ 
  interface FixProposalFieldRefs {
    readonly id: FieldRef<"FixProposal", 'String'>
    readonly findingId: FieldRef<"FixProposal", 'String'>
    readonly patch: FieldRef<"FixProposal", 'String'>
    readonly sandboxStatus: FieldRef<"FixProposal", 'String'>
    readonly testResults: FieldRef<"FixProposal", 'Json'>
    readonly approvalStatus: FieldRef<"FixProposal", 'String'>
    readonly createdAt: FieldRef<"FixProposal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FixProposal findUnique
   */
  export type FixProposalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelect<ExtArgs> | null
    /**
     * Filter, which FixProposal to fetch.
     */
    where: FixProposalWhereUniqueInput
  }

  /**
   * FixProposal findUniqueOrThrow
   */
  export type FixProposalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelect<ExtArgs> | null
    /**
     * Filter, which FixProposal to fetch.
     */
    where: FixProposalWhereUniqueInput
  }

  /**
   * FixProposal findFirst
   */
  export type FixProposalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelect<ExtArgs> | null
    /**
     * Filter, which FixProposal to fetch.
     */
    where?: FixProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FixProposals to fetch.
     */
    orderBy?: FixProposalOrderByWithRelationInput | FixProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FixProposals.
     */
    cursor?: FixProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FixProposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FixProposals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FixProposals.
     */
    distinct?: FixProposalScalarFieldEnum | FixProposalScalarFieldEnum[]
  }

  /**
   * FixProposal findFirstOrThrow
   */
  export type FixProposalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelect<ExtArgs> | null
    /**
     * Filter, which FixProposal to fetch.
     */
    where?: FixProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FixProposals to fetch.
     */
    orderBy?: FixProposalOrderByWithRelationInput | FixProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FixProposals.
     */
    cursor?: FixProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FixProposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FixProposals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FixProposals.
     */
    distinct?: FixProposalScalarFieldEnum | FixProposalScalarFieldEnum[]
  }

  /**
   * FixProposal findMany
   */
  export type FixProposalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelect<ExtArgs> | null
    /**
     * Filter, which FixProposals to fetch.
     */
    where?: FixProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FixProposals to fetch.
     */
    orderBy?: FixProposalOrderByWithRelationInput | FixProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FixProposals.
     */
    cursor?: FixProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FixProposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FixProposals.
     */
    skip?: number
    distinct?: FixProposalScalarFieldEnum | FixProposalScalarFieldEnum[]
  }

  /**
   * FixProposal create
   */
  export type FixProposalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelect<ExtArgs> | null
    /**
     * The data needed to create a FixProposal.
     */
    data: XOR<FixProposalCreateInput, FixProposalUncheckedCreateInput>
  }

  /**
   * FixProposal createMany
   */
  export type FixProposalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FixProposals.
     */
    data: FixProposalCreateManyInput | FixProposalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FixProposal createManyAndReturn
   */
  export type FixProposalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FixProposals.
     */
    data: FixProposalCreateManyInput | FixProposalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FixProposal update
   */
  export type FixProposalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelect<ExtArgs> | null
    /**
     * The data needed to update a FixProposal.
     */
    data: XOR<FixProposalUpdateInput, FixProposalUncheckedUpdateInput>
    /**
     * Choose, which FixProposal to update.
     */
    where: FixProposalWhereUniqueInput
  }

  /**
   * FixProposal updateMany
   */
  export type FixProposalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FixProposals.
     */
    data: XOR<FixProposalUpdateManyMutationInput, FixProposalUncheckedUpdateManyInput>
    /**
     * Filter which FixProposals to update
     */
    where?: FixProposalWhereInput
  }

  /**
   * FixProposal upsert
   */
  export type FixProposalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelect<ExtArgs> | null
    /**
     * The filter to search for the FixProposal to update in case it exists.
     */
    where: FixProposalWhereUniqueInput
    /**
     * In case the FixProposal found by the `where` argument doesn't exist, create a new FixProposal with this data.
     */
    create: XOR<FixProposalCreateInput, FixProposalUncheckedCreateInput>
    /**
     * In case the FixProposal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FixProposalUpdateInput, FixProposalUncheckedUpdateInput>
  }

  /**
   * FixProposal delete
   */
  export type FixProposalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelect<ExtArgs> | null
    /**
     * Filter which FixProposal to delete.
     */
    where: FixProposalWhereUniqueInput
  }

  /**
   * FixProposal deleteMany
   */
  export type FixProposalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FixProposals to delete
     */
    where?: FixProposalWhereInput
  }

  /**
   * FixProposal without action
   */
  export type FixProposalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixProposal
     */
    select?: FixProposalSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    displayName: 'displayName',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const GithubInstallationScalarFieldEnum: {
    id: 'id',
    githubInstallationId: 'githubInstallationId',
    accountLogin: 'accountLogin',
    accountType: 'accountType',
    encryptedCredentialsRef: 'encryptedCredentialsRef',
    createdAt: 'createdAt'
  };

  export type GithubInstallationScalarFieldEnum = (typeof GithubInstallationScalarFieldEnum)[keyof typeof GithubInstallationScalarFieldEnum]


  export const RepositoryScalarFieldEnum: {
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

  export type RepositoryScalarFieldEnum = (typeof RepositoryScalarFieldEnum)[keyof typeof RepositoryScalarFieldEnum]


  export const PullRequestScalarFieldEnum: {
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

  export type PullRequestScalarFieldEnum = (typeof PullRequestScalarFieldEnum)[keyof typeof PullRequestScalarFieldEnum]


  export const WebhookDeliveryScalarFieldEnum: {
    id: 'id',
    githubDeliveryId: 'githubDeliveryId',
    eventType: 'eventType',
    repositoryId: 'repositoryId',
    receivedAt: 'receivedAt',
    processingStatus: 'processingStatus'
  };

  export type WebhookDeliveryScalarFieldEnum = (typeof WebhookDeliveryScalarFieldEnum)[keyof typeof WebhookDeliveryScalarFieldEnum]


  export const ReviewJobScalarFieldEnum: {
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

  export type ReviewJobScalarFieldEnum = (typeof ReviewJobScalarFieldEnum)[keyof typeof ReviewJobScalarFieldEnum]


  export const AgentRunScalarFieldEnum: {
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

  export type AgentRunScalarFieldEnum = (typeof AgentRunScalarFieldEnum)[keyof typeof AgentRunScalarFieldEnum]


  export const FindingScalarFieldEnum: {
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

  export type FindingScalarFieldEnum = (typeof FindingScalarFieldEnum)[keyof typeof FindingScalarFieldEnum]


  export const FindingFeedbackScalarFieldEnum: {
    id: 'id',
    findingId: 'findingId',
    userId: 'userId',
    feedbackType: 'feedbackType',
    comment: 'comment',
    createdAt: 'createdAt'
  };

  export type FindingFeedbackScalarFieldEnum = (typeof FindingFeedbackScalarFieldEnum)[keyof typeof FindingFeedbackScalarFieldEnum]


  export const FixProposalScalarFieldEnum: {
    id: 'id',
    findingId: 'findingId',
    patch: 'patch',
    sandboxStatus: 'sandboxStatus',
    testResults: 'testResults',
    approvalStatus: 'approvalStatus',
    createdAt: 'createdAt'
  };

  export type FixProposalScalarFieldEnum = (typeof FixProposalScalarFieldEnum)[keyof typeof FixProposalScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    displayName?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    feedbacks?: FindingFeedbackListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    feedbacks?: FindingFeedbackOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    displayName?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    feedbacks?: FindingFeedbackListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    displayName?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type GithubInstallationWhereInput = {
    AND?: GithubInstallationWhereInput | GithubInstallationWhereInput[]
    OR?: GithubInstallationWhereInput[]
    NOT?: GithubInstallationWhereInput | GithubInstallationWhereInput[]
    id?: StringFilter<"GithubInstallation"> | string
    githubInstallationId?: IntFilter<"GithubInstallation"> | number
    accountLogin?: StringFilter<"GithubInstallation"> | string
    accountType?: StringFilter<"GithubInstallation"> | string
    encryptedCredentialsRef?: StringNullableFilter<"GithubInstallation"> | string | null
    createdAt?: DateTimeFilter<"GithubInstallation"> | Date | string
    repositories?: RepositoryListRelationFilter
  }

  export type GithubInstallationOrderByWithRelationInput = {
    id?: SortOrder
    githubInstallationId?: SortOrder
    accountLogin?: SortOrder
    accountType?: SortOrder
    encryptedCredentialsRef?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    repositories?: RepositoryOrderByRelationAggregateInput
  }

  export type GithubInstallationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    githubInstallationId?: number
    AND?: GithubInstallationWhereInput | GithubInstallationWhereInput[]
    OR?: GithubInstallationWhereInput[]
    NOT?: GithubInstallationWhereInput | GithubInstallationWhereInput[]
    accountLogin?: StringFilter<"GithubInstallation"> | string
    accountType?: StringFilter<"GithubInstallation"> | string
    encryptedCredentialsRef?: StringNullableFilter<"GithubInstallation"> | string | null
    createdAt?: DateTimeFilter<"GithubInstallation"> | Date | string
    repositories?: RepositoryListRelationFilter
  }, "id" | "githubInstallationId">

  export type GithubInstallationOrderByWithAggregationInput = {
    id?: SortOrder
    githubInstallationId?: SortOrder
    accountLogin?: SortOrder
    accountType?: SortOrder
    encryptedCredentialsRef?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: GithubInstallationCountOrderByAggregateInput
    _avg?: GithubInstallationAvgOrderByAggregateInput
    _max?: GithubInstallationMaxOrderByAggregateInput
    _min?: GithubInstallationMinOrderByAggregateInput
    _sum?: GithubInstallationSumOrderByAggregateInput
  }

  export type GithubInstallationScalarWhereWithAggregatesInput = {
    AND?: GithubInstallationScalarWhereWithAggregatesInput | GithubInstallationScalarWhereWithAggregatesInput[]
    OR?: GithubInstallationScalarWhereWithAggregatesInput[]
    NOT?: GithubInstallationScalarWhereWithAggregatesInput | GithubInstallationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GithubInstallation"> | string
    githubInstallationId?: IntWithAggregatesFilter<"GithubInstallation"> | number
    accountLogin?: StringWithAggregatesFilter<"GithubInstallation"> | string
    accountType?: StringWithAggregatesFilter<"GithubInstallation"> | string
    encryptedCredentialsRef?: StringNullableWithAggregatesFilter<"GithubInstallation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"GithubInstallation"> | Date | string
  }

  export type RepositoryWhereInput = {
    AND?: RepositoryWhereInput | RepositoryWhereInput[]
    OR?: RepositoryWhereInput[]
    NOT?: RepositoryWhereInput | RepositoryWhereInput[]
    id?: StringFilter<"Repository"> | string
    githubRepositoryId?: IntFilter<"Repository"> | number
    installationId?: StringFilter<"Repository"> | string
    owner?: StringFilter<"Repository"> | string
    name?: StringFilter<"Repository"> | string
    defaultBranch?: StringFilter<"Repository"> | string
    isEnabled?: BoolFilter<"Repository"> | boolean
    reviewConfig?: JsonFilter<"Repository">
    createdAt?: DateTimeFilter<"Repository"> | Date | string
    updatedAt?: DateTimeFilter<"Repository"> | Date | string
    installation?: XOR<GithubInstallationRelationFilter, GithubInstallationWhereInput>
    pullRequests?: PullRequestListRelationFilter
    reviewJobs?: ReviewJobListRelationFilter
  }

  export type RepositoryOrderByWithRelationInput = {
    id?: SortOrder
    githubRepositoryId?: SortOrder
    installationId?: SortOrder
    owner?: SortOrder
    name?: SortOrder
    defaultBranch?: SortOrder
    isEnabled?: SortOrder
    reviewConfig?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    installation?: GithubInstallationOrderByWithRelationInput
    pullRequests?: PullRequestOrderByRelationAggregateInput
    reviewJobs?: ReviewJobOrderByRelationAggregateInput
  }

  export type RepositoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    githubRepositoryId?: number
    AND?: RepositoryWhereInput | RepositoryWhereInput[]
    OR?: RepositoryWhereInput[]
    NOT?: RepositoryWhereInput | RepositoryWhereInput[]
    installationId?: StringFilter<"Repository"> | string
    owner?: StringFilter<"Repository"> | string
    name?: StringFilter<"Repository"> | string
    defaultBranch?: StringFilter<"Repository"> | string
    isEnabled?: BoolFilter<"Repository"> | boolean
    reviewConfig?: JsonFilter<"Repository">
    createdAt?: DateTimeFilter<"Repository"> | Date | string
    updatedAt?: DateTimeFilter<"Repository"> | Date | string
    installation?: XOR<GithubInstallationRelationFilter, GithubInstallationWhereInput>
    pullRequests?: PullRequestListRelationFilter
    reviewJobs?: ReviewJobListRelationFilter
  }, "id" | "githubRepositoryId">

  export type RepositoryOrderByWithAggregationInput = {
    id?: SortOrder
    githubRepositoryId?: SortOrder
    installationId?: SortOrder
    owner?: SortOrder
    name?: SortOrder
    defaultBranch?: SortOrder
    isEnabled?: SortOrder
    reviewConfig?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RepositoryCountOrderByAggregateInput
    _avg?: RepositoryAvgOrderByAggregateInput
    _max?: RepositoryMaxOrderByAggregateInput
    _min?: RepositoryMinOrderByAggregateInput
    _sum?: RepositorySumOrderByAggregateInput
  }

  export type RepositoryScalarWhereWithAggregatesInput = {
    AND?: RepositoryScalarWhereWithAggregatesInput | RepositoryScalarWhereWithAggregatesInput[]
    OR?: RepositoryScalarWhereWithAggregatesInput[]
    NOT?: RepositoryScalarWhereWithAggregatesInput | RepositoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Repository"> | string
    githubRepositoryId?: IntWithAggregatesFilter<"Repository"> | number
    installationId?: StringWithAggregatesFilter<"Repository"> | string
    owner?: StringWithAggregatesFilter<"Repository"> | string
    name?: StringWithAggregatesFilter<"Repository"> | string
    defaultBranch?: StringWithAggregatesFilter<"Repository"> | string
    isEnabled?: BoolWithAggregatesFilter<"Repository"> | boolean
    reviewConfig?: JsonWithAggregatesFilter<"Repository">
    createdAt?: DateTimeWithAggregatesFilter<"Repository"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Repository"> | Date | string
  }

  export type PullRequestWhereInput = {
    AND?: PullRequestWhereInput | PullRequestWhereInput[]
    OR?: PullRequestWhereInput[]
    NOT?: PullRequestWhereInput | PullRequestWhereInput[]
    id?: StringFilter<"PullRequest"> | string
    repositoryId?: StringFilter<"PullRequest"> | string
    githubPrNumber?: IntFilter<"PullRequest"> | number
    title?: StringFilter<"PullRequest"> | string
    author?: StringFilter<"PullRequest"> | string
    baseSha?: StringFilter<"PullRequest"> | string
    headSha?: StringFilter<"PullRequest"> | string
    state?: StringFilter<"PullRequest"> | string
    updatedAt?: DateTimeFilter<"PullRequest"> | Date | string
    repository?: XOR<RepositoryRelationFilter, RepositoryWhereInput>
    reviewJobs?: ReviewJobListRelationFilter
  }

  export type PullRequestOrderByWithRelationInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    githubPrNumber?: SortOrder
    title?: SortOrder
    author?: SortOrder
    baseSha?: SortOrder
    headSha?: SortOrder
    state?: SortOrder
    updatedAt?: SortOrder
    repository?: RepositoryOrderByWithRelationInput
    reviewJobs?: ReviewJobOrderByRelationAggregateInput
  }

  export type PullRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    repositoryId_githubPrNumber?: PullRequestRepositoryIdGithubPrNumberCompoundUniqueInput
    AND?: PullRequestWhereInput | PullRequestWhereInput[]
    OR?: PullRequestWhereInput[]
    NOT?: PullRequestWhereInput | PullRequestWhereInput[]
    repositoryId?: StringFilter<"PullRequest"> | string
    githubPrNumber?: IntFilter<"PullRequest"> | number
    title?: StringFilter<"PullRequest"> | string
    author?: StringFilter<"PullRequest"> | string
    baseSha?: StringFilter<"PullRequest"> | string
    headSha?: StringFilter<"PullRequest"> | string
    state?: StringFilter<"PullRequest"> | string
    updatedAt?: DateTimeFilter<"PullRequest"> | Date | string
    repository?: XOR<RepositoryRelationFilter, RepositoryWhereInput>
    reviewJobs?: ReviewJobListRelationFilter
  }, "id" | "repositoryId_githubPrNumber">

  export type PullRequestOrderByWithAggregationInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    githubPrNumber?: SortOrder
    title?: SortOrder
    author?: SortOrder
    baseSha?: SortOrder
    headSha?: SortOrder
    state?: SortOrder
    updatedAt?: SortOrder
    _count?: PullRequestCountOrderByAggregateInput
    _avg?: PullRequestAvgOrderByAggregateInput
    _max?: PullRequestMaxOrderByAggregateInput
    _min?: PullRequestMinOrderByAggregateInput
    _sum?: PullRequestSumOrderByAggregateInput
  }

  export type PullRequestScalarWhereWithAggregatesInput = {
    AND?: PullRequestScalarWhereWithAggregatesInput | PullRequestScalarWhereWithAggregatesInput[]
    OR?: PullRequestScalarWhereWithAggregatesInput[]
    NOT?: PullRequestScalarWhereWithAggregatesInput | PullRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PullRequest"> | string
    repositoryId?: StringWithAggregatesFilter<"PullRequest"> | string
    githubPrNumber?: IntWithAggregatesFilter<"PullRequest"> | number
    title?: StringWithAggregatesFilter<"PullRequest"> | string
    author?: StringWithAggregatesFilter<"PullRequest"> | string
    baseSha?: StringWithAggregatesFilter<"PullRequest"> | string
    headSha?: StringWithAggregatesFilter<"PullRequest"> | string
    state?: StringWithAggregatesFilter<"PullRequest"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"PullRequest"> | Date | string
  }

  export type WebhookDeliveryWhereInput = {
    AND?: WebhookDeliveryWhereInput | WebhookDeliveryWhereInput[]
    OR?: WebhookDeliveryWhereInput[]
    NOT?: WebhookDeliveryWhereInput | WebhookDeliveryWhereInput[]
    id?: StringFilter<"WebhookDelivery"> | string
    githubDeliveryId?: StringFilter<"WebhookDelivery"> | string
    eventType?: StringFilter<"WebhookDelivery"> | string
    repositoryId?: StringNullableFilter<"WebhookDelivery"> | string | null
    receivedAt?: DateTimeFilter<"WebhookDelivery"> | Date | string
    processingStatus?: StringFilter<"WebhookDelivery"> | string
  }

  export type WebhookDeliveryOrderByWithRelationInput = {
    id?: SortOrder
    githubDeliveryId?: SortOrder
    eventType?: SortOrder
    repositoryId?: SortOrderInput | SortOrder
    receivedAt?: SortOrder
    processingStatus?: SortOrder
  }

  export type WebhookDeliveryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    githubDeliveryId?: string
    AND?: WebhookDeliveryWhereInput | WebhookDeliveryWhereInput[]
    OR?: WebhookDeliveryWhereInput[]
    NOT?: WebhookDeliveryWhereInput | WebhookDeliveryWhereInput[]
    eventType?: StringFilter<"WebhookDelivery"> | string
    repositoryId?: StringNullableFilter<"WebhookDelivery"> | string | null
    receivedAt?: DateTimeFilter<"WebhookDelivery"> | Date | string
    processingStatus?: StringFilter<"WebhookDelivery"> | string
  }, "id" | "githubDeliveryId">

  export type WebhookDeliveryOrderByWithAggregationInput = {
    id?: SortOrder
    githubDeliveryId?: SortOrder
    eventType?: SortOrder
    repositoryId?: SortOrderInput | SortOrder
    receivedAt?: SortOrder
    processingStatus?: SortOrder
    _count?: WebhookDeliveryCountOrderByAggregateInput
    _max?: WebhookDeliveryMaxOrderByAggregateInput
    _min?: WebhookDeliveryMinOrderByAggregateInput
  }

  export type WebhookDeliveryScalarWhereWithAggregatesInput = {
    AND?: WebhookDeliveryScalarWhereWithAggregatesInput | WebhookDeliveryScalarWhereWithAggregatesInput[]
    OR?: WebhookDeliveryScalarWhereWithAggregatesInput[]
    NOT?: WebhookDeliveryScalarWhereWithAggregatesInput | WebhookDeliveryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WebhookDelivery"> | string
    githubDeliveryId?: StringWithAggregatesFilter<"WebhookDelivery"> | string
    eventType?: StringWithAggregatesFilter<"WebhookDelivery"> | string
    repositoryId?: StringNullableWithAggregatesFilter<"WebhookDelivery"> | string | null
    receivedAt?: DateTimeWithAggregatesFilter<"WebhookDelivery"> | Date | string
    processingStatus?: StringWithAggregatesFilter<"WebhookDelivery"> | string
  }

  export type ReviewJobWhereInput = {
    AND?: ReviewJobWhereInput | ReviewJobWhereInput[]
    OR?: ReviewJobWhereInput[]
    NOT?: ReviewJobWhereInput | ReviewJobWhereInput[]
    id?: StringFilter<"ReviewJob"> | string
    repositoryId?: StringFilter<"ReviewJob"> | string
    pullRequestId?: StringFilter<"ReviewJob"> | string
    headSha?: StringFilter<"ReviewJob"> | string
    idempotencyKey?: StringFilter<"ReviewJob"> | string
    status?: StringFilter<"ReviewJob"> | string
    configVersion?: IntFilter<"ReviewJob"> | number
    startedAt?: DateTimeNullableFilter<"ReviewJob"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ReviewJob"> | Date | string | null
    errorCode?: StringNullableFilter<"ReviewJob"> | string | null
    errorMessage?: StringNullableFilter<"ReviewJob"> | string | null
    createdAt?: DateTimeFilter<"ReviewJob"> | Date | string
    repository?: XOR<RepositoryRelationFilter, RepositoryWhereInput>
    pullRequest?: XOR<PullRequestRelationFilter, PullRequestWhereInput>
    agentRuns?: AgentRunListRelationFilter
    findings?: FindingListRelationFilter
  }

  export type ReviewJobOrderByWithRelationInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    pullRequestId?: SortOrder
    headSha?: SortOrder
    idempotencyKey?: SortOrder
    status?: SortOrder
    configVersion?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    errorCode?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    repository?: RepositoryOrderByWithRelationInput
    pullRequest?: PullRequestOrderByWithRelationInput
    agentRuns?: AgentRunOrderByRelationAggregateInput
    findings?: FindingOrderByRelationAggregateInput
  }

  export type ReviewJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    idempotencyKey?: string
    AND?: ReviewJobWhereInput | ReviewJobWhereInput[]
    OR?: ReviewJobWhereInput[]
    NOT?: ReviewJobWhereInput | ReviewJobWhereInput[]
    repositoryId?: StringFilter<"ReviewJob"> | string
    pullRequestId?: StringFilter<"ReviewJob"> | string
    headSha?: StringFilter<"ReviewJob"> | string
    status?: StringFilter<"ReviewJob"> | string
    configVersion?: IntFilter<"ReviewJob"> | number
    startedAt?: DateTimeNullableFilter<"ReviewJob"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ReviewJob"> | Date | string | null
    errorCode?: StringNullableFilter<"ReviewJob"> | string | null
    errorMessage?: StringNullableFilter<"ReviewJob"> | string | null
    createdAt?: DateTimeFilter<"ReviewJob"> | Date | string
    repository?: XOR<RepositoryRelationFilter, RepositoryWhereInput>
    pullRequest?: XOR<PullRequestRelationFilter, PullRequestWhereInput>
    agentRuns?: AgentRunListRelationFilter
    findings?: FindingListRelationFilter
  }, "id" | "idempotencyKey">

  export type ReviewJobOrderByWithAggregationInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    pullRequestId?: SortOrder
    headSha?: SortOrder
    idempotencyKey?: SortOrder
    status?: SortOrder
    configVersion?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    errorCode?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ReviewJobCountOrderByAggregateInput
    _avg?: ReviewJobAvgOrderByAggregateInput
    _max?: ReviewJobMaxOrderByAggregateInput
    _min?: ReviewJobMinOrderByAggregateInput
    _sum?: ReviewJobSumOrderByAggregateInput
  }

  export type ReviewJobScalarWhereWithAggregatesInput = {
    AND?: ReviewJobScalarWhereWithAggregatesInput | ReviewJobScalarWhereWithAggregatesInput[]
    OR?: ReviewJobScalarWhereWithAggregatesInput[]
    NOT?: ReviewJobScalarWhereWithAggregatesInput | ReviewJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReviewJob"> | string
    repositoryId?: StringWithAggregatesFilter<"ReviewJob"> | string
    pullRequestId?: StringWithAggregatesFilter<"ReviewJob"> | string
    headSha?: StringWithAggregatesFilter<"ReviewJob"> | string
    idempotencyKey?: StringWithAggregatesFilter<"ReviewJob"> | string
    status?: StringWithAggregatesFilter<"ReviewJob"> | string
    configVersion?: IntWithAggregatesFilter<"ReviewJob"> | number
    startedAt?: DateTimeNullableWithAggregatesFilter<"ReviewJob"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"ReviewJob"> | Date | string | null
    errorCode?: StringNullableWithAggregatesFilter<"ReviewJob"> | string | null
    errorMessage?: StringNullableWithAggregatesFilter<"ReviewJob"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ReviewJob"> | Date | string
  }

  export type AgentRunWhereInput = {
    AND?: AgentRunWhereInput | AgentRunWhereInput[]
    OR?: AgentRunWhereInput[]
    NOT?: AgentRunWhereInput | AgentRunWhereInput[]
    id?: StringFilter<"AgentRun"> | string
    reviewJobId?: StringFilter<"AgentRun"> | string
    agentType?: StringFilter<"AgentRun"> | string
    status?: StringFilter<"AgentRun"> | string
    modelProvider?: StringNullableFilter<"AgentRun"> | string | null
    modelName?: StringNullableFilter<"AgentRun"> | string | null
    inputTokens?: IntNullableFilter<"AgentRun"> | number | null
    outputTokens?: IntNullableFilter<"AgentRun"> | number | null
    durationMs?: IntNullableFilter<"AgentRun"> | number | null
    outputJson?: JsonNullableFilter<"AgentRun">
    errorMessage?: StringNullableFilter<"AgentRun"> | string | null
    createdAt?: DateTimeFilter<"AgentRun"> | Date | string
    reviewJob?: XOR<ReviewJobRelationFilter, ReviewJobWhereInput>
    findings?: FindingListRelationFilter
  }

  export type AgentRunOrderByWithRelationInput = {
    id?: SortOrder
    reviewJobId?: SortOrder
    agentType?: SortOrder
    status?: SortOrder
    modelProvider?: SortOrderInput | SortOrder
    modelName?: SortOrderInput | SortOrder
    inputTokens?: SortOrderInput | SortOrder
    outputTokens?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    outputJson?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    reviewJob?: ReviewJobOrderByWithRelationInput
    findings?: FindingOrderByRelationAggregateInput
  }

  export type AgentRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AgentRunWhereInput | AgentRunWhereInput[]
    OR?: AgentRunWhereInput[]
    NOT?: AgentRunWhereInput | AgentRunWhereInput[]
    reviewJobId?: StringFilter<"AgentRun"> | string
    agentType?: StringFilter<"AgentRun"> | string
    status?: StringFilter<"AgentRun"> | string
    modelProvider?: StringNullableFilter<"AgentRun"> | string | null
    modelName?: StringNullableFilter<"AgentRun"> | string | null
    inputTokens?: IntNullableFilter<"AgentRun"> | number | null
    outputTokens?: IntNullableFilter<"AgentRun"> | number | null
    durationMs?: IntNullableFilter<"AgentRun"> | number | null
    outputJson?: JsonNullableFilter<"AgentRun">
    errorMessage?: StringNullableFilter<"AgentRun"> | string | null
    createdAt?: DateTimeFilter<"AgentRun"> | Date | string
    reviewJob?: XOR<ReviewJobRelationFilter, ReviewJobWhereInput>
    findings?: FindingListRelationFilter
  }, "id">

  export type AgentRunOrderByWithAggregationInput = {
    id?: SortOrder
    reviewJobId?: SortOrder
    agentType?: SortOrder
    status?: SortOrder
    modelProvider?: SortOrderInput | SortOrder
    modelName?: SortOrderInput | SortOrder
    inputTokens?: SortOrderInput | SortOrder
    outputTokens?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    outputJson?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AgentRunCountOrderByAggregateInput
    _avg?: AgentRunAvgOrderByAggregateInput
    _max?: AgentRunMaxOrderByAggregateInput
    _min?: AgentRunMinOrderByAggregateInput
    _sum?: AgentRunSumOrderByAggregateInput
  }

  export type AgentRunScalarWhereWithAggregatesInput = {
    AND?: AgentRunScalarWhereWithAggregatesInput | AgentRunScalarWhereWithAggregatesInput[]
    OR?: AgentRunScalarWhereWithAggregatesInput[]
    NOT?: AgentRunScalarWhereWithAggregatesInput | AgentRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentRun"> | string
    reviewJobId?: StringWithAggregatesFilter<"AgentRun"> | string
    agentType?: StringWithAggregatesFilter<"AgentRun"> | string
    status?: StringWithAggregatesFilter<"AgentRun"> | string
    modelProvider?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    modelName?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    inputTokens?: IntNullableWithAggregatesFilter<"AgentRun"> | number | null
    outputTokens?: IntNullableWithAggregatesFilter<"AgentRun"> | number | null
    durationMs?: IntNullableWithAggregatesFilter<"AgentRun"> | number | null
    outputJson?: JsonNullableWithAggregatesFilter<"AgentRun">
    errorMessage?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AgentRun"> | Date | string
  }

  export type FindingWhereInput = {
    AND?: FindingWhereInput | FindingWhereInput[]
    OR?: FindingWhereInput[]
    NOT?: FindingWhereInput | FindingWhereInput[]
    id?: StringFilter<"Finding"> | string
    reviewJobId?: StringFilter<"Finding"> | string
    agentRunId?: StringNullableFilter<"Finding"> | string | null
    fingerprint?: StringFilter<"Finding"> | string
    title?: StringFilter<"Finding"> | string
    category?: StringFilter<"Finding"> | string
    severity?: StringFilter<"Finding"> | string
    confidence?: FloatFilter<"Finding"> | number
    filePath?: StringFilter<"Finding"> | string
    line?: IntFilter<"Finding"> | number
    endLine?: IntNullableFilter<"Finding"> | number | null
    description?: StringFilter<"Finding"> | string
    evidence?: StringFilter<"Finding"> | string
    recommendation?: StringNullableFilter<"Finding"> | string | null
    verificationStatus?: StringFilter<"Finding"> | string
    publicationStatus?: StringFilter<"Finding"> | string
    githubCommentId?: StringNullableFilter<"Finding"> | string | null
    createdAt?: DateTimeFilter<"Finding"> | Date | string
    reviewJob?: XOR<ReviewJobRelationFilter, ReviewJobWhereInput>
    agentRun?: XOR<AgentRunNullableRelationFilter, AgentRunWhereInput> | null
    feedbacks?: FindingFeedbackListRelationFilter
  }

  export type FindingOrderByWithRelationInput = {
    id?: SortOrder
    reviewJobId?: SortOrder
    agentRunId?: SortOrderInput | SortOrder
    fingerprint?: SortOrder
    title?: SortOrder
    category?: SortOrder
    severity?: SortOrder
    confidence?: SortOrder
    filePath?: SortOrder
    line?: SortOrder
    endLine?: SortOrderInput | SortOrder
    description?: SortOrder
    evidence?: SortOrder
    recommendation?: SortOrderInput | SortOrder
    verificationStatus?: SortOrder
    publicationStatus?: SortOrder
    githubCommentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    reviewJob?: ReviewJobOrderByWithRelationInput
    agentRun?: AgentRunOrderByWithRelationInput
    feedbacks?: FindingFeedbackOrderByRelationAggregateInput
  }

  export type FindingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FindingWhereInput | FindingWhereInput[]
    OR?: FindingWhereInput[]
    NOT?: FindingWhereInput | FindingWhereInput[]
    reviewJobId?: StringFilter<"Finding"> | string
    agentRunId?: StringNullableFilter<"Finding"> | string | null
    fingerprint?: StringFilter<"Finding"> | string
    title?: StringFilter<"Finding"> | string
    category?: StringFilter<"Finding"> | string
    severity?: StringFilter<"Finding"> | string
    confidence?: FloatFilter<"Finding"> | number
    filePath?: StringFilter<"Finding"> | string
    line?: IntFilter<"Finding"> | number
    endLine?: IntNullableFilter<"Finding"> | number | null
    description?: StringFilter<"Finding"> | string
    evidence?: StringFilter<"Finding"> | string
    recommendation?: StringNullableFilter<"Finding"> | string | null
    verificationStatus?: StringFilter<"Finding"> | string
    publicationStatus?: StringFilter<"Finding"> | string
    githubCommentId?: StringNullableFilter<"Finding"> | string | null
    createdAt?: DateTimeFilter<"Finding"> | Date | string
    reviewJob?: XOR<ReviewJobRelationFilter, ReviewJobWhereInput>
    agentRun?: XOR<AgentRunNullableRelationFilter, AgentRunWhereInput> | null
    feedbacks?: FindingFeedbackListRelationFilter
  }, "id">

  export type FindingOrderByWithAggregationInput = {
    id?: SortOrder
    reviewJobId?: SortOrder
    agentRunId?: SortOrderInput | SortOrder
    fingerprint?: SortOrder
    title?: SortOrder
    category?: SortOrder
    severity?: SortOrder
    confidence?: SortOrder
    filePath?: SortOrder
    line?: SortOrder
    endLine?: SortOrderInput | SortOrder
    description?: SortOrder
    evidence?: SortOrder
    recommendation?: SortOrderInput | SortOrder
    verificationStatus?: SortOrder
    publicationStatus?: SortOrder
    githubCommentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: FindingCountOrderByAggregateInput
    _avg?: FindingAvgOrderByAggregateInput
    _max?: FindingMaxOrderByAggregateInput
    _min?: FindingMinOrderByAggregateInput
    _sum?: FindingSumOrderByAggregateInput
  }

  export type FindingScalarWhereWithAggregatesInput = {
    AND?: FindingScalarWhereWithAggregatesInput | FindingScalarWhereWithAggregatesInput[]
    OR?: FindingScalarWhereWithAggregatesInput[]
    NOT?: FindingScalarWhereWithAggregatesInput | FindingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Finding"> | string
    reviewJobId?: StringWithAggregatesFilter<"Finding"> | string
    agentRunId?: StringNullableWithAggregatesFilter<"Finding"> | string | null
    fingerprint?: StringWithAggregatesFilter<"Finding"> | string
    title?: StringWithAggregatesFilter<"Finding"> | string
    category?: StringWithAggregatesFilter<"Finding"> | string
    severity?: StringWithAggregatesFilter<"Finding"> | string
    confidence?: FloatWithAggregatesFilter<"Finding"> | number
    filePath?: StringWithAggregatesFilter<"Finding"> | string
    line?: IntWithAggregatesFilter<"Finding"> | number
    endLine?: IntNullableWithAggregatesFilter<"Finding"> | number | null
    description?: StringWithAggregatesFilter<"Finding"> | string
    evidence?: StringWithAggregatesFilter<"Finding"> | string
    recommendation?: StringNullableWithAggregatesFilter<"Finding"> | string | null
    verificationStatus?: StringWithAggregatesFilter<"Finding"> | string
    publicationStatus?: StringWithAggregatesFilter<"Finding"> | string
    githubCommentId?: StringNullableWithAggregatesFilter<"Finding"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Finding"> | Date | string
  }

  export type FindingFeedbackWhereInput = {
    AND?: FindingFeedbackWhereInput | FindingFeedbackWhereInput[]
    OR?: FindingFeedbackWhereInput[]
    NOT?: FindingFeedbackWhereInput | FindingFeedbackWhereInput[]
    id?: StringFilter<"FindingFeedback"> | string
    findingId?: StringFilter<"FindingFeedback"> | string
    userId?: StringFilter<"FindingFeedback"> | string
    feedbackType?: StringFilter<"FindingFeedback"> | string
    comment?: StringNullableFilter<"FindingFeedback"> | string | null
    createdAt?: DateTimeFilter<"FindingFeedback"> | Date | string
    finding?: XOR<FindingRelationFilter, FindingWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type FindingFeedbackOrderByWithRelationInput = {
    id?: SortOrder
    findingId?: SortOrder
    userId?: SortOrder
    feedbackType?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    finding?: FindingOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type FindingFeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FindingFeedbackWhereInput | FindingFeedbackWhereInput[]
    OR?: FindingFeedbackWhereInput[]
    NOT?: FindingFeedbackWhereInput | FindingFeedbackWhereInput[]
    findingId?: StringFilter<"FindingFeedback"> | string
    userId?: StringFilter<"FindingFeedback"> | string
    feedbackType?: StringFilter<"FindingFeedback"> | string
    comment?: StringNullableFilter<"FindingFeedback"> | string | null
    createdAt?: DateTimeFilter<"FindingFeedback"> | Date | string
    finding?: XOR<FindingRelationFilter, FindingWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type FindingFeedbackOrderByWithAggregationInput = {
    id?: SortOrder
    findingId?: SortOrder
    userId?: SortOrder
    feedbackType?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: FindingFeedbackCountOrderByAggregateInput
    _max?: FindingFeedbackMaxOrderByAggregateInput
    _min?: FindingFeedbackMinOrderByAggregateInput
  }

  export type FindingFeedbackScalarWhereWithAggregatesInput = {
    AND?: FindingFeedbackScalarWhereWithAggregatesInput | FindingFeedbackScalarWhereWithAggregatesInput[]
    OR?: FindingFeedbackScalarWhereWithAggregatesInput[]
    NOT?: FindingFeedbackScalarWhereWithAggregatesInput | FindingFeedbackScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FindingFeedback"> | string
    findingId?: StringWithAggregatesFilter<"FindingFeedback"> | string
    userId?: StringWithAggregatesFilter<"FindingFeedback"> | string
    feedbackType?: StringWithAggregatesFilter<"FindingFeedback"> | string
    comment?: StringNullableWithAggregatesFilter<"FindingFeedback"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FindingFeedback"> | Date | string
  }

  export type FixProposalWhereInput = {
    AND?: FixProposalWhereInput | FixProposalWhereInput[]
    OR?: FixProposalWhereInput[]
    NOT?: FixProposalWhereInput | FixProposalWhereInput[]
    id?: StringFilter<"FixProposal"> | string
    findingId?: StringFilter<"FixProposal"> | string
    patch?: StringFilter<"FixProposal"> | string
    sandboxStatus?: StringFilter<"FixProposal"> | string
    testResults?: JsonNullableFilter<"FixProposal">
    approvalStatus?: StringFilter<"FixProposal"> | string
    createdAt?: DateTimeFilter<"FixProposal"> | Date | string
  }

  export type FixProposalOrderByWithRelationInput = {
    id?: SortOrder
    findingId?: SortOrder
    patch?: SortOrder
    sandboxStatus?: SortOrder
    testResults?: SortOrderInput | SortOrder
    approvalStatus?: SortOrder
    createdAt?: SortOrder
  }

  export type FixProposalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FixProposalWhereInput | FixProposalWhereInput[]
    OR?: FixProposalWhereInput[]
    NOT?: FixProposalWhereInput | FixProposalWhereInput[]
    findingId?: StringFilter<"FixProposal"> | string
    patch?: StringFilter<"FixProposal"> | string
    sandboxStatus?: StringFilter<"FixProposal"> | string
    testResults?: JsonNullableFilter<"FixProposal">
    approvalStatus?: StringFilter<"FixProposal"> | string
    createdAt?: DateTimeFilter<"FixProposal"> | Date | string
  }, "id">

  export type FixProposalOrderByWithAggregationInput = {
    id?: SortOrder
    findingId?: SortOrder
    patch?: SortOrder
    sandboxStatus?: SortOrder
    testResults?: SortOrderInput | SortOrder
    approvalStatus?: SortOrder
    createdAt?: SortOrder
    _count?: FixProposalCountOrderByAggregateInput
    _max?: FixProposalMaxOrderByAggregateInput
    _min?: FixProposalMinOrderByAggregateInput
  }

  export type FixProposalScalarWhereWithAggregatesInput = {
    AND?: FixProposalScalarWhereWithAggregatesInput | FixProposalScalarWhereWithAggregatesInput[]
    OR?: FixProposalScalarWhereWithAggregatesInput[]
    NOT?: FixProposalScalarWhereWithAggregatesInput | FixProposalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FixProposal"> | string
    findingId?: StringWithAggregatesFilter<"FixProposal"> | string
    patch?: StringWithAggregatesFilter<"FixProposal"> | string
    sandboxStatus?: StringWithAggregatesFilter<"FixProposal"> | string
    testResults?: JsonNullableWithAggregatesFilter<"FixProposal">
    approvalStatus?: StringWithAggregatesFilter<"FixProposal"> | string
    createdAt?: DateTimeWithAggregatesFilter<"FixProposal"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    displayName: string
    createdAt?: Date | string
    updatedAt?: Date | string
    feedbacks?: FindingFeedbackCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    displayName: string
    createdAt?: Date | string
    updatedAt?: Date | string
    feedbacks?: FindingFeedbackUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedbacks?: FindingFeedbackUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedbacks?: FindingFeedbackUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    displayName: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GithubInstallationCreateInput = {
    id?: string
    githubInstallationId: number
    accountLogin: string
    accountType: string
    encryptedCredentialsRef?: string | null
    createdAt?: Date | string
    repositories?: RepositoryCreateNestedManyWithoutInstallationInput
  }

  export type GithubInstallationUncheckedCreateInput = {
    id?: string
    githubInstallationId: number
    accountLogin: string
    accountType: string
    encryptedCredentialsRef?: string | null
    createdAt?: Date | string
    repositories?: RepositoryUncheckedCreateNestedManyWithoutInstallationInput
  }

  export type GithubInstallationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubInstallationId?: IntFieldUpdateOperationsInput | number
    accountLogin?: StringFieldUpdateOperationsInput | string
    accountType?: StringFieldUpdateOperationsInput | string
    encryptedCredentialsRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repositories?: RepositoryUpdateManyWithoutInstallationNestedInput
  }

  export type GithubInstallationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubInstallationId?: IntFieldUpdateOperationsInput | number
    accountLogin?: StringFieldUpdateOperationsInput | string
    accountType?: StringFieldUpdateOperationsInput | string
    encryptedCredentialsRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repositories?: RepositoryUncheckedUpdateManyWithoutInstallationNestedInput
  }

  export type GithubInstallationCreateManyInput = {
    id?: string
    githubInstallationId: number
    accountLogin: string
    accountType: string
    encryptedCredentialsRef?: string | null
    createdAt?: Date | string
  }

  export type GithubInstallationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubInstallationId?: IntFieldUpdateOperationsInput | number
    accountLogin?: StringFieldUpdateOperationsInput | string
    accountType?: StringFieldUpdateOperationsInput | string
    encryptedCredentialsRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GithubInstallationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubInstallationId?: IntFieldUpdateOperationsInput | number
    accountLogin?: StringFieldUpdateOperationsInput | string
    accountType?: StringFieldUpdateOperationsInput | string
    encryptedCredentialsRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepositoryCreateInput = {
    id?: string
    githubRepositoryId: number
    owner: string
    name: string
    defaultBranch?: string
    isEnabled?: boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    installation: GithubInstallationCreateNestedOneWithoutRepositoriesInput
    pullRequests?: PullRequestCreateNestedManyWithoutRepositoryInput
    reviewJobs?: ReviewJobCreateNestedManyWithoutRepositoryInput
  }

  export type RepositoryUncheckedCreateInput = {
    id?: string
    githubRepositoryId: number
    installationId: string
    owner: string
    name: string
    defaultBranch?: string
    isEnabled?: boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    pullRequests?: PullRequestUncheckedCreateNestedManyWithoutRepositoryInput
    reviewJobs?: ReviewJobUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type RepositoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    installation?: GithubInstallationUpdateOneRequiredWithoutRepositoriesNestedInput
    pullRequests?: PullRequestUpdateManyWithoutRepositoryNestedInput
    reviewJobs?: ReviewJobUpdateManyWithoutRepositoryNestedInput
  }

  export type RepositoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    installationId?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pullRequests?: PullRequestUncheckedUpdateManyWithoutRepositoryNestedInput
    reviewJobs?: ReviewJobUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type RepositoryCreateManyInput = {
    id?: string
    githubRepositoryId: number
    installationId: string
    owner: string
    name: string
    defaultBranch?: string
    isEnabled?: boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RepositoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepositoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    installationId?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PullRequestCreateInput = {
    id?: string
    githubPrNumber: number
    title: string
    author: string
    baseSha: string
    headSha: string
    state?: string
    updatedAt?: Date | string
    repository: RepositoryCreateNestedOneWithoutPullRequestsInput
    reviewJobs?: ReviewJobCreateNestedManyWithoutPullRequestInput
  }

  export type PullRequestUncheckedCreateInput = {
    id?: string
    repositoryId: string
    githubPrNumber: number
    title: string
    author: string
    baseSha: string
    headSha: string
    state?: string
    updatedAt?: Date | string
    reviewJobs?: ReviewJobUncheckedCreateNestedManyWithoutPullRequestInput
  }

  export type PullRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubPrNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    baseSha?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repository?: RepositoryUpdateOneRequiredWithoutPullRequestsNestedInput
    reviewJobs?: ReviewJobUpdateManyWithoutPullRequestNestedInput
  }

  export type PullRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    githubPrNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    baseSha?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewJobs?: ReviewJobUncheckedUpdateManyWithoutPullRequestNestedInput
  }

  export type PullRequestCreateManyInput = {
    id?: string
    repositoryId: string
    githubPrNumber: number
    title: string
    author: string
    baseSha: string
    headSha: string
    state?: string
    updatedAt?: Date | string
  }

  export type PullRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubPrNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    baseSha?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PullRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    githubPrNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    baseSha?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookDeliveryCreateInput = {
    id?: string
    githubDeliveryId: string
    eventType: string
    repositoryId?: string | null
    receivedAt?: Date | string
    processingStatus?: string
  }

  export type WebhookDeliveryUncheckedCreateInput = {
    id?: string
    githubDeliveryId: string
    eventType: string
    repositoryId?: string | null
    receivedAt?: Date | string
    processingStatus?: string
  }

  export type WebhookDeliveryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubDeliveryId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    repositoryId?: NullableStringFieldUpdateOperationsInput | string | null
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingStatus?: StringFieldUpdateOperationsInput | string
  }

  export type WebhookDeliveryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubDeliveryId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    repositoryId?: NullableStringFieldUpdateOperationsInput | string | null
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingStatus?: StringFieldUpdateOperationsInput | string
  }

  export type WebhookDeliveryCreateManyInput = {
    id?: string
    githubDeliveryId: string
    eventType: string
    repositoryId?: string | null
    receivedAt?: Date | string
    processingStatus?: string
  }

  export type WebhookDeliveryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubDeliveryId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    repositoryId?: NullableStringFieldUpdateOperationsInput | string | null
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingStatus?: StringFieldUpdateOperationsInput | string
  }

  export type WebhookDeliveryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubDeliveryId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    repositoryId?: NullableStringFieldUpdateOperationsInput | string | null
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingStatus?: StringFieldUpdateOperationsInput | string
  }

  export type ReviewJobCreateInput = {
    id?: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    repository: RepositoryCreateNestedOneWithoutReviewJobsInput
    pullRequest: PullRequestCreateNestedOneWithoutReviewJobsInput
    agentRuns?: AgentRunCreateNestedManyWithoutReviewJobInput
    findings?: FindingCreateNestedManyWithoutReviewJobInput
  }

  export type ReviewJobUncheckedCreateInput = {
    id?: string
    repositoryId: string
    pullRequestId: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    agentRuns?: AgentRunUncheckedCreateNestedManyWithoutReviewJobInput
    findings?: FindingUncheckedCreateNestedManyWithoutReviewJobInput
  }

  export type ReviewJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repository?: RepositoryUpdateOneRequiredWithoutReviewJobsNestedInput
    pullRequest?: PullRequestUpdateOneRequiredWithoutReviewJobsNestedInput
    agentRuns?: AgentRunUpdateManyWithoutReviewJobNestedInput
    findings?: FindingUpdateManyWithoutReviewJobNestedInput
  }

  export type ReviewJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    pullRequestId?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentRuns?: AgentRunUncheckedUpdateManyWithoutReviewJobNestedInput
    findings?: FindingUncheckedUpdateManyWithoutReviewJobNestedInput
  }

  export type ReviewJobCreateManyInput = {
    id?: string
    repositoryId: string
    pullRequestId: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type ReviewJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    pullRequestId?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunCreateInput = {
    id?: string
    agentType: string
    status?: string
    modelProvider?: string | null
    modelName?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    durationMs?: number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    createdAt?: Date | string
    reviewJob: ReviewJobCreateNestedOneWithoutAgentRunsInput
    findings?: FindingCreateNestedManyWithoutAgentRunInput
  }

  export type AgentRunUncheckedCreateInput = {
    id?: string
    reviewJobId: string
    agentType: string
    status?: string
    modelProvider?: string | null
    modelName?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    durationMs?: number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    createdAt?: Date | string
    findings?: FindingUncheckedCreateNestedManyWithoutAgentRunInput
  }

  export type AgentRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelProvider?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewJob?: ReviewJobUpdateOneRequiredWithoutAgentRunsNestedInput
    findings?: FindingUpdateManyWithoutAgentRunNestedInput
  }

  export type AgentRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewJobId?: StringFieldUpdateOperationsInput | string
    agentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelProvider?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    findings?: FindingUncheckedUpdateManyWithoutAgentRunNestedInput
  }

  export type AgentRunCreateManyInput = {
    id?: string
    reviewJobId: string
    agentType: string
    status?: string
    modelProvider?: string | null
    modelName?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    durationMs?: number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AgentRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelProvider?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewJobId?: StringFieldUpdateOperationsInput | string
    agentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelProvider?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingCreateInput = {
    id?: string
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
    reviewJob: ReviewJobCreateNestedOneWithoutFindingsInput
    agentRun?: AgentRunCreateNestedOneWithoutFindingsInput
    feedbacks?: FindingFeedbackCreateNestedManyWithoutFindingInput
  }

  export type FindingUncheckedCreateInput = {
    id?: string
    reviewJobId: string
    agentRunId?: string | null
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
    feedbacks?: FindingFeedbackUncheckedCreateNestedManyWithoutFindingInput
  }

  export type FindingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewJob?: ReviewJobUpdateOneRequiredWithoutFindingsNestedInput
    agentRun?: AgentRunUpdateOneWithoutFindingsNestedInput
    feedbacks?: FindingFeedbackUpdateManyWithoutFindingNestedInput
  }

  export type FindingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewJobId?: StringFieldUpdateOperationsInput | string
    agentRunId?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedbacks?: FindingFeedbackUncheckedUpdateManyWithoutFindingNestedInput
  }

  export type FindingCreateManyInput = {
    id?: string
    reviewJobId: string
    agentRunId?: string | null
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
  }

  export type FindingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewJobId?: StringFieldUpdateOperationsInput | string
    agentRunId?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingFeedbackCreateInput = {
    id?: string
    feedbackType: string
    comment?: string | null
    createdAt?: Date | string
    finding: FindingCreateNestedOneWithoutFeedbacksInput
    user: UserCreateNestedOneWithoutFeedbacksInput
  }

  export type FindingFeedbackUncheckedCreateInput = {
    id?: string
    findingId: string
    userId: string
    feedbackType: string
    comment?: string | null
    createdAt?: Date | string
  }

  export type FindingFeedbackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    feedbackType?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finding?: FindingUpdateOneRequiredWithoutFeedbacksNestedInput
    user?: UserUpdateOneRequiredWithoutFeedbacksNestedInput
  }

  export type FindingFeedbackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    findingId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    feedbackType?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingFeedbackCreateManyInput = {
    id?: string
    findingId: string
    userId: string
    feedbackType: string
    comment?: string | null
    createdAt?: Date | string
  }

  export type FindingFeedbackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    feedbackType?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingFeedbackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    findingId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    feedbackType?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FixProposalCreateInput = {
    id?: string
    findingId: string
    patch: string
    sandboxStatus?: string
    testResults?: NullableJsonNullValueInput | InputJsonValue
    approvalStatus?: string
    createdAt?: Date | string
  }

  export type FixProposalUncheckedCreateInput = {
    id?: string
    findingId: string
    patch: string
    sandboxStatus?: string
    testResults?: NullableJsonNullValueInput | InputJsonValue
    approvalStatus?: string
    createdAt?: Date | string
  }

  export type FixProposalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    findingId?: StringFieldUpdateOperationsInput | string
    patch?: StringFieldUpdateOperationsInput | string
    sandboxStatus?: StringFieldUpdateOperationsInput | string
    testResults?: NullableJsonNullValueInput | InputJsonValue
    approvalStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FixProposalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    findingId?: StringFieldUpdateOperationsInput | string
    patch?: StringFieldUpdateOperationsInput | string
    sandboxStatus?: StringFieldUpdateOperationsInput | string
    testResults?: NullableJsonNullValueInput | InputJsonValue
    approvalStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FixProposalCreateManyInput = {
    id?: string
    findingId: string
    patch: string
    sandboxStatus?: string
    testResults?: NullableJsonNullValueInput | InputJsonValue
    approvalStatus?: string
    createdAt?: Date | string
  }

  export type FixProposalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    findingId?: StringFieldUpdateOperationsInput | string
    patch?: StringFieldUpdateOperationsInput | string
    sandboxStatus?: StringFieldUpdateOperationsInput | string
    testResults?: NullableJsonNullValueInput | InputJsonValue
    approvalStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FixProposalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    findingId?: StringFieldUpdateOperationsInput | string
    patch?: StringFieldUpdateOperationsInput | string
    sandboxStatus?: StringFieldUpdateOperationsInput | string
    testResults?: NullableJsonNullValueInput | InputJsonValue
    approvalStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type FindingFeedbackListRelationFilter = {
    every?: FindingFeedbackWhereInput
    some?: FindingFeedbackWhereInput
    none?: FindingFeedbackWhereInput
  }

  export type FindingFeedbackOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type RepositoryListRelationFilter = {
    every?: RepositoryWhereInput
    some?: RepositoryWhereInput
    none?: RepositoryWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RepositoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GithubInstallationCountOrderByAggregateInput = {
    id?: SortOrder
    githubInstallationId?: SortOrder
    accountLogin?: SortOrder
    accountType?: SortOrder
    encryptedCredentialsRef?: SortOrder
    createdAt?: SortOrder
  }

  export type GithubInstallationAvgOrderByAggregateInput = {
    githubInstallationId?: SortOrder
  }

  export type GithubInstallationMaxOrderByAggregateInput = {
    id?: SortOrder
    githubInstallationId?: SortOrder
    accountLogin?: SortOrder
    accountType?: SortOrder
    encryptedCredentialsRef?: SortOrder
    createdAt?: SortOrder
  }

  export type GithubInstallationMinOrderByAggregateInput = {
    id?: SortOrder
    githubInstallationId?: SortOrder
    accountLogin?: SortOrder
    accountType?: SortOrder
    encryptedCredentialsRef?: SortOrder
    createdAt?: SortOrder
  }

  export type GithubInstallationSumOrderByAggregateInput = {
    githubInstallationId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type GithubInstallationRelationFilter = {
    is?: GithubInstallationWhereInput
    isNot?: GithubInstallationWhereInput
  }

  export type PullRequestListRelationFilter = {
    every?: PullRequestWhereInput
    some?: PullRequestWhereInput
    none?: PullRequestWhereInput
  }

  export type ReviewJobListRelationFilter = {
    every?: ReviewJobWhereInput
    some?: ReviewJobWhereInput
    none?: ReviewJobWhereInput
  }

  export type PullRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReviewJobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RepositoryCountOrderByAggregateInput = {
    id?: SortOrder
    githubRepositoryId?: SortOrder
    installationId?: SortOrder
    owner?: SortOrder
    name?: SortOrder
    defaultBranch?: SortOrder
    isEnabled?: SortOrder
    reviewConfig?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RepositoryAvgOrderByAggregateInput = {
    githubRepositoryId?: SortOrder
  }

  export type RepositoryMaxOrderByAggregateInput = {
    id?: SortOrder
    githubRepositoryId?: SortOrder
    installationId?: SortOrder
    owner?: SortOrder
    name?: SortOrder
    defaultBranch?: SortOrder
    isEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RepositoryMinOrderByAggregateInput = {
    id?: SortOrder
    githubRepositoryId?: SortOrder
    installationId?: SortOrder
    owner?: SortOrder
    name?: SortOrder
    defaultBranch?: SortOrder
    isEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RepositorySumOrderByAggregateInput = {
    githubRepositoryId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type RepositoryRelationFilter = {
    is?: RepositoryWhereInput
    isNot?: RepositoryWhereInput
  }

  export type PullRequestRepositoryIdGithubPrNumberCompoundUniqueInput = {
    repositoryId: string
    githubPrNumber: number
  }

  export type PullRequestCountOrderByAggregateInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    githubPrNumber?: SortOrder
    title?: SortOrder
    author?: SortOrder
    baseSha?: SortOrder
    headSha?: SortOrder
    state?: SortOrder
    updatedAt?: SortOrder
  }

  export type PullRequestAvgOrderByAggregateInput = {
    githubPrNumber?: SortOrder
  }

  export type PullRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    githubPrNumber?: SortOrder
    title?: SortOrder
    author?: SortOrder
    baseSha?: SortOrder
    headSha?: SortOrder
    state?: SortOrder
    updatedAt?: SortOrder
  }

  export type PullRequestMinOrderByAggregateInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    githubPrNumber?: SortOrder
    title?: SortOrder
    author?: SortOrder
    baseSha?: SortOrder
    headSha?: SortOrder
    state?: SortOrder
    updatedAt?: SortOrder
  }

  export type PullRequestSumOrderByAggregateInput = {
    githubPrNumber?: SortOrder
  }

  export type WebhookDeliveryCountOrderByAggregateInput = {
    id?: SortOrder
    githubDeliveryId?: SortOrder
    eventType?: SortOrder
    repositoryId?: SortOrder
    receivedAt?: SortOrder
    processingStatus?: SortOrder
  }

  export type WebhookDeliveryMaxOrderByAggregateInput = {
    id?: SortOrder
    githubDeliveryId?: SortOrder
    eventType?: SortOrder
    repositoryId?: SortOrder
    receivedAt?: SortOrder
    processingStatus?: SortOrder
  }

  export type WebhookDeliveryMinOrderByAggregateInput = {
    id?: SortOrder
    githubDeliveryId?: SortOrder
    eventType?: SortOrder
    repositoryId?: SortOrder
    receivedAt?: SortOrder
    processingStatus?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PullRequestRelationFilter = {
    is?: PullRequestWhereInput
    isNot?: PullRequestWhereInput
  }

  export type AgentRunListRelationFilter = {
    every?: AgentRunWhereInput
    some?: AgentRunWhereInput
    none?: AgentRunWhereInput
  }

  export type FindingListRelationFilter = {
    every?: FindingWhereInput
    some?: FindingWhereInput
    none?: FindingWhereInput
  }

  export type AgentRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FindingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReviewJobCountOrderByAggregateInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    pullRequestId?: SortOrder
    headSha?: SortOrder
    idempotencyKey?: SortOrder
    status?: SortOrder
    configVersion?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewJobAvgOrderByAggregateInput = {
    configVersion?: SortOrder
  }

  export type ReviewJobMaxOrderByAggregateInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    pullRequestId?: SortOrder
    headSha?: SortOrder
    idempotencyKey?: SortOrder
    status?: SortOrder
    configVersion?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewJobMinOrderByAggregateInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    pullRequestId?: SortOrder
    headSha?: SortOrder
    idempotencyKey?: SortOrder
    status?: SortOrder
    configVersion?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewJobSumOrderByAggregateInput = {
    configVersion?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ReviewJobRelationFilter = {
    is?: ReviewJobWhereInput
    isNot?: ReviewJobWhereInput
  }

  export type AgentRunCountOrderByAggregateInput = {
    id?: SortOrder
    reviewJobId?: SortOrder
    agentType?: SortOrder
    status?: SortOrder
    modelProvider?: SortOrder
    modelName?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    durationMs?: SortOrder
    outputJson?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentRunAvgOrderByAggregateInput = {
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    durationMs?: SortOrder
  }

  export type AgentRunMaxOrderByAggregateInput = {
    id?: SortOrder
    reviewJobId?: SortOrder
    agentType?: SortOrder
    status?: SortOrder
    modelProvider?: SortOrder
    modelName?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    durationMs?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentRunMinOrderByAggregateInput = {
    id?: SortOrder
    reviewJobId?: SortOrder
    agentType?: SortOrder
    status?: SortOrder
    modelProvider?: SortOrder
    modelName?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    durationMs?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentRunSumOrderByAggregateInput = {
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    durationMs?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type AgentRunNullableRelationFilter = {
    is?: AgentRunWhereInput | null
    isNot?: AgentRunWhereInput | null
  }

  export type FindingCountOrderByAggregateInput = {
    id?: SortOrder
    reviewJobId?: SortOrder
    agentRunId?: SortOrder
    fingerprint?: SortOrder
    title?: SortOrder
    category?: SortOrder
    severity?: SortOrder
    confidence?: SortOrder
    filePath?: SortOrder
    line?: SortOrder
    endLine?: SortOrder
    description?: SortOrder
    evidence?: SortOrder
    recommendation?: SortOrder
    verificationStatus?: SortOrder
    publicationStatus?: SortOrder
    githubCommentId?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingAvgOrderByAggregateInput = {
    confidence?: SortOrder
    line?: SortOrder
    endLine?: SortOrder
  }

  export type FindingMaxOrderByAggregateInput = {
    id?: SortOrder
    reviewJobId?: SortOrder
    agentRunId?: SortOrder
    fingerprint?: SortOrder
    title?: SortOrder
    category?: SortOrder
    severity?: SortOrder
    confidence?: SortOrder
    filePath?: SortOrder
    line?: SortOrder
    endLine?: SortOrder
    description?: SortOrder
    evidence?: SortOrder
    recommendation?: SortOrder
    verificationStatus?: SortOrder
    publicationStatus?: SortOrder
    githubCommentId?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingMinOrderByAggregateInput = {
    id?: SortOrder
    reviewJobId?: SortOrder
    agentRunId?: SortOrder
    fingerprint?: SortOrder
    title?: SortOrder
    category?: SortOrder
    severity?: SortOrder
    confidence?: SortOrder
    filePath?: SortOrder
    line?: SortOrder
    endLine?: SortOrder
    description?: SortOrder
    evidence?: SortOrder
    recommendation?: SortOrder
    verificationStatus?: SortOrder
    publicationStatus?: SortOrder
    githubCommentId?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingSumOrderByAggregateInput = {
    confidence?: SortOrder
    line?: SortOrder
    endLine?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FindingRelationFilter = {
    is?: FindingWhereInput
    isNot?: FindingWhereInput
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FindingFeedbackCountOrderByAggregateInput = {
    id?: SortOrder
    findingId?: SortOrder
    userId?: SortOrder
    feedbackType?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingFeedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    findingId?: SortOrder
    userId?: SortOrder
    feedbackType?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingFeedbackMinOrderByAggregateInput = {
    id?: SortOrder
    findingId?: SortOrder
    userId?: SortOrder
    feedbackType?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type FixProposalCountOrderByAggregateInput = {
    id?: SortOrder
    findingId?: SortOrder
    patch?: SortOrder
    sandboxStatus?: SortOrder
    testResults?: SortOrder
    approvalStatus?: SortOrder
    createdAt?: SortOrder
  }

  export type FixProposalMaxOrderByAggregateInput = {
    id?: SortOrder
    findingId?: SortOrder
    patch?: SortOrder
    sandboxStatus?: SortOrder
    approvalStatus?: SortOrder
    createdAt?: SortOrder
  }

  export type FixProposalMinOrderByAggregateInput = {
    id?: SortOrder
    findingId?: SortOrder
    patch?: SortOrder
    sandboxStatus?: SortOrder
    approvalStatus?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingFeedbackCreateNestedManyWithoutUserInput = {
    create?: XOR<FindingFeedbackCreateWithoutUserInput, FindingFeedbackUncheckedCreateWithoutUserInput> | FindingFeedbackCreateWithoutUserInput[] | FindingFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FindingFeedbackCreateOrConnectWithoutUserInput | FindingFeedbackCreateOrConnectWithoutUserInput[]
    createMany?: FindingFeedbackCreateManyUserInputEnvelope
    connect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
  }

  export type FindingFeedbackUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FindingFeedbackCreateWithoutUserInput, FindingFeedbackUncheckedCreateWithoutUserInput> | FindingFeedbackCreateWithoutUserInput[] | FindingFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FindingFeedbackCreateOrConnectWithoutUserInput | FindingFeedbackCreateOrConnectWithoutUserInput[]
    createMany?: FindingFeedbackCreateManyUserInputEnvelope
    connect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type FindingFeedbackUpdateManyWithoutUserNestedInput = {
    create?: XOR<FindingFeedbackCreateWithoutUserInput, FindingFeedbackUncheckedCreateWithoutUserInput> | FindingFeedbackCreateWithoutUserInput[] | FindingFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FindingFeedbackCreateOrConnectWithoutUserInput | FindingFeedbackCreateOrConnectWithoutUserInput[]
    upsert?: FindingFeedbackUpsertWithWhereUniqueWithoutUserInput | FindingFeedbackUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FindingFeedbackCreateManyUserInputEnvelope
    set?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    disconnect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    delete?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    connect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    update?: FindingFeedbackUpdateWithWhereUniqueWithoutUserInput | FindingFeedbackUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FindingFeedbackUpdateManyWithWhereWithoutUserInput | FindingFeedbackUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FindingFeedbackScalarWhereInput | FindingFeedbackScalarWhereInput[]
  }

  export type FindingFeedbackUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FindingFeedbackCreateWithoutUserInput, FindingFeedbackUncheckedCreateWithoutUserInput> | FindingFeedbackCreateWithoutUserInput[] | FindingFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FindingFeedbackCreateOrConnectWithoutUserInput | FindingFeedbackCreateOrConnectWithoutUserInput[]
    upsert?: FindingFeedbackUpsertWithWhereUniqueWithoutUserInput | FindingFeedbackUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FindingFeedbackCreateManyUserInputEnvelope
    set?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    disconnect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    delete?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    connect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    update?: FindingFeedbackUpdateWithWhereUniqueWithoutUserInput | FindingFeedbackUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FindingFeedbackUpdateManyWithWhereWithoutUserInput | FindingFeedbackUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FindingFeedbackScalarWhereInput | FindingFeedbackScalarWhereInput[]
  }

  export type RepositoryCreateNestedManyWithoutInstallationInput = {
    create?: XOR<RepositoryCreateWithoutInstallationInput, RepositoryUncheckedCreateWithoutInstallationInput> | RepositoryCreateWithoutInstallationInput[] | RepositoryUncheckedCreateWithoutInstallationInput[]
    connectOrCreate?: RepositoryCreateOrConnectWithoutInstallationInput | RepositoryCreateOrConnectWithoutInstallationInput[]
    createMany?: RepositoryCreateManyInstallationInputEnvelope
    connect?: RepositoryWhereUniqueInput | RepositoryWhereUniqueInput[]
  }

  export type RepositoryUncheckedCreateNestedManyWithoutInstallationInput = {
    create?: XOR<RepositoryCreateWithoutInstallationInput, RepositoryUncheckedCreateWithoutInstallationInput> | RepositoryCreateWithoutInstallationInput[] | RepositoryUncheckedCreateWithoutInstallationInput[]
    connectOrCreate?: RepositoryCreateOrConnectWithoutInstallationInput | RepositoryCreateOrConnectWithoutInstallationInput[]
    createMany?: RepositoryCreateManyInstallationInputEnvelope
    connect?: RepositoryWhereUniqueInput | RepositoryWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type RepositoryUpdateManyWithoutInstallationNestedInput = {
    create?: XOR<RepositoryCreateWithoutInstallationInput, RepositoryUncheckedCreateWithoutInstallationInput> | RepositoryCreateWithoutInstallationInput[] | RepositoryUncheckedCreateWithoutInstallationInput[]
    connectOrCreate?: RepositoryCreateOrConnectWithoutInstallationInput | RepositoryCreateOrConnectWithoutInstallationInput[]
    upsert?: RepositoryUpsertWithWhereUniqueWithoutInstallationInput | RepositoryUpsertWithWhereUniqueWithoutInstallationInput[]
    createMany?: RepositoryCreateManyInstallationInputEnvelope
    set?: RepositoryWhereUniqueInput | RepositoryWhereUniqueInput[]
    disconnect?: RepositoryWhereUniqueInput | RepositoryWhereUniqueInput[]
    delete?: RepositoryWhereUniqueInput | RepositoryWhereUniqueInput[]
    connect?: RepositoryWhereUniqueInput | RepositoryWhereUniqueInput[]
    update?: RepositoryUpdateWithWhereUniqueWithoutInstallationInput | RepositoryUpdateWithWhereUniqueWithoutInstallationInput[]
    updateMany?: RepositoryUpdateManyWithWhereWithoutInstallationInput | RepositoryUpdateManyWithWhereWithoutInstallationInput[]
    deleteMany?: RepositoryScalarWhereInput | RepositoryScalarWhereInput[]
  }

  export type RepositoryUncheckedUpdateManyWithoutInstallationNestedInput = {
    create?: XOR<RepositoryCreateWithoutInstallationInput, RepositoryUncheckedCreateWithoutInstallationInput> | RepositoryCreateWithoutInstallationInput[] | RepositoryUncheckedCreateWithoutInstallationInput[]
    connectOrCreate?: RepositoryCreateOrConnectWithoutInstallationInput | RepositoryCreateOrConnectWithoutInstallationInput[]
    upsert?: RepositoryUpsertWithWhereUniqueWithoutInstallationInput | RepositoryUpsertWithWhereUniqueWithoutInstallationInput[]
    createMany?: RepositoryCreateManyInstallationInputEnvelope
    set?: RepositoryWhereUniqueInput | RepositoryWhereUniqueInput[]
    disconnect?: RepositoryWhereUniqueInput | RepositoryWhereUniqueInput[]
    delete?: RepositoryWhereUniqueInput | RepositoryWhereUniqueInput[]
    connect?: RepositoryWhereUniqueInput | RepositoryWhereUniqueInput[]
    update?: RepositoryUpdateWithWhereUniqueWithoutInstallationInput | RepositoryUpdateWithWhereUniqueWithoutInstallationInput[]
    updateMany?: RepositoryUpdateManyWithWhereWithoutInstallationInput | RepositoryUpdateManyWithWhereWithoutInstallationInput[]
    deleteMany?: RepositoryScalarWhereInput | RepositoryScalarWhereInput[]
  }

  export type GithubInstallationCreateNestedOneWithoutRepositoriesInput = {
    create?: XOR<GithubInstallationCreateWithoutRepositoriesInput, GithubInstallationUncheckedCreateWithoutRepositoriesInput>
    connectOrCreate?: GithubInstallationCreateOrConnectWithoutRepositoriesInput
    connect?: GithubInstallationWhereUniqueInput
  }

  export type PullRequestCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<PullRequestCreateWithoutRepositoryInput, PullRequestUncheckedCreateWithoutRepositoryInput> | PullRequestCreateWithoutRepositoryInput[] | PullRequestUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutRepositoryInput | PullRequestCreateOrConnectWithoutRepositoryInput[]
    createMany?: PullRequestCreateManyRepositoryInputEnvelope
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
  }

  export type ReviewJobCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<ReviewJobCreateWithoutRepositoryInput, ReviewJobUncheckedCreateWithoutRepositoryInput> | ReviewJobCreateWithoutRepositoryInput[] | ReviewJobUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: ReviewJobCreateOrConnectWithoutRepositoryInput | ReviewJobCreateOrConnectWithoutRepositoryInput[]
    createMany?: ReviewJobCreateManyRepositoryInputEnvelope
    connect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
  }

  export type PullRequestUncheckedCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<PullRequestCreateWithoutRepositoryInput, PullRequestUncheckedCreateWithoutRepositoryInput> | PullRequestCreateWithoutRepositoryInput[] | PullRequestUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutRepositoryInput | PullRequestCreateOrConnectWithoutRepositoryInput[]
    createMany?: PullRequestCreateManyRepositoryInputEnvelope
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
  }

  export type ReviewJobUncheckedCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<ReviewJobCreateWithoutRepositoryInput, ReviewJobUncheckedCreateWithoutRepositoryInput> | ReviewJobCreateWithoutRepositoryInput[] | ReviewJobUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: ReviewJobCreateOrConnectWithoutRepositoryInput | ReviewJobCreateOrConnectWithoutRepositoryInput[]
    createMany?: ReviewJobCreateManyRepositoryInputEnvelope
    connect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type GithubInstallationUpdateOneRequiredWithoutRepositoriesNestedInput = {
    create?: XOR<GithubInstallationCreateWithoutRepositoriesInput, GithubInstallationUncheckedCreateWithoutRepositoriesInput>
    connectOrCreate?: GithubInstallationCreateOrConnectWithoutRepositoriesInput
    upsert?: GithubInstallationUpsertWithoutRepositoriesInput
    connect?: GithubInstallationWhereUniqueInput
    update?: XOR<XOR<GithubInstallationUpdateToOneWithWhereWithoutRepositoriesInput, GithubInstallationUpdateWithoutRepositoriesInput>, GithubInstallationUncheckedUpdateWithoutRepositoriesInput>
  }

  export type PullRequestUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<PullRequestCreateWithoutRepositoryInput, PullRequestUncheckedCreateWithoutRepositoryInput> | PullRequestCreateWithoutRepositoryInput[] | PullRequestUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutRepositoryInput | PullRequestCreateOrConnectWithoutRepositoryInput[]
    upsert?: PullRequestUpsertWithWhereUniqueWithoutRepositoryInput | PullRequestUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: PullRequestCreateManyRepositoryInputEnvelope
    set?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    disconnect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    delete?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    update?: PullRequestUpdateWithWhereUniqueWithoutRepositoryInput | PullRequestUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: PullRequestUpdateManyWithWhereWithoutRepositoryInput | PullRequestUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: PullRequestScalarWhereInput | PullRequestScalarWhereInput[]
  }

  export type ReviewJobUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<ReviewJobCreateWithoutRepositoryInput, ReviewJobUncheckedCreateWithoutRepositoryInput> | ReviewJobCreateWithoutRepositoryInput[] | ReviewJobUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: ReviewJobCreateOrConnectWithoutRepositoryInput | ReviewJobCreateOrConnectWithoutRepositoryInput[]
    upsert?: ReviewJobUpsertWithWhereUniqueWithoutRepositoryInput | ReviewJobUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: ReviewJobCreateManyRepositoryInputEnvelope
    set?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    disconnect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    delete?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    connect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    update?: ReviewJobUpdateWithWhereUniqueWithoutRepositoryInput | ReviewJobUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: ReviewJobUpdateManyWithWhereWithoutRepositoryInput | ReviewJobUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: ReviewJobScalarWhereInput | ReviewJobScalarWhereInput[]
  }

  export type PullRequestUncheckedUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<PullRequestCreateWithoutRepositoryInput, PullRequestUncheckedCreateWithoutRepositoryInput> | PullRequestCreateWithoutRepositoryInput[] | PullRequestUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutRepositoryInput | PullRequestCreateOrConnectWithoutRepositoryInput[]
    upsert?: PullRequestUpsertWithWhereUniqueWithoutRepositoryInput | PullRequestUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: PullRequestCreateManyRepositoryInputEnvelope
    set?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    disconnect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    delete?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    update?: PullRequestUpdateWithWhereUniqueWithoutRepositoryInput | PullRequestUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: PullRequestUpdateManyWithWhereWithoutRepositoryInput | PullRequestUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: PullRequestScalarWhereInput | PullRequestScalarWhereInput[]
  }

  export type ReviewJobUncheckedUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<ReviewJobCreateWithoutRepositoryInput, ReviewJobUncheckedCreateWithoutRepositoryInput> | ReviewJobCreateWithoutRepositoryInput[] | ReviewJobUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: ReviewJobCreateOrConnectWithoutRepositoryInput | ReviewJobCreateOrConnectWithoutRepositoryInput[]
    upsert?: ReviewJobUpsertWithWhereUniqueWithoutRepositoryInput | ReviewJobUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: ReviewJobCreateManyRepositoryInputEnvelope
    set?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    disconnect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    delete?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    connect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    update?: ReviewJobUpdateWithWhereUniqueWithoutRepositoryInput | ReviewJobUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: ReviewJobUpdateManyWithWhereWithoutRepositoryInput | ReviewJobUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: ReviewJobScalarWhereInput | ReviewJobScalarWhereInput[]
  }

  export type RepositoryCreateNestedOneWithoutPullRequestsInput = {
    create?: XOR<RepositoryCreateWithoutPullRequestsInput, RepositoryUncheckedCreateWithoutPullRequestsInput>
    connectOrCreate?: RepositoryCreateOrConnectWithoutPullRequestsInput
    connect?: RepositoryWhereUniqueInput
  }

  export type ReviewJobCreateNestedManyWithoutPullRequestInput = {
    create?: XOR<ReviewJobCreateWithoutPullRequestInput, ReviewJobUncheckedCreateWithoutPullRequestInput> | ReviewJobCreateWithoutPullRequestInput[] | ReviewJobUncheckedCreateWithoutPullRequestInput[]
    connectOrCreate?: ReviewJobCreateOrConnectWithoutPullRequestInput | ReviewJobCreateOrConnectWithoutPullRequestInput[]
    createMany?: ReviewJobCreateManyPullRequestInputEnvelope
    connect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
  }

  export type ReviewJobUncheckedCreateNestedManyWithoutPullRequestInput = {
    create?: XOR<ReviewJobCreateWithoutPullRequestInput, ReviewJobUncheckedCreateWithoutPullRequestInput> | ReviewJobCreateWithoutPullRequestInput[] | ReviewJobUncheckedCreateWithoutPullRequestInput[]
    connectOrCreate?: ReviewJobCreateOrConnectWithoutPullRequestInput | ReviewJobCreateOrConnectWithoutPullRequestInput[]
    createMany?: ReviewJobCreateManyPullRequestInputEnvelope
    connect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
  }

  export type RepositoryUpdateOneRequiredWithoutPullRequestsNestedInput = {
    create?: XOR<RepositoryCreateWithoutPullRequestsInput, RepositoryUncheckedCreateWithoutPullRequestsInput>
    connectOrCreate?: RepositoryCreateOrConnectWithoutPullRequestsInput
    upsert?: RepositoryUpsertWithoutPullRequestsInput
    connect?: RepositoryWhereUniqueInput
    update?: XOR<XOR<RepositoryUpdateToOneWithWhereWithoutPullRequestsInput, RepositoryUpdateWithoutPullRequestsInput>, RepositoryUncheckedUpdateWithoutPullRequestsInput>
  }

  export type ReviewJobUpdateManyWithoutPullRequestNestedInput = {
    create?: XOR<ReviewJobCreateWithoutPullRequestInput, ReviewJobUncheckedCreateWithoutPullRequestInput> | ReviewJobCreateWithoutPullRequestInput[] | ReviewJobUncheckedCreateWithoutPullRequestInput[]
    connectOrCreate?: ReviewJobCreateOrConnectWithoutPullRequestInput | ReviewJobCreateOrConnectWithoutPullRequestInput[]
    upsert?: ReviewJobUpsertWithWhereUniqueWithoutPullRequestInput | ReviewJobUpsertWithWhereUniqueWithoutPullRequestInput[]
    createMany?: ReviewJobCreateManyPullRequestInputEnvelope
    set?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    disconnect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    delete?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    connect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    update?: ReviewJobUpdateWithWhereUniqueWithoutPullRequestInput | ReviewJobUpdateWithWhereUniqueWithoutPullRequestInput[]
    updateMany?: ReviewJobUpdateManyWithWhereWithoutPullRequestInput | ReviewJobUpdateManyWithWhereWithoutPullRequestInput[]
    deleteMany?: ReviewJobScalarWhereInput | ReviewJobScalarWhereInput[]
  }

  export type ReviewJobUncheckedUpdateManyWithoutPullRequestNestedInput = {
    create?: XOR<ReviewJobCreateWithoutPullRequestInput, ReviewJobUncheckedCreateWithoutPullRequestInput> | ReviewJobCreateWithoutPullRequestInput[] | ReviewJobUncheckedCreateWithoutPullRequestInput[]
    connectOrCreate?: ReviewJobCreateOrConnectWithoutPullRequestInput | ReviewJobCreateOrConnectWithoutPullRequestInput[]
    upsert?: ReviewJobUpsertWithWhereUniqueWithoutPullRequestInput | ReviewJobUpsertWithWhereUniqueWithoutPullRequestInput[]
    createMany?: ReviewJobCreateManyPullRequestInputEnvelope
    set?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    disconnect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    delete?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    connect?: ReviewJobWhereUniqueInput | ReviewJobWhereUniqueInput[]
    update?: ReviewJobUpdateWithWhereUniqueWithoutPullRequestInput | ReviewJobUpdateWithWhereUniqueWithoutPullRequestInput[]
    updateMany?: ReviewJobUpdateManyWithWhereWithoutPullRequestInput | ReviewJobUpdateManyWithWhereWithoutPullRequestInput[]
    deleteMany?: ReviewJobScalarWhereInput | ReviewJobScalarWhereInput[]
  }

  export type RepositoryCreateNestedOneWithoutReviewJobsInput = {
    create?: XOR<RepositoryCreateWithoutReviewJobsInput, RepositoryUncheckedCreateWithoutReviewJobsInput>
    connectOrCreate?: RepositoryCreateOrConnectWithoutReviewJobsInput
    connect?: RepositoryWhereUniqueInput
  }

  export type PullRequestCreateNestedOneWithoutReviewJobsInput = {
    create?: XOR<PullRequestCreateWithoutReviewJobsInput, PullRequestUncheckedCreateWithoutReviewJobsInput>
    connectOrCreate?: PullRequestCreateOrConnectWithoutReviewJobsInput
    connect?: PullRequestWhereUniqueInput
  }

  export type AgentRunCreateNestedManyWithoutReviewJobInput = {
    create?: XOR<AgentRunCreateWithoutReviewJobInput, AgentRunUncheckedCreateWithoutReviewJobInput> | AgentRunCreateWithoutReviewJobInput[] | AgentRunUncheckedCreateWithoutReviewJobInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutReviewJobInput | AgentRunCreateOrConnectWithoutReviewJobInput[]
    createMany?: AgentRunCreateManyReviewJobInputEnvelope
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
  }

  export type FindingCreateNestedManyWithoutReviewJobInput = {
    create?: XOR<FindingCreateWithoutReviewJobInput, FindingUncheckedCreateWithoutReviewJobInput> | FindingCreateWithoutReviewJobInput[] | FindingUncheckedCreateWithoutReviewJobInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutReviewJobInput | FindingCreateOrConnectWithoutReviewJobInput[]
    createMany?: FindingCreateManyReviewJobInputEnvelope
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
  }

  export type AgentRunUncheckedCreateNestedManyWithoutReviewJobInput = {
    create?: XOR<AgentRunCreateWithoutReviewJobInput, AgentRunUncheckedCreateWithoutReviewJobInput> | AgentRunCreateWithoutReviewJobInput[] | AgentRunUncheckedCreateWithoutReviewJobInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutReviewJobInput | AgentRunCreateOrConnectWithoutReviewJobInput[]
    createMany?: AgentRunCreateManyReviewJobInputEnvelope
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
  }

  export type FindingUncheckedCreateNestedManyWithoutReviewJobInput = {
    create?: XOR<FindingCreateWithoutReviewJobInput, FindingUncheckedCreateWithoutReviewJobInput> | FindingCreateWithoutReviewJobInput[] | FindingUncheckedCreateWithoutReviewJobInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutReviewJobInput | FindingCreateOrConnectWithoutReviewJobInput[]
    createMany?: FindingCreateManyReviewJobInputEnvelope
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type RepositoryUpdateOneRequiredWithoutReviewJobsNestedInput = {
    create?: XOR<RepositoryCreateWithoutReviewJobsInput, RepositoryUncheckedCreateWithoutReviewJobsInput>
    connectOrCreate?: RepositoryCreateOrConnectWithoutReviewJobsInput
    upsert?: RepositoryUpsertWithoutReviewJobsInput
    connect?: RepositoryWhereUniqueInput
    update?: XOR<XOR<RepositoryUpdateToOneWithWhereWithoutReviewJobsInput, RepositoryUpdateWithoutReviewJobsInput>, RepositoryUncheckedUpdateWithoutReviewJobsInput>
  }

  export type PullRequestUpdateOneRequiredWithoutReviewJobsNestedInput = {
    create?: XOR<PullRequestCreateWithoutReviewJobsInput, PullRequestUncheckedCreateWithoutReviewJobsInput>
    connectOrCreate?: PullRequestCreateOrConnectWithoutReviewJobsInput
    upsert?: PullRequestUpsertWithoutReviewJobsInput
    connect?: PullRequestWhereUniqueInput
    update?: XOR<XOR<PullRequestUpdateToOneWithWhereWithoutReviewJobsInput, PullRequestUpdateWithoutReviewJobsInput>, PullRequestUncheckedUpdateWithoutReviewJobsInput>
  }

  export type AgentRunUpdateManyWithoutReviewJobNestedInput = {
    create?: XOR<AgentRunCreateWithoutReviewJobInput, AgentRunUncheckedCreateWithoutReviewJobInput> | AgentRunCreateWithoutReviewJobInput[] | AgentRunUncheckedCreateWithoutReviewJobInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutReviewJobInput | AgentRunCreateOrConnectWithoutReviewJobInput[]
    upsert?: AgentRunUpsertWithWhereUniqueWithoutReviewJobInput | AgentRunUpsertWithWhereUniqueWithoutReviewJobInput[]
    createMany?: AgentRunCreateManyReviewJobInputEnvelope
    set?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    disconnect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    delete?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    update?: AgentRunUpdateWithWhereUniqueWithoutReviewJobInput | AgentRunUpdateWithWhereUniqueWithoutReviewJobInput[]
    updateMany?: AgentRunUpdateManyWithWhereWithoutReviewJobInput | AgentRunUpdateManyWithWhereWithoutReviewJobInput[]
    deleteMany?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
  }

  export type FindingUpdateManyWithoutReviewJobNestedInput = {
    create?: XOR<FindingCreateWithoutReviewJobInput, FindingUncheckedCreateWithoutReviewJobInput> | FindingCreateWithoutReviewJobInput[] | FindingUncheckedCreateWithoutReviewJobInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutReviewJobInput | FindingCreateOrConnectWithoutReviewJobInput[]
    upsert?: FindingUpsertWithWhereUniqueWithoutReviewJobInput | FindingUpsertWithWhereUniqueWithoutReviewJobInput[]
    createMany?: FindingCreateManyReviewJobInputEnvelope
    set?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    disconnect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    delete?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    update?: FindingUpdateWithWhereUniqueWithoutReviewJobInput | FindingUpdateWithWhereUniqueWithoutReviewJobInput[]
    updateMany?: FindingUpdateManyWithWhereWithoutReviewJobInput | FindingUpdateManyWithWhereWithoutReviewJobInput[]
    deleteMany?: FindingScalarWhereInput | FindingScalarWhereInput[]
  }

  export type AgentRunUncheckedUpdateManyWithoutReviewJobNestedInput = {
    create?: XOR<AgentRunCreateWithoutReviewJobInput, AgentRunUncheckedCreateWithoutReviewJobInput> | AgentRunCreateWithoutReviewJobInput[] | AgentRunUncheckedCreateWithoutReviewJobInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutReviewJobInput | AgentRunCreateOrConnectWithoutReviewJobInput[]
    upsert?: AgentRunUpsertWithWhereUniqueWithoutReviewJobInput | AgentRunUpsertWithWhereUniqueWithoutReviewJobInput[]
    createMany?: AgentRunCreateManyReviewJobInputEnvelope
    set?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    disconnect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    delete?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    update?: AgentRunUpdateWithWhereUniqueWithoutReviewJobInput | AgentRunUpdateWithWhereUniqueWithoutReviewJobInput[]
    updateMany?: AgentRunUpdateManyWithWhereWithoutReviewJobInput | AgentRunUpdateManyWithWhereWithoutReviewJobInput[]
    deleteMany?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
  }

  export type FindingUncheckedUpdateManyWithoutReviewJobNestedInput = {
    create?: XOR<FindingCreateWithoutReviewJobInput, FindingUncheckedCreateWithoutReviewJobInput> | FindingCreateWithoutReviewJobInput[] | FindingUncheckedCreateWithoutReviewJobInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutReviewJobInput | FindingCreateOrConnectWithoutReviewJobInput[]
    upsert?: FindingUpsertWithWhereUniqueWithoutReviewJobInput | FindingUpsertWithWhereUniqueWithoutReviewJobInput[]
    createMany?: FindingCreateManyReviewJobInputEnvelope
    set?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    disconnect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    delete?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    update?: FindingUpdateWithWhereUniqueWithoutReviewJobInput | FindingUpdateWithWhereUniqueWithoutReviewJobInput[]
    updateMany?: FindingUpdateManyWithWhereWithoutReviewJobInput | FindingUpdateManyWithWhereWithoutReviewJobInput[]
    deleteMany?: FindingScalarWhereInput | FindingScalarWhereInput[]
  }

  export type ReviewJobCreateNestedOneWithoutAgentRunsInput = {
    create?: XOR<ReviewJobCreateWithoutAgentRunsInput, ReviewJobUncheckedCreateWithoutAgentRunsInput>
    connectOrCreate?: ReviewJobCreateOrConnectWithoutAgentRunsInput
    connect?: ReviewJobWhereUniqueInput
  }

  export type FindingCreateNestedManyWithoutAgentRunInput = {
    create?: XOR<FindingCreateWithoutAgentRunInput, FindingUncheckedCreateWithoutAgentRunInput> | FindingCreateWithoutAgentRunInput[] | FindingUncheckedCreateWithoutAgentRunInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutAgentRunInput | FindingCreateOrConnectWithoutAgentRunInput[]
    createMany?: FindingCreateManyAgentRunInputEnvelope
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
  }

  export type FindingUncheckedCreateNestedManyWithoutAgentRunInput = {
    create?: XOR<FindingCreateWithoutAgentRunInput, FindingUncheckedCreateWithoutAgentRunInput> | FindingCreateWithoutAgentRunInput[] | FindingUncheckedCreateWithoutAgentRunInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutAgentRunInput | FindingCreateOrConnectWithoutAgentRunInput[]
    createMany?: FindingCreateManyAgentRunInputEnvelope
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ReviewJobUpdateOneRequiredWithoutAgentRunsNestedInput = {
    create?: XOR<ReviewJobCreateWithoutAgentRunsInput, ReviewJobUncheckedCreateWithoutAgentRunsInput>
    connectOrCreate?: ReviewJobCreateOrConnectWithoutAgentRunsInput
    upsert?: ReviewJobUpsertWithoutAgentRunsInput
    connect?: ReviewJobWhereUniqueInput
    update?: XOR<XOR<ReviewJobUpdateToOneWithWhereWithoutAgentRunsInput, ReviewJobUpdateWithoutAgentRunsInput>, ReviewJobUncheckedUpdateWithoutAgentRunsInput>
  }

  export type FindingUpdateManyWithoutAgentRunNestedInput = {
    create?: XOR<FindingCreateWithoutAgentRunInput, FindingUncheckedCreateWithoutAgentRunInput> | FindingCreateWithoutAgentRunInput[] | FindingUncheckedCreateWithoutAgentRunInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutAgentRunInput | FindingCreateOrConnectWithoutAgentRunInput[]
    upsert?: FindingUpsertWithWhereUniqueWithoutAgentRunInput | FindingUpsertWithWhereUniqueWithoutAgentRunInput[]
    createMany?: FindingCreateManyAgentRunInputEnvelope
    set?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    disconnect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    delete?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    update?: FindingUpdateWithWhereUniqueWithoutAgentRunInput | FindingUpdateWithWhereUniqueWithoutAgentRunInput[]
    updateMany?: FindingUpdateManyWithWhereWithoutAgentRunInput | FindingUpdateManyWithWhereWithoutAgentRunInput[]
    deleteMany?: FindingScalarWhereInput | FindingScalarWhereInput[]
  }

  export type FindingUncheckedUpdateManyWithoutAgentRunNestedInput = {
    create?: XOR<FindingCreateWithoutAgentRunInput, FindingUncheckedCreateWithoutAgentRunInput> | FindingCreateWithoutAgentRunInput[] | FindingUncheckedCreateWithoutAgentRunInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutAgentRunInput | FindingCreateOrConnectWithoutAgentRunInput[]
    upsert?: FindingUpsertWithWhereUniqueWithoutAgentRunInput | FindingUpsertWithWhereUniqueWithoutAgentRunInput[]
    createMany?: FindingCreateManyAgentRunInputEnvelope
    set?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    disconnect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    delete?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    update?: FindingUpdateWithWhereUniqueWithoutAgentRunInput | FindingUpdateWithWhereUniqueWithoutAgentRunInput[]
    updateMany?: FindingUpdateManyWithWhereWithoutAgentRunInput | FindingUpdateManyWithWhereWithoutAgentRunInput[]
    deleteMany?: FindingScalarWhereInput | FindingScalarWhereInput[]
  }

  export type ReviewJobCreateNestedOneWithoutFindingsInput = {
    create?: XOR<ReviewJobCreateWithoutFindingsInput, ReviewJobUncheckedCreateWithoutFindingsInput>
    connectOrCreate?: ReviewJobCreateOrConnectWithoutFindingsInput
    connect?: ReviewJobWhereUniqueInput
  }

  export type AgentRunCreateNestedOneWithoutFindingsInput = {
    create?: XOR<AgentRunCreateWithoutFindingsInput, AgentRunUncheckedCreateWithoutFindingsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutFindingsInput
    connect?: AgentRunWhereUniqueInput
  }

  export type FindingFeedbackCreateNestedManyWithoutFindingInput = {
    create?: XOR<FindingFeedbackCreateWithoutFindingInput, FindingFeedbackUncheckedCreateWithoutFindingInput> | FindingFeedbackCreateWithoutFindingInput[] | FindingFeedbackUncheckedCreateWithoutFindingInput[]
    connectOrCreate?: FindingFeedbackCreateOrConnectWithoutFindingInput | FindingFeedbackCreateOrConnectWithoutFindingInput[]
    createMany?: FindingFeedbackCreateManyFindingInputEnvelope
    connect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
  }

  export type FindingFeedbackUncheckedCreateNestedManyWithoutFindingInput = {
    create?: XOR<FindingFeedbackCreateWithoutFindingInput, FindingFeedbackUncheckedCreateWithoutFindingInput> | FindingFeedbackCreateWithoutFindingInput[] | FindingFeedbackUncheckedCreateWithoutFindingInput[]
    connectOrCreate?: FindingFeedbackCreateOrConnectWithoutFindingInput | FindingFeedbackCreateOrConnectWithoutFindingInput[]
    createMany?: FindingFeedbackCreateManyFindingInputEnvelope
    connect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ReviewJobUpdateOneRequiredWithoutFindingsNestedInput = {
    create?: XOR<ReviewJobCreateWithoutFindingsInput, ReviewJobUncheckedCreateWithoutFindingsInput>
    connectOrCreate?: ReviewJobCreateOrConnectWithoutFindingsInput
    upsert?: ReviewJobUpsertWithoutFindingsInput
    connect?: ReviewJobWhereUniqueInput
    update?: XOR<XOR<ReviewJobUpdateToOneWithWhereWithoutFindingsInput, ReviewJobUpdateWithoutFindingsInput>, ReviewJobUncheckedUpdateWithoutFindingsInput>
  }

  export type AgentRunUpdateOneWithoutFindingsNestedInput = {
    create?: XOR<AgentRunCreateWithoutFindingsInput, AgentRunUncheckedCreateWithoutFindingsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutFindingsInput
    upsert?: AgentRunUpsertWithoutFindingsInput
    disconnect?: AgentRunWhereInput | boolean
    delete?: AgentRunWhereInput | boolean
    connect?: AgentRunWhereUniqueInput
    update?: XOR<XOR<AgentRunUpdateToOneWithWhereWithoutFindingsInput, AgentRunUpdateWithoutFindingsInput>, AgentRunUncheckedUpdateWithoutFindingsInput>
  }

  export type FindingFeedbackUpdateManyWithoutFindingNestedInput = {
    create?: XOR<FindingFeedbackCreateWithoutFindingInput, FindingFeedbackUncheckedCreateWithoutFindingInput> | FindingFeedbackCreateWithoutFindingInput[] | FindingFeedbackUncheckedCreateWithoutFindingInput[]
    connectOrCreate?: FindingFeedbackCreateOrConnectWithoutFindingInput | FindingFeedbackCreateOrConnectWithoutFindingInput[]
    upsert?: FindingFeedbackUpsertWithWhereUniqueWithoutFindingInput | FindingFeedbackUpsertWithWhereUniqueWithoutFindingInput[]
    createMany?: FindingFeedbackCreateManyFindingInputEnvelope
    set?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    disconnect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    delete?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    connect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    update?: FindingFeedbackUpdateWithWhereUniqueWithoutFindingInput | FindingFeedbackUpdateWithWhereUniqueWithoutFindingInput[]
    updateMany?: FindingFeedbackUpdateManyWithWhereWithoutFindingInput | FindingFeedbackUpdateManyWithWhereWithoutFindingInput[]
    deleteMany?: FindingFeedbackScalarWhereInput | FindingFeedbackScalarWhereInput[]
  }

  export type FindingFeedbackUncheckedUpdateManyWithoutFindingNestedInput = {
    create?: XOR<FindingFeedbackCreateWithoutFindingInput, FindingFeedbackUncheckedCreateWithoutFindingInput> | FindingFeedbackCreateWithoutFindingInput[] | FindingFeedbackUncheckedCreateWithoutFindingInput[]
    connectOrCreate?: FindingFeedbackCreateOrConnectWithoutFindingInput | FindingFeedbackCreateOrConnectWithoutFindingInput[]
    upsert?: FindingFeedbackUpsertWithWhereUniqueWithoutFindingInput | FindingFeedbackUpsertWithWhereUniqueWithoutFindingInput[]
    createMany?: FindingFeedbackCreateManyFindingInputEnvelope
    set?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    disconnect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    delete?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    connect?: FindingFeedbackWhereUniqueInput | FindingFeedbackWhereUniqueInput[]
    update?: FindingFeedbackUpdateWithWhereUniqueWithoutFindingInput | FindingFeedbackUpdateWithWhereUniqueWithoutFindingInput[]
    updateMany?: FindingFeedbackUpdateManyWithWhereWithoutFindingInput | FindingFeedbackUpdateManyWithWhereWithoutFindingInput[]
    deleteMany?: FindingFeedbackScalarWhereInput | FindingFeedbackScalarWhereInput[]
  }

  export type FindingCreateNestedOneWithoutFeedbacksInput = {
    create?: XOR<FindingCreateWithoutFeedbacksInput, FindingUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: FindingCreateOrConnectWithoutFeedbacksInput
    connect?: FindingWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutFeedbacksInput = {
    create?: XOR<UserCreateWithoutFeedbacksInput, UserUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: UserCreateOrConnectWithoutFeedbacksInput
    connect?: UserWhereUniqueInput
  }

  export type FindingUpdateOneRequiredWithoutFeedbacksNestedInput = {
    create?: XOR<FindingCreateWithoutFeedbacksInput, FindingUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: FindingCreateOrConnectWithoutFeedbacksInput
    upsert?: FindingUpsertWithoutFeedbacksInput
    connect?: FindingWhereUniqueInput
    update?: XOR<XOR<FindingUpdateToOneWithWhereWithoutFeedbacksInput, FindingUpdateWithoutFeedbacksInput>, FindingUncheckedUpdateWithoutFeedbacksInput>
  }

  export type UserUpdateOneRequiredWithoutFeedbacksNestedInput = {
    create?: XOR<UserCreateWithoutFeedbacksInput, UserUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: UserCreateOrConnectWithoutFeedbacksInput
    upsert?: UserUpsertWithoutFeedbacksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFeedbacksInput, UserUpdateWithoutFeedbacksInput>, UserUncheckedUpdateWithoutFeedbacksInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FindingFeedbackCreateWithoutUserInput = {
    id?: string
    feedbackType: string
    comment?: string | null
    createdAt?: Date | string
    finding: FindingCreateNestedOneWithoutFeedbacksInput
  }

  export type FindingFeedbackUncheckedCreateWithoutUserInput = {
    id?: string
    findingId: string
    feedbackType: string
    comment?: string | null
    createdAt?: Date | string
  }

  export type FindingFeedbackCreateOrConnectWithoutUserInput = {
    where: FindingFeedbackWhereUniqueInput
    create: XOR<FindingFeedbackCreateWithoutUserInput, FindingFeedbackUncheckedCreateWithoutUserInput>
  }

  export type FindingFeedbackCreateManyUserInputEnvelope = {
    data: FindingFeedbackCreateManyUserInput | FindingFeedbackCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FindingFeedbackUpsertWithWhereUniqueWithoutUserInput = {
    where: FindingFeedbackWhereUniqueInput
    update: XOR<FindingFeedbackUpdateWithoutUserInput, FindingFeedbackUncheckedUpdateWithoutUserInput>
    create: XOR<FindingFeedbackCreateWithoutUserInput, FindingFeedbackUncheckedCreateWithoutUserInput>
  }

  export type FindingFeedbackUpdateWithWhereUniqueWithoutUserInput = {
    where: FindingFeedbackWhereUniqueInput
    data: XOR<FindingFeedbackUpdateWithoutUserInput, FindingFeedbackUncheckedUpdateWithoutUserInput>
  }

  export type FindingFeedbackUpdateManyWithWhereWithoutUserInput = {
    where: FindingFeedbackScalarWhereInput
    data: XOR<FindingFeedbackUpdateManyMutationInput, FindingFeedbackUncheckedUpdateManyWithoutUserInput>
  }

  export type FindingFeedbackScalarWhereInput = {
    AND?: FindingFeedbackScalarWhereInput | FindingFeedbackScalarWhereInput[]
    OR?: FindingFeedbackScalarWhereInput[]
    NOT?: FindingFeedbackScalarWhereInput | FindingFeedbackScalarWhereInput[]
    id?: StringFilter<"FindingFeedback"> | string
    findingId?: StringFilter<"FindingFeedback"> | string
    userId?: StringFilter<"FindingFeedback"> | string
    feedbackType?: StringFilter<"FindingFeedback"> | string
    comment?: StringNullableFilter<"FindingFeedback"> | string | null
    createdAt?: DateTimeFilter<"FindingFeedback"> | Date | string
  }

  export type RepositoryCreateWithoutInstallationInput = {
    id?: string
    githubRepositoryId: number
    owner: string
    name: string
    defaultBranch?: string
    isEnabled?: boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    pullRequests?: PullRequestCreateNestedManyWithoutRepositoryInput
    reviewJobs?: ReviewJobCreateNestedManyWithoutRepositoryInput
  }

  export type RepositoryUncheckedCreateWithoutInstallationInput = {
    id?: string
    githubRepositoryId: number
    owner: string
    name: string
    defaultBranch?: string
    isEnabled?: boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    pullRequests?: PullRequestUncheckedCreateNestedManyWithoutRepositoryInput
    reviewJobs?: ReviewJobUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type RepositoryCreateOrConnectWithoutInstallationInput = {
    where: RepositoryWhereUniqueInput
    create: XOR<RepositoryCreateWithoutInstallationInput, RepositoryUncheckedCreateWithoutInstallationInput>
  }

  export type RepositoryCreateManyInstallationInputEnvelope = {
    data: RepositoryCreateManyInstallationInput | RepositoryCreateManyInstallationInput[]
    skipDuplicates?: boolean
  }

  export type RepositoryUpsertWithWhereUniqueWithoutInstallationInput = {
    where: RepositoryWhereUniqueInput
    update: XOR<RepositoryUpdateWithoutInstallationInput, RepositoryUncheckedUpdateWithoutInstallationInput>
    create: XOR<RepositoryCreateWithoutInstallationInput, RepositoryUncheckedCreateWithoutInstallationInput>
  }

  export type RepositoryUpdateWithWhereUniqueWithoutInstallationInput = {
    where: RepositoryWhereUniqueInput
    data: XOR<RepositoryUpdateWithoutInstallationInput, RepositoryUncheckedUpdateWithoutInstallationInput>
  }

  export type RepositoryUpdateManyWithWhereWithoutInstallationInput = {
    where: RepositoryScalarWhereInput
    data: XOR<RepositoryUpdateManyMutationInput, RepositoryUncheckedUpdateManyWithoutInstallationInput>
  }

  export type RepositoryScalarWhereInput = {
    AND?: RepositoryScalarWhereInput | RepositoryScalarWhereInput[]
    OR?: RepositoryScalarWhereInput[]
    NOT?: RepositoryScalarWhereInput | RepositoryScalarWhereInput[]
    id?: StringFilter<"Repository"> | string
    githubRepositoryId?: IntFilter<"Repository"> | number
    installationId?: StringFilter<"Repository"> | string
    owner?: StringFilter<"Repository"> | string
    name?: StringFilter<"Repository"> | string
    defaultBranch?: StringFilter<"Repository"> | string
    isEnabled?: BoolFilter<"Repository"> | boolean
    reviewConfig?: JsonFilter<"Repository">
    createdAt?: DateTimeFilter<"Repository"> | Date | string
    updatedAt?: DateTimeFilter<"Repository"> | Date | string
  }

  export type GithubInstallationCreateWithoutRepositoriesInput = {
    id?: string
    githubInstallationId: number
    accountLogin: string
    accountType: string
    encryptedCredentialsRef?: string | null
    createdAt?: Date | string
  }

  export type GithubInstallationUncheckedCreateWithoutRepositoriesInput = {
    id?: string
    githubInstallationId: number
    accountLogin: string
    accountType: string
    encryptedCredentialsRef?: string | null
    createdAt?: Date | string
  }

  export type GithubInstallationCreateOrConnectWithoutRepositoriesInput = {
    where: GithubInstallationWhereUniqueInput
    create: XOR<GithubInstallationCreateWithoutRepositoriesInput, GithubInstallationUncheckedCreateWithoutRepositoriesInput>
  }

  export type PullRequestCreateWithoutRepositoryInput = {
    id?: string
    githubPrNumber: number
    title: string
    author: string
    baseSha: string
    headSha: string
    state?: string
    updatedAt?: Date | string
    reviewJobs?: ReviewJobCreateNestedManyWithoutPullRequestInput
  }

  export type PullRequestUncheckedCreateWithoutRepositoryInput = {
    id?: string
    githubPrNumber: number
    title: string
    author: string
    baseSha: string
    headSha: string
    state?: string
    updatedAt?: Date | string
    reviewJobs?: ReviewJobUncheckedCreateNestedManyWithoutPullRequestInput
  }

  export type PullRequestCreateOrConnectWithoutRepositoryInput = {
    where: PullRequestWhereUniqueInput
    create: XOR<PullRequestCreateWithoutRepositoryInput, PullRequestUncheckedCreateWithoutRepositoryInput>
  }

  export type PullRequestCreateManyRepositoryInputEnvelope = {
    data: PullRequestCreateManyRepositoryInput | PullRequestCreateManyRepositoryInput[]
    skipDuplicates?: boolean
  }

  export type ReviewJobCreateWithoutRepositoryInput = {
    id?: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    pullRequest: PullRequestCreateNestedOneWithoutReviewJobsInput
    agentRuns?: AgentRunCreateNestedManyWithoutReviewJobInput
    findings?: FindingCreateNestedManyWithoutReviewJobInput
  }

  export type ReviewJobUncheckedCreateWithoutRepositoryInput = {
    id?: string
    pullRequestId: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    agentRuns?: AgentRunUncheckedCreateNestedManyWithoutReviewJobInput
    findings?: FindingUncheckedCreateNestedManyWithoutReviewJobInput
  }

  export type ReviewJobCreateOrConnectWithoutRepositoryInput = {
    where: ReviewJobWhereUniqueInput
    create: XOR<ReviewJobCreateWithoutRepositoryInput, ReviewJobUncheckedCreateWithoutRepositoryInput>
  }

  export type ReviewJobCreateManyRepositoryInputEnvelope = {
    data: ReviewJobCreateManyRepositoryInput | ReviewJobCreateManyRepositoryInput[]
    skipDuplicates?: boolean
  }

  export type GithubInstallationUpsertWithoutRepositoriesInput = {
    update: XOR<GithubInstallationUpdateWithoutRepositoriesInput, GithubInstallationUncheckedUpdateWithoutRepositoriesInput>
    create: XOR<GithubInstallationCreateWithoutRepositoriesInput, GithubInstallationUncheckedCreateWithoutRepositoriesInput>
    where?: GithubInstallationWhereInput
  }

  export type GithubInstallationUpdateToOneWithWhereWithoutRepositoriesInput = {
    where?: GithubInstallationWhereInput
    data: XOR<GithubInstallationUpdateWithoutRepositoriesInput, GithubInstallationUncheckedUpdateWithoutRepositoriesInput>
  }

  export type GithubInstallationUpdateWithoutRepositoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubInstallationId?: IntFieldUpdateOperationsInput | number
    accountLogin?: StringFieldUpdateOperationsInput | string
    accountType?: StringFieldUpdateOperationsInput | string
    encryptedCredentialsRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GithubInstallationUncheckedUpdateWithoutRepositoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubInstallationId?: IntFieldUpdateOperationsInput | number
    accountLogin?: StringFieldUpdateOperationsInput | string
    accountType?: StringFieldUpdateOperationsInput | string
    encryptedCredentialsRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PullRequestUpsertWithWhereUniqueWithoutRepositoryInput = {
    where: PullRequestWhereUniqueInput
    update: XOR<PullRequestUpdateWithoutRepositoryInput, PullRequestUncheckedUpdateWithoutRepositoryInput>
    create: XOR<PullRequestCreateWithoutRepositoryInput, PullRequestUncheckedCreateWithoutRepositoryInput>
  }

  export type PullRequestUpdateWithWhereUniqueWithoutRepositoryInput = {
    where: PullRequestWhereUniqueInput
    data: XOR<PullRequestUpdateWithoutRepositoryInput, PullRequestUncheckedUpdateWithoutRepositoryInput>
  }

  export type PullRequestUpdateManyWithWhereWithoutRepositoryInput = {
    where: PullRequestScalarWhereInput
    data: XOR<PullRequestUpdateManyMutationInput, PullRequestUncheckedUpdateManyWithoutRepositoryInput>
  }

  export type PullRequestScalarWhereInput = {
    AND?: PullRequestScalarWhereInput | PullRequestScalarWhereInput[]
    OR?: PullRequestScalarWhereInput[]
    NOT?: PullRequestScalarWhereInput | PullRequestScalarWhereInput[]
    id?: StringFilter<"PullRequest"> | string
    repositoryId?: StringFilter<"PullRequest"> | string
    githubPrNumber?: IntFilter<"PullRequest"> | number
    title?: StringFilter<"PullRequest"> | string
    author?: StringFilter<"PullRequest"> | string
    baseSha?: StringFilter<"PullRequest"> | string
    headSha?: StringFilter<"PullRequest"> | string
    state?: StringFilter<"PullRequest"> | string
    updatedAt?: DateTimeFilter<"PullRequest"> | Date | string
  }

  export type ReviewJobUpsertWithWhereUniqueWithoutRepositoryInput = {
    where: ReviewJobWhereUniqueInput
    update: XOR<ReviewJobUpdateWithoutRepositoryInput, ReviewJobUncheckedUpdateWithoutRepositoryInput>
    create: XOR<ReviewJobCreateWithoutRepositoryInput, ReviewJobUncheckedCreateWithoutRepositoryInput>
  }

  export type ReviewJobUpdateWithWhereUniqueWithoutRepositoryInput = {
    where: ReviewJobWhereUniqueInput
    data: XOR<ReviewJobUpdateWithoutRepositoryInput, ReviewJobUncheckedUpdateWithoutRepositoryInput>
  }

  export type ReviewJobUpdateManyWithWhereWithoutRepositoryInput = {
    where: ReviewJobScalarWhereInput
    data: XOR<ReviewJobUpdateManyMutationInput, ReviewJobUncheckedUpdateManyWithoutRepositoryInput>
  }

  export type ReviewJobScalarWhereInput = {
    AND?: ReviewJobScalarWhereInput | ReviewJobScalarWhereInput[]
    OR?: ReviewJobScalarWhereInput[]
    NOT?: ReviewJobScalarWhereInput | ReviewJobScalarWhereInput[]
    id?: StringFilter<"ReviewJob"> | string
    repositoryId?: StringFilter<"ReviewJob"> | string
    pullRequestId?: StringFilter<"ReviewJob"> | string
    headSha?: StringFilter<"ReviewJob"> | string
    idempotencyKey?: StringFilter<"ReviewJob"> | string
    status?: StringFilter<"ReviewJob"> | string
    configVersion?: IntFilter<"ReviewJob"> | number
    startedAt?: DateTimeNullableFilter<"ReviewJob"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ReviewJob"> | Date | string | null
    errorCode?: StringNullableFilter<"ReviewJob"> | string | null
    errorMessage?: StringNullableFilter<"ReviewJob"> | string | null
    createdAt?: DateTimeFilter<"ReviewJob"> | Date | string
  }

  export type RepositoryCreateWithoutPullRequestsInput = {
    id?: string
    githubRepositoryId: number
    owner: string
    name: string
    defaultBranch?: string
    isEnabled?: boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    installation: GithubInstallationCreateNestedOneWithoutRepositoriesInput
    reviewJobs?: ReviewJobCreateNestedManyWithoutRepositoryInput
  }

  export type RepositoryUncheckedCreateWithoutPullRequestsInput = {
    id?: string
    githubRepositoryId: number
    installationId: string
    owner: string
    name: string
    defaultBranch?: string
    isEnabled?: boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewJobs?: ReviewJobUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type RepositoryCreateOrConnectWithoutPullRequestsInput = {
    where: RepositoryWhereUniqueInput
    create: XOR<RepositoryCreateWithoutPullRequestsInput, RepositoryUncheckedCreateWithoutPullRequestsInput>
  }

  export type ReviewJobCreateWithoutPullRequestInput = {
    id?: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    repository: RepositoryCreateNestedOneWithoutReviewJobsInput
    agentRuns?: AgentRunCreateNestedManyWithoutReviewJobInput
    findings?: FindingCreateNestedManyWithoutReviewJobInput
  }

  export type ReviewJobUncheckedCreateWithoutPullRequestInput = {
    id?: string
    repositoryId: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    agentRuns?: AgentRunUncheckedCreateNestedManyWithoutReviewJobInput
    findings?: FindingUncheckedCreateNestedManyWithoutReviewJobInput
  }

  export type ReviewJobCreateOrConnectWithoutPullRequestInput = {
    where: ReviewJobWhereUniqueInput
    create: XOR<ReviewJobCreateWithoutPullRequestInput, ReviewJobUncheckedCreateWithoutPullRequestInput>
  }

  export type ReviewJobCreateManyPullRequestInputEnvelope = {
    data: ReviewJobCreateManyPullRequestInput | ReviewJobCreateManyPullRequestInput[]
    skipDuplicates?: boolean
  }

  export type RepositoryUpsertWithoutPullRequestsInput = {
    update: XOR<RepositoryUpdateWithoutPullRequestsInput, RepositoryUncheckedUpdateWithoutPullRequestsInput>
    create: XOR<RepositoryCreateWithoutPullRequestsInput, RepositoryUncheckedCreateWithoutPullRequestsInput>
    where?: RepositoryWhereInput
  }

  export type RepositoryUpdateToOneWithWhereWithoutPullRequestsInput = {
    where?: RepositoryWhereInput
    data: XOR<RepositoryUpdateWithoutPullRequestsInput, RepositoryUncheckedUpdateWithoutPullRequestsInput>
  }

  export type RepositoryUpdateWithoutPullRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    installation?: GithubInstallationUpdateOneRequiredWithoutRepositoriesNestedInput
    reviewJobs?: ReviewJobUpdateManyWithoutRepositoryNestedInput
  }

  export type RepositoryUncheckedUpdateWithoutPullRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    installationId?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewJobs?: ReviewJobUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type ReviewJobUpsertWithWhereUniqueWithoutPullRequestInput = {
    where: ReviewJobWhereUniqueInput
    update: XOR<ReviewJobUpdateWithoutPullRequestInput, ReviewJobUncheckedUpdateWithoutPullRequestInput>
    create: XOR<ReviewJobCreateWithoutPullRequestInput, ReviewJobUncheckedCreateWithoutPullRequestInput>
  }

  export type ReviewJobUpdateWithWhereUniqueWithoutPullRequestInput = {
    where: ReviewJobWhereUniqueInput
    data: XOR<ReviewJobUpdateWithoutPullRequestInput, ReviewJobUncheckedUpdateWithoutPullRequestInput>
  }

  export type ReviewJobUpdateManyWithWhereWithoutPullRequestInput = {
    where: ReviewJobScalarWhereInput
    data: XOR<ReviewJobUpdateManyMutationInput, ReviewJobUncheckedUpdateManyWithoutPullRequestInput>
  }

  export type RepositoryCreateWithoutReviewJobsInput = {
    id?: string
    githubRepositoryId: number
    owner: string
    name: string
    defaultBranch?: string
    isEnabled?: boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    installation: GithubInstallationCreateNestedOneWithoutRepositoriesInput
    pullRequests?: PullRequestCreateNestedManyWithoutRepositoryInput
  }

  export type RepositoryUncheckedCreateWithoutReviewJobsInput = {
    id?: string
    githubRepositoryId: number
    installationId: string
    owner: string
    name: string
    defaultBranch?: string
    isEnabled?: boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    pullRequests?: PullRequestUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type RepositoryCreateOrConnectWithoutReviewJobsInput = {
    where: RepositoryWhereUniqueInput
    create: XOR<RepositoryCreateWithoutReviewJobsInput, RepositoryUncheckedCreateWithoutReviewJobsInput>
  }

  export type PullRequestCreateWithoutReviewJobsInput = {
    id?: string
    githubPrNumber: number
    title: string
    author: string
    baseSha: string
    headSha: string
    state?: string
    updatedAt?: Date | string
    repository: RepositoryCreateNestedOneWithoutPullRequestsInput
  }

  export type PullRequestUncheckedCreateWithoutReviewJobsInput = {
    id?: string
    repositoryId: string
    githubPrNumber: number
    title: string
    author: string
    baseSha: string
    headSha: string
    state?: string
    updatedAt?: Date | string
  }

  export type PullRequestCreateOrConnectWithoutReviewJobsInput = {
    where: PullRequestWhereUniqueInput
    create: XOR<PullRequestCreateWithoutReviewJobsInput, PullRequestUncheckedCreateWithoutReviewJobsInput>
  }

  export type AgentRunCreateWithoutReviewJobInput = {
    id?: string
    agentType: string
    status?: string
    modelProvider?: string | null
    modelName?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    durationMs?: number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    createdAt?: Date | string
    findings?: FindingCreateNestedManyWithoutAgentRunInput
  }

  export type AgentRunUncheckedCreateWithoutReviewJobInput = {
    id?: string
    agentType: string
    status?: string
    modelProvider?: string | null
    modelName?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    durationMs?: number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    createdAt?: Date | string
    findings?: FindingUncheckedCreateNestedManyWithoutAgentRunInput
  }

  export type AgentRunCreateOrConnectWithoutReviewJobInput = {
    where: AgentRunWhereUniqueInput
    create: XOR<AgentRunCreateWithoutReviewJobInput, AgentRunUncheckedCreateWithoutReviewJobInput>
  }

  export type AgentRunCreateManyReviewJobInputEnvelope = {
    data: AgentRunCreateManyReviewJobInput | AgentRunCreateManyReviewJobInput[]
    skipDuplicates?: boolean
  }

  export type FindingCreateWithoutReviewJobInput = {
    id?: string
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
    agentRun?: AgentRunCreateNestedOneWithoutFindingsInput
    feedbacks?: FindingFeedbackCreateNestedManyWithoutFindingInput
  }

  export type FindingUncheckedCreateWithoutReviewJobInput = {
    id?: string
    agentRunId?: string | null
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
    feedbacks?: FindingFeedbackUncheckedCreateNestedManyWithoutFindingInput
  }

  export type FindingCreateOrConnectWithoutReviewJobInput = {
    where: FindingWhereUniqueInput
    create: XOR<FindingCreateWithoutReviewJobInput, FindingUncheckedCreateWithoutReviewJobInput>
  }

  export type FindingCreateManyReviewJobInputEnvelope = {
    data: FindingCreateManyReviewJobInput | FindingCreateManyReviewJobInput[]
    skipDuplicates?: boolean
  }

  export type RepositoryUpsertWithoutReviewJobsInput = {
    update: XOR<RepositoryUpdateWithoutReviewJobsInput, RepositoryUncheckedUpdateWithoutReviewJobsInput>
    create: XOR<RepositoryCreateWithoutReviewJobsInput, RepositoryUncheckedCreateWithoutReviewJobsInput>
    where?: RepositoryWhereInput
  }

  export type RepositoryUpdateToOneWithWhereWithoutReviewJobsInput = {
    where?: RepositoryWhereInput
    data: XOR<RepositoryUpdateWithoutReviewJobsInput, RepositoryUncheckedUpdateWithoutReviewJobsInput>
  }

  export type RepositoryUpdateWithoutReviewJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    installation?: GithubInstallationUpdateOneRequiredWithoutRepositoriesNestedInput
    pullRequests?: PullRequestUpdateManyWithoutRepositoryNestedInput
  }

  export type RepositoryUncheckedUpdateWithoutReviewJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    installationId?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pullRequests?: PullRequestUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type PullRequestUpsertWithoutReviewJobsInput = {
    update: XOR<PullRequestUpdateWithoutReviewJobsInput, PullRequestUncheckedUpdateWithoutReviewJobsInput>
    create: XOR<PullRequestCreateWithoutReviewJobsInput, PullRequestUncheckedCreateWithoutReviewJobsInput>
    where?: PullRequestWhereInput
  }

  export type PullRequestUpdateToOneWithWhereWithoutReviewJobsInput = {
    where?: PullRequestWhereInput
    data: XOR<PullRequestUpdateWithoutReviewJobsInput, PullRequestUncheckedUpdateWithoutReviewJobsInput>
  }

  export type PullRequestUpdateWithoutReviewJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubPrNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    baseSha?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repository?: RepositoryUpdateOneRequiredWithoutPullRequestsNestedInput
  }

  export type PullRequestUncheckedUpdateWithoutReviewJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    githubPrNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    baseSha?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunUpsertWithWhereUniqueWithoutReviewJobInput = {
    where: AgentRunWhereUniqueInput
    update: XOR<AgentRunUpdateWithoutReviewJobInput, AgentRunUncheckedUpdateWithoutReviewJobInput>
    create: XOR<AgentRunCreateWithoutReviewJobInput, AgentRunUncheckedCreateWithoutReviewJobInput>
  }

  export type AgentRunUpdateWithWhereUniqueWithoutReviewJobInput = {
    where: AgentRunWhereUniqueInput
    data: XOR<AgentRunUpdateWithoutReviewJobInput, AgentRunUncheckedUpdateWithoutReviewJobInput>
  }

  export type AgentRunUpdateManyWithWhereWithoutReviewJobInput = {
    where: AgentRunScalarWhereInput
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyWithoutReviewJobInput>
  }

  export type AgentRunScalarWhereInput = {
    AND?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
    OR?: AgentRunScalarWhereInput[]
    NOT?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
    id?: StringFilter<"AgentRun"> | string
    reviewJobId?: StringFilter<"AgentRun"> | string
    agentType?: StringFilter<"AgentRun"> | string
    status?: StringFilter<"AgentRun"> | string
    modelProvider?: StringNullableFilter<"AgentRun"> | string | null
    modelName?: StringNullableFilter<"AgentRun"> | string | null
    inputTokens?: IntNullableFilter<"AgentRun"> | number | null
    outputTokens?: IntNullableFilter<"AgentRun"> | number | null
    durationMs?: IntNullableFilter<"AgentRun"> | number | null
    outputJson?: JsonNullableFilter<"AgentRun">
    errorMessage?: StringNullableFilter<"AgentRun"> | string | null
    createdAt?: DateTimeFilter<"AgentRun"> | Date | string
  }

  export type FindingUpsertWithWhereUniqueWithoutReviewJobInput = {
    where: FindingWhereUniqueInput
    update: XOR<FindingUpdateWithoutReviewJobInput, FindingUncheckedUpdateWithoutReviewJobInput>
    create: XOR<FindingCreateWithoutReviewJobInput, FindingUncheckedCreateWithoutReviewJobInput>
  }

  export type FindingUpdateWithWhereUniqueWithoutReviewJobInput = {
    where: FindingWhereUniqueInput
    data: XOR<FindingUpdateWithoutReviewJobInput, FindingUncheckedUpdateWithoutReviewJobInput>
  }

  export type FindingUpdateManyWithWhereWithoutReviewJobInput = {
    where: FindingScalarWhereInput
    data: XOR<FindingUpdateManyMutationInput, FindingUncheckedUpdateManyWithoutReviewJobInput>
  }

  export type FindingScalarWhereInput = {
    AND?: FindingScalarWhereInput | FindingScalarWhereInput[]
    OR?: FindingScalarWhereInput[]
    NOT?: FindingScalarWhereInput | FindingScalarWhereInput[]
    id?: StringFilter<"Finding"> | string
    reviewJobId?: StringFilter<"Finding"> | string
    agentRunId?: StringNullableFilter<"Finding"> | string | null
    fingerprint?: StringFilter<"Finding"> | string
    title?: StringFilter<"Finding"> | string
    category?: StringFilter<"Finding"> | string
    severity?: StringFilter<"Finding"> | string
    confidence?: FloatFilter<"Finding"> | number
    filePath?: StringFilter<"Finding"> | string
    line?: IntFilter<"Finding"> | number
    endLine?: IntNullableFilter<"Finding"> | number | null
    description?: StringFilter<"Finding"> | string
    evidence?: StringFilter<"Finding"> | string
    recommendation?: StringNullableFilter<"Finding"> | string | null
    verificationStatus?: StringFilter<"Finding"> | string
    publicationStatus?: StringFilter<"Finding"> | string
    githubCommentId?: StringNullableFilter<"Finding"> | string | null
    createdAt?: DateTimeFilter<"Finding"> | Date | string
  }

  export type ReviewJobCreateWithoutAgentRunsInput = {
    id?: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    repository: RepositoryCreateNestedOneWithoutReviewJobsInput
    pullRequest: PullRequestCreateNestedOneWithoutReviewJobsInput
    findings?: FindingCreateNestedManyWithoutReviewJobInput
  }

  export type ReviewJobUncheckedCreateWithoutAgentRunsInput = {
    id?: string
    repositoryId: string
    pullRequestId: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    findings?: FindingUncheckedCreateNestedManyWithoutReviewJobInput
  }

  export type ReviewJobCreateOrConnectWithoutAgentRunsInput = {
    where: ReviewJobWhereUniqueInput
    create: XOR<ReviewJobCreateWithoutAgentRunsInput, ReviewJobUncheckedCreateWithoutAgentRunsInput>
  }

  export type FindingCreateWithoutAgentRunInput = {
    id?: string
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
    reviewJob: ReviewJobCreateNestedOneWithoutFindingsInput
    feedbacks?: FindingFeedbackCreateNestedManyWithoutFindingInput
  }

  export type FindingUncheckedCreateWithoutAgentRunInput = {
    id?: string
    reviewJobId: string
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
    feedbacks?: FindingFeedbackUncheckedCreateNestedManyWithoutFindingInput
  }

  export type FindingCreateOrConnectWithoutAgentRunInput = {
    where: FindingWhereUniqueInput
    create: XOR<FindingCreateWithoutAgentRunInput, FindingUncheckedCreateWithoutAgentRunInput>
  }

  export type FindingCreateManyAgentRunInputEnvelope = {
    data: FindingCreateManyAgentRunInput | FindingCreateManyAgentRunInput[]
    skipDuplicates?: boolean
  }

  export type ReviewJobUpsertWithoutAgentRunsInput = {
    update: XOR<ReviewJobUpdateWithoutAgentRunsInput, ReviewJobUncheckedUpdateWithoutAgentRunsInput>
    create: XOR<ReviewJobCreateWithoutAgentRunsInput, ReviewJobUncheckedCreateWithoutAgentRunsInput>
    where?: ReviewJobWhereInput
  }

  export type ReviewJobUpdateToOneWithWhereWithoutAgentRunsInput = {
    where?: ReviewJobWhereInput
    data: XOR<ReviewJobUpdateWithoutAgentRunsInput, ReviewJobUncheckedUpdateWithoutAgentRunsInput>
  }

  export type ReviewJobUpdateWithoutAgentRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repository?: RepositoryUpdateOneRequiredWithoutReviewJobsNestedInput
    pullRequest?: PullRequestUpdateOneRequiredWithoutReviewJobsNestedInput
    findings?: FindingUpdateManyWithoutReviewJobNestedInput
  }

  export type ReviewJobUncheckedUpdateWithoutAgentRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    pullRequestId?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    findings?: FindingUncheckedUpdateManyWithoutReviewJobNestedInput
  }

  export type FindingUpsertWithWhereUniqueWithoutAgentRunInput = {
    where: FindingWhereUniqueInput
    update: XOR<FindingUpdateWithoutAgentRunInput, FindingUncheckedUpdateWithoutAgentRunInput>
    create: XOR<FindingCreateWithoutAgentRunInput, FindingUncheckedCreateWithoutAgentRunInput>
  }

  export type FindingUpdateWithWhereUniqueWithoutAgentRunInput = {
    where: FindingWhereUniqueInput
    data: XOR<FindingUpdateWithoutAgentRunInput, FindingUncheckedUpdateWithoutAgentRunInput>
  }

  export type FindingUpdateManyWithWhereWithoutAgentRunInput = {
    where: FindingScalarWhereInput
    data: XOR<FindingUpdateManyMutationInput, FindingUncheckedUpdateManyWithoutAgentRunInput>
  }

  export type ReviewJobCreateWithoutFindingsInput = {
    id?: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    repository: RepositoryCreateNestedOneWithoutReviewJobsInput
    pullRequest: PullRequestCreateNestedOneWithoutReviewJobsInput
    agentRuns?: AgentRunCreateNestedManyWithoutReviewJobInput
  }

  export type ReviewJobUncheckedCreateWithoutFindingsInput = {
    id?: string
    repositoryId: string
    pullRequestId: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    agentRuns?: AgentRunUncheckedCreateNestedManyWithoutReviewJobInput
  }

  export type ReviewJobCreateOrConnectWithoutFindingsInput = {
    where: ReviewJobWhereUniqueInput
    create: XOR<ReviewJobCreateWithoutFindingsInput, ReviewJobUncheckedCreateWithoutFindingsInput>
  }

  export type AgentRunCreateWithoutFindingsInput = {
    id?: string
    agentType: string
    status?: string
    modelProvider?: string | null
    modelName?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    durationMs?: number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    createdAt?: Date | string
    reviewJob: ReviewJobCreateNestedOneWithoutAgentRunsInput
  }

  export type AgentRunUncheckedCreateWithoutFindingsInput = {
    id?: string
    reviewJobId: string
    agentType: string
    status?: string
    modelProvider?: string | null
    modelName?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    durationMs?: number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AgentRunCreateOrConnectWithoutFindingsInput = {
    where: AgentRunWhereUniqueInput
    create: XOR<AgentRunCreateWithoutFindingsInput, AgentRunUncheckedCreateWithoutFindingsInput>
  }

  export type FindingFeedbackCreateWithoutFindingInput = {
    id?: string
    feedbackType: string
    comment?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutFeedbacksInput
  }

  export type FindingFeedbackUncheckedCreateWithoutFindingInput = {
    id?: string
    userId: string
    feedbackType: string
    comment?: string | null
    createdAt?: Date | string
  }

  export type FindingFeedbackCreateOrConnectWithoutFindingInput = {
    where: FindingFeedbackWhereUniqueInput
    create: XOR<FindingFeedbackCreateWithoutFindingInput, FindingFeedbackUncheckedCreateWithoutFindingInput>
  }

  export type FindingFeedbackCreateManyFindingInputEnvelope = {
    data: FindingFeedbackCreateManyFindingInput | FindingFeedbackCreateManyFindingInput[]
    skipDuplicates?: boolean
  }

  export type ReviewJobUpsertWithoutFindingsInput = {
    update: XOR<ReviewJobUpdateWithoutFindingsInput, ReviewJobUncheckedUpdateWithoutFindingsInput>
    create: XOR<ReviewJobCreateWithoutFindingsInput, ReviewJobUncheckedCreateWithoutFindingsInput>
    where?: ReviewJobWhereInput
  }

  export type ReviewJobUpdateToOneWithWhereWithoutFindingsInput = {
    where?: ReviewJobWhereInput
    data: XOR<ReviewJobUpdateWithoutFindingsInput, ReviewJobUncheckedUpdateWithoutFindingsInput>
  }

  export type ReviewJobUpdateWithoutFindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repository?: RepositoryUpdateOneRequiredWithoutReviewJobsNestedInput
    pullRequest?: PullRequestUpdateOneRequiredWithoutReviewJobsNestedInput
    agentRuns?: AgentRunUpdateManyWithoutReviewJobNestedInput
  }

  export type ReviewJobUncheckedUpdateWithoutFindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    pullRequestId?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentRuns?: AgentRunUncheckedUpdateManyWithoutReviewJobNestedInput
  }

  export type AgentRunUpsertWithoutFindingsInput = {
    update: XOR<AgentRunUpdateWithoutFindingsInput, AgentRunUncheckedUpdateWithoutFindingsInput>
    create: XOR<AgentRunCreateWithoutFindingsInput, AgentRunUncheckedCreateWithoutFindingsInput>
    where?: AgentRunWhereInput
  }

  export type AgentRunUpdateToOneWithWhereWithoutFindingsInput = {
    where?: AgentRunWhereInput
    data: XOR<AgentRunUpdateWithoutFindingsInput, AgentRunUncheckedUpdateWithoutFindingsInput>
  }

  export type AgentRunUpdateWithoutFindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelProvider?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewJob?: ReviewJobUpdateOneRequiredWithoutAgentRunsNestedInput
  }

  export type AgentRunUncheckedUpdateWithoutFindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewJobId?: StringFieldUpdateOperationsInput | string
    agentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelProvider?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingFeedbackUpsertWithWhereUniqueWithoutFindingInput = {
    where: FindingFeedbackWhereUniqueInput
    update: XOR<FindingFeedbackUpdateWithoutFindingInput, FindingFeedbackUncheckedUpdateWithoutFindingInput>
    create: XOR<FindingFeedbackCreateWithoutFindingInput, FindingFeedbackUncheckedCreateWithoutFindingInput>
  }

  export type FindingFeedbackUpdateWithWhereUniqueWithoutFindingInput = {
    where: FindingFeedbackWhereUniqueInput
    data: XOR<FindingFeedbackUpdateWithoutFindingInput, FindingFeedbackUncheckedUpdateWithoutFindingInput>
  }

  export type FindingFeedbackUpdateManyWithWhereWithoutFindingInput = {
    where: FindingFeedbackScalarWhereInput
    data: XOR<FindingFeedbackUpdateManyMutationInput, FindingFeedbackUncheckedUpdateManyWithoutFindingInput>
  }

  export type FindingCreateWithoutFeedbacksInput = {
    id?: string
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
    reviewJob: ReviewJobCreateNestedOneWithoutFindingsInput
    agentRun?: AgentRunCreateNestedOneWithoutFindingsInput
  }

  export type FindingUncheckedCreateWithoutFeedbacksInput = {
    id?: string
    reviewJobId: string
    agentRunId?: string | null
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
  }

  export type FindingCreateOrConnectWithoutFeedbacksInput = {
    where: FindingWhereUniqueInput
    create: XOR<FindingCreateWithoutFeedbacksInput, FindingUncheckedCreateWithoutFeedbacksInput>
  }

  export type UserCreateWithoutFeedbacksInput = {
    id?: string
    email: string
    displayName: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutFeedbacksInput = {
    id?: string
    email: string
    displayName: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutFeedbacksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFeedbacksInput, UserUncheckedCreateWithoutFeedbacksInput>
  }

  export type FindingUpsertWithoutFeedbacksInput = {
    update: XOR<FindingUpdateWithoutFeedbacksInput, FindingUncheckedUpdateWithoutFeedbacksInput>
    create: XOR<FindingCreateWithoutFeedbacksInput, FindingUncheckedCreateWithoutFeedbacksInput>
    where?: FindingWhereInput
  }

  export type FindingUpdateToOneWithWhereWithoutFeedbacksInput = {
    where?: FindingWhereInput
    data: XOR<FindingUpdateWithoutFeedbacksInput, FindingUncheckedUpdateWithoutFeedbacksInput>
  }

  export type FindingUpdateWithoutFeedbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewJob?: ReviewJobUpdateOneRequiredWithoutFindingsNestedInput
    agentRun?: AgentRunUpdateOneWithoutFindingsNestedInput
  }

  export type FindingUncheckedUpdateWithoutFeedbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewJobId?: StringFieldUpdateOperationsInput | string
    agentRunId?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutFeedbacksInput = {
    update: XOR<UserUpdateWithoutFeedbacksInput, UserUncheckedUpdateWithoutFeedbacksInput>
    create: XOR<UserCreateWithoutFeedbacksInput, UserUncheckedCreateWithoutFeedbacksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFeedbacksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFeedbacksInput, UserUncheckedUpdateWithoutFeedbacksInput>
  }

  export type UserUpdateWithoutFeedbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutFeedbacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingFeedbackCreateManyUserInput = {
    id?: string
    findingId: string
    feedbackType: string
    comment?: string | null
    createdAt?: Date | string
  }

  export type FindingFeedbackUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    feedbackType?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finding?: FindingUpdateOneRequiredWithoutFeedbacksNestedInput
  }

  export type FindingFeedbackUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    findingId?: StringFieldUpdateOperationsInput | string
    feedbackType?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingFeedbackUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    findingId?: StringFieldUpdateOperationsInput | string
    feedbackType?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepositoryCreateManyInstallationInput = {
    id?: string
    githubRepositoryId: number
    owner: string
    name: string
    defaultBranch?: string
    isEnabled?: boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RepositoryUpdateWithoutInstallationInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pullRequests?: PullRequestUpdateManyWithoutRepositoryNestedInput
    reviewJobs?: ReviewJobUpdateManyWithoutRepositoryNestedInput
  }

  export type RepositoryUncheckedUpdateWithoutInstallationInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pullRequests?: PullRequestUncheckedUpdateManyWithoutRepositoryNestedInput
    reviewJobs?: ReviewJobUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type RepositoryUncheckedUpdateManyWithoutInstallationInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubRepositoryId?: IntFieldUpdateOperationsInput | number
    owner?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    reviewConfig?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PullRequestCreateManyRepositoryInput = {
    id?: string
    githubPrNumber: number
    title: string
    author: string
    baseSha: string
    headSha: string
    state?: string
    updatedAt?: Date | string
  }

  export type ReviewJobCreateManyRepositoryInput = {
    id?: string
    pullRequestId: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type PullRequestUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubPrNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    baseSha?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewJobs?: ReviewJobUpdateManyWithoutPullRequestNestedInput
  }

  export type PullRequestUncheckedUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubPrNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    baseSha?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewJobs?: ReviewJobUncheckedUpdateManyWithoutPullRequestNestedInput
  }

  export type PullRequestUncheckedUpdateManyWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    githubPrNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    baseSha?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewJobUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pullRequest?: PullRequestUpdateOneRequiredWithoutReviewJobsNestedInput
    agentRuns?: AgentRunUpdateManyWithoutReviewJobNestedInput
    findings?: FindingUpdateManyWithoutReviewJobNestedInput
  }

  export type ReviewJobUncheckedUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    pullRequestId?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentRuns?: AgentRunUncheckedUpdateManyWithoutReviewJobNestedInput
    findings?: FindingUncheckedUpdateManyWithoutReviewJobNestedInput
  }

  export type ReviewJobUncheckedUpdateManyWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    pullRequestId?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewJobCreateManyPullRequestInput = {
    id?: string
    repositoryId: string
    headSha: string
    idempotencyKey: string
    status?: string
    configVersion?: number
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type ReviewJobUpdateWithoutPullRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repository?: RepositoryUpdateOneRequiredWithoutReviewJobsNestedInput
    agentRuns?: AgentRunUpdateManyWithoutReviewJobNestedInput
    findings?: FindingUpdateManyWithoutReviewJobNestedInput
  }

  export type ReviewJobUncheckedUpdateWithoutPullRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentRuns?: AgentRunUncheckedUpdateManyWithoutReviewJobNestedInput
    findings?: FindingUncheckedUpdateManyWithoutReviewJobNestedInput
  }

  export type ReviewJobUncheckedUpdateManyWithoutPullRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    headSha?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    configVersion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunCreateManyReviewJobInput = {
    id?: string
    agentType: string
    status?: string
    modelProvider?: string | null
    modelName?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    durationMs?: number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type FindingCreateManyReviewJobInput = {
    id?: string
    agentRunId?: string | null
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
  }

  export type AgentRunUpdateWithoutReviewJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelProvider?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    findings?: FindingUpdateManyWithoutAgentRunNestedInput
  }

  export type AgentRunUncheckedUpdateWithoutReviewJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelProvider?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    findings?: FindingUncheckedUpdateManyWithoutAgentRunNestedInput
  }

  export type AgentRunUncheckedUpdateManyWithoutReviewJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelProvider?: NullableStringFieldUpdateOperationsInput | string | null
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    outputJson?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingUpdateWithoutReviewJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentRun?: AgentRunUpdateOneWithoutFindingsNestedInput
    feedbacks?: FindingFeedbackUpdateManyWithoutFindingNestedInput
  }

  export type FindingUncheckedUpdateWithoutReviewJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentRunId?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedbacks?: FindingFeedbackUncheckedUpdateManyWithoutFindingNestedInput
  }

  export type FindingUncheckedUpdateManyWithoutReviewJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentRunId?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingCreateManyAgentRunInput = {
    id?: string
    reviewJobId: string
    fingerprint: string
    title: string
    category: string
    severity: string
    confidence: number
    filePath: string
    line: number
    endLine?: number | null
    description: string
    evidence: string
    recommendation?: string | null
    verificationStatus?: string
    publicationStatus?: string
    githubCommentId?: string | null
    createdAt?: Date | string
  }

  export type FindingUpdateWithoutAgentRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewJob?: ReviewJobUpdateOneRequiredWithoutFindingsNestedInput
    feedbacks?: FindingFeedbackUpdateManyWithoutFindingNestedInput
  }

  export type FindingUncheckedUpdateWithoutAgentRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewJobId?: StringFieldUpdateOperationsInput | string
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedbacks?: FindingFeedbackUncheckedUpdateManyWithoutFindingNestedInput
  }

  export type FindingUncheckedUpdateManyWithoutAgentRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewJobId?: StringFieldUpdateOperationsInput | string
    fingerprint?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    filePath?: StringFieldUpdateOperationsInput | string
    line?: IntFieldUpdateOperationsInput | number
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    publicationStatus?: StringFieldUpdateOperationsInput | string
    githubCommentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingFeedbackCreateManyFindingInput = {
    id?: string
    userId: string
    feedbackType: string
    comment?: string | null
    createdAt?: Date | string
  }

  export type FindingFeedbackUpdateWithoutFindingInput = {
    id?: StringFieldUpdateOperationsInput | string
    feedbackType?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFeedbacksNestedInput
  }

  export type FindingFeedbackUncheckedUpdateWithoutFindingInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    feedbackType?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingFeedbackUncheckedUpdateManyWithoutFindingInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    feedbackType?: StringFieldUpdateOperationsInput | string
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GithubInstallationCountOutputTypeDefaultArgs instead
     */
    export type GithubInstallationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GithubInstallationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RepositoryCountOutputTypeDefaultArgs instead
     */
    export type RepositoryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RepositoryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PullRequestCountOutputTypeDefaultArgs instead
     */
    export type PullRequestCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PullRequestCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReviewJobCountOutputTypeDefaultArgs instead
     */
    export type ReviewJobCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReviewJobCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AgentRunCountOutputTypeDefaultArgs instead
     */
    export type AgentRunCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgentRunCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FindingCountOutputTypeDefaultArgs instead
     */
    export type FindingCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FindingCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GithubInstallationDefaultArgs instead
     */
    export type GithubInstallationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GithubInstallationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RepositoryDefaultArgs instead
     */
    export type RepositoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RepositoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PullRequestDefaultArgs instead
     */
    export type PullRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PullRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WebhookDeliveryDefaultArgs instead
     */
    export type WebhookDeliveryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WebhookDeliveryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReviewJobDefaultArgs instead
     */
    export type ReviewJobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReviewJobDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AgentRunDefaultArgs instead
     */
    export type AgentRunArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgentRunDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FindingDefaultArgs instead
     */
    export type FindingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FindingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FindingFeedbackDefaultArgs instead
     */
    export type FindingFeedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FindingFeedbackDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FixProposalDefaultArgs instead
     */
    export type FixProposalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FixProposalDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}