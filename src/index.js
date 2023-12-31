import { Ai } from '@cloudflare/ai';
import { Hono } from 'hono';

import template from "./template.html";
import streamingTemplate from "./template-streaming.html";

const app = new Hono();

app.get("/", (c) => c.html(streamingTemplate));
app.get("/b", (c) => c.html(template));

app.get('/stream', async c => {
	const ai = new Ai(c.env.AI);

	const query = c.req.query("query");

	const messages = [
		{
			role: "system",
			content: "You are rude assistant"
		},
		{
			role: "user",
			content: query || "Hello"
		}
	]
	const stream = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages, stream: true });

	return new Response(stream, { headers: { "content-type": "text/event-stream" } });
})

app.post('/', async c => {
	const ai = new Ai(c.env.AI);

	const messages = [
		{
			role: "system",
			content: "You are rude assistant"
		},
		{
			role: "user",
			content: body.query || "Hello"
		}
	]
	const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages });

	return c.text(response.response)
});

export default app