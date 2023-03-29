// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MessageFromSW } from '@/core/CSW';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MessageFromSW>
) {

  const names = [
    "John Doe",
    "Jane Doe",
    "John Smith",
    "Jane Smith",
    "Adam Smith",
    "Eve Smith",
    "Adam Doe",
    "Eve Doe",
  ]

  const name = names[Math.floor(Math.random() * names.length)];

  res.status(200).json({ id:"1", data: name })
}
