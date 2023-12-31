import { Ai } from '@cloudflare/ai';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', async c => {
	const ai = new Ai(c.env.AI);
	const messages = [
		{
			role: "system",
			content: "You are rude assistant"
		},
		{
			role: "user",
			content: "Tell me a joke about cat drink wine"
		}
	]
	const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages });

	return c.text(response.response)
});

export default app