// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const eventSource = require('eventsource');

type Data = {
  data: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { slug } = req.query as { slug: Array<string> };
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
    });

    const events: Array<string> = ['reset', 'add', 'update', 'remove'];

    try {
        const predictionsSource = new eventSource(`${process.env.CONNECTION_STRING}/vehicles?filter\{id\}=${slug[0]}`, 
            {
                headers: {
                    'Accept': 'text/event-stream',
                    'X-API-KEY': `${process.env.API_KEY}`
                }
            }
        );

        for (const event of events) {
            predictionsSource.addEventListener(event, (e: Data) => {
                const { data } = e;
                console.log(data);
                res.write(`event: ${event}\ndata: ${data}\n\n`);
            })
        };

        req.on('close', () => {
            for (const event of events) {
                predictionsSource.removeEventListener(event, (e: Data) => {});
            }
        })
    } catch (error) {
        console.log(error);
    }
}
