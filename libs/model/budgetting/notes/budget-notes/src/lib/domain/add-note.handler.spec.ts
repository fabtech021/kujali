import { AddNoteToBudgetHandler } from './add-note.handler';
import { AddNoteToBudgetCommand } from './add-note.command';

describe('AddNoteToBudgetHandler', () => {
  it('returns validation error for empty content', async () => {
    const handler = new AddNoteToBudgetHandler();
    const result = await handler.execute(new AddNoteToBudgetCommand('budget-1', '   '));
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/cannot be empty/i);
  });
});
