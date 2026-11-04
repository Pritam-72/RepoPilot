import { runSpecialisedAgent, type AgentReviewContext, type AgentExecutionOptions, type AgentRunResult } from "./base-agent.js";
import { testCoverageAgentDefinition } from "./agent-definitions.js";

export async function runTestCoverageReviewAgent(
  context: AgentReviewContext,
  options?: AgentExecutionOptions
): Promise<AgentRunResult> {
  return runSpecialisedAgent(testCoverageAgentDefinition, context, options);
}
