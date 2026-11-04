import { runSpecialisedAgent, type AgentReviewContext, type AgentExecutionOptions, type AgentRunResult } from "./base-agent.js";
import { errorHandlingAgentDefinition } from "./agent-definitions.js";

export async function runErrorHandlingReviewAgent(
  context: AgentReviewContext,
  options?: AgentExecutionOptions
): Promise<AgentRunResult> {
  return runSpecialisedAgent(errorHandlingAgentDefinition, context, options);
}
