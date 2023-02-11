// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { routeId } = req.query as { routeId: Array<string> };

  const stopsRes = await fetch(`${process.env.CONNECTION_STRING}/stops?filter\[route\]=${routeId}`);
  const stopsData = await stopsRes.json();
  
  res.status(200).json(stopsData);
}
