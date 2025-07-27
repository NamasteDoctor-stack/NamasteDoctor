import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Gemini Proxy Worker', () => {
	it('handles basic message requests', async () => {
		const request = new Request('http://example.com', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: 'Hello' })
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
	});

	it('handles grounding search requests', async () => {
		const request = new Request('http://example.com', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ 
				message: 'What is the latest research on adolescent sexual health?',
				useGrounding: true,
				groundingConfig: {
					enableWebSearch: true
				}
			})
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
	});

	it('returns error for invalid JSON', async () => {
		const request = new Request('http://example.com', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: 'invalid json'
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(400);
	});

	it('returns error for missing message', async () => {
		const request = new Request('http://example.com', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({})
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(400);
	});
});
