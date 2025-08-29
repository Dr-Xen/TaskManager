'use server';

/**
 * @fileOverview An AI agent that suggests task priorities based on deadlines and importance.
 *
 * - suggestTaskPriorities - A function that suggests task priorities.
 * - SuggestTaskPrioritiesInput - The input type for the suggestTaskPriorities function.
 * - SuggestTaskPrioritiesOutput - The return type for the suggestTaskPriorities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskPrioritiesInputSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().describe('The title of the task.'),
      dueDate: z.string().describe('The due date of the task (ISO format).'),
      priority: z.enum(['high', 'medium', 'low']).describe('The priority level of the task.'),
      category: z.string().describe('The category of the task.'),
    })
  ).describe('A list of tasks to prioritize.'),
});

export type SuggestTaskPrioritiesInput = z.infer<typeof SuggestTaskPrioritiesInputSchema>;

const SuggestTaskPrioritiesOutputSchema = z.object({
  prioritizedTasks: z.array(
    z.object({
      title: z.string().describe('The title of the task.'),
      reason: z.string().describe('The reason for the prioritization.'),
    })
  ).describe('A list of tasks with prioritization reasons.'),
});

export type SuggestTaskPrioritiesOutput = z.infer<typeof SuggestTaskPrioritiesOutputSchema>;

export async function suggestTaskPriorities(input: SuggestTaskPrioritiesInput): Promise<SuggestTaskPrioritiesOutput> {
  return suggestTaskPrioritiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskPrioritiesPrompt',
  input: {schema: SuggestTaskPrioritiesInputSchema},
  output: {schema: SuggestTaskPrioritiesOutputSchema},
  prompt: `You are a personal assistant that suggests which tasks a user should prioritize.

  Given the following list of tasks, provide a prioritized list of tasks with a reason for each prioritization.

  Tasks:
  {{#each tasks}}
  - Title: {{title}}, Due Date: {{dueDate}}, Priority: {{priority}}, Category: {{category}}
  {{/each}}

  Prioritized Tasks:
  `,
});

const suggestTaskPrioritiesFlow = ai.defineFlow(
  {
    name: 'suggestTaskPrioritiesFlow',
    inputSchema: SuggestTaskPrioritiesInputSchema,
    outputSchema: SuggestTaskPrioritiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
