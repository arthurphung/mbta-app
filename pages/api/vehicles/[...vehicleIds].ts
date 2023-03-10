// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const eventSource = require('eventsource');

type Data = {
  data: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { vehicleIds } = req.query as { vehicleIds: Array<string> };
    console.log(vehicleIds);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
    });

    const events: Array<string> = ['reset', 'add', 'update', 'remove'];

    try {
        const vehiclesSource = new eventSource(`${process.env.CONNECTION_STRING}/vehicles?filter\[id\]=${vehicleIds}`, 
            {
                headers: {
                    'Accept': 'text/event-stream',
                    'X-API-KEY': `${process.env.API_KEY}`
                }
            }
        );

        for (const event of events) {
            vehiclesSource.addEventListener(event, (e: Data) => {
                const { data } = e;
                res.write(`event: ${event}\ndata: ${data}\n\n`);
            })
        };

        req.on('close', () => {
            for (const event of events) {
                vehiclesSource.removeEventListener(event, (e: Data) => {});
            }
        })
    } catch (error) {
        console.log(error);
    }
}
