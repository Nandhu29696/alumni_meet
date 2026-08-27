import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from '../services/api';

afterEach(() => vi.restoreAllMocks());

describe('API client', () => {
  it('sends credentialed requests and returns JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) }));
    await expect(apiRequest('/events/')).resolves.toEqual({ results: [] });
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/events/', expect.objectContaining({ credentials: 'include' }));
  });

  it('surfaces API error details', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ detail: 'Unauthorized' }) }));
    await expect(apiRequest('/auth/profile/')).rejects.toThrow('Unauthorized');
  });
});
