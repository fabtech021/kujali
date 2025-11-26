import { AddNoteToBudgetCommand } from './add-note.command';
import { AddNoteToBudgetResult } from './add-note.result';

/**
 * Minimal handler shape following FunctionHandler style expected by repo.
 * Replace or adapt FunctionHandler import if project exposes it.
 */
export abstract class ICommandHandler<TCommand, TResult> {
  abstract execute(command: TCommand, toolkit?: any): Promise<TResult>;
}

export class AddNoteToBudgetHandler implements ICommandHandler<AddNoteToBudgetCommand, AddNoteToBudgetResult> {
  async execute(command: AddNoteToBudgetCommand, toolkit?: any): Promise<AddNoteToBudgetResult> {
    // Basic validation
    if (!command) return { success: false, message: 'No command provided' };
    if (!command.budgetId || !command.budgetId.trim()) {
      return { success: false, message: 'Budget ID is required' };
    }
    if (!command.content || !command.content.trim()) {
      return { success: false, message: 'Note content cannot be empty' };
    }

    // Get repository from toolkit if provided (pattern used in repo)
    const repo = toolkit?.getRepository ? toolkit.getRepository('budget-notes') : null;

    // Fallback: If repo not provided, simulate persistence interface
    if (!repo || typeof repo.addNote !== 'function') {
      // Optionally throw or return failure; here we return a result describing missing repo.
      return { success: false, message: 'Repository not available (getRepository missing).' };
    }

    // Prepare note payload
    const payload = {
      budgetId: command.budgetId,
      content: command.content,
      createdBy: command.createdBy ?? 'system',
      createdAt: new Date().toISOString(),
    };

    // Persist
    try {
      const saved = await repo.addNote(payload);
      // Expect saved to contain an id, if not, return generic success
      return { success: true, id: saved?.id, message: 'Note added' };
    } catch (err: any) {
      return { success: false, message: `Failed to add note: ${err?.message ?? err}` };
    }
  }
}
