// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const eventSource = require('eventsource');

type Data = {
  data: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { stopId } = req.query;
    res.writeHead(200, {
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    const events: Array<string> = ['reset', 'add', 'update', 'remove'];

    try {
        const predictionsSource = new eventSource(`${process.env.CONNECTION_STRING}/predictions?filter%5Bstop%5D=${stopId}`, 
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
                res.write(`data: {time": asd}\n\n`);
            })
        };

        // req.on('close', () => {
        //     for (const event of events) {
        //         predictionsSource.removeEventListener(event, (e: Data) => {});
        //     }
        // })
    } catch (error) {
        console.log(error);
    }
}
