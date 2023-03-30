// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    const { vehicleId } = req.query as { vehicleId: string };
    const routesRes = await fetch(`${process.env.CONNECTION_STRING}/trips/${vehicleId}`);
    const { data } = await routesRes.json();
  
    res.status(200).json(data);
}
