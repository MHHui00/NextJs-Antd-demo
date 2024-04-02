// pages/api/getFundDetails.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req, res) {
  if (req.method === 'POST') {
    // const { fid, userId } = req.body;
    const fid = req.nextUrl.searchParams.get("fid");
    const userId = req.nextUrl.searchParams.get("userId");

    try {
      // Query the database using Prisma
      const record = await prisma.zhangben.findUnique({
        where: {
          // Assuming fid and userId combination is unique
          fid_uid: {
            fid: fid,
            uid: +userId,
          },
        },
        select: {
          fenshu: true,
          yuanjia: true,
        },
      });


      if (record) {
        // res.status(200).json(record);
        // console.log(record);
        return new Response(JSON.stringify({record}), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          })
      } else {
        // Record not found - you might choose to handle this differently
        // res.status(500).json({ message: "No records found for the given fid and userId." });
        return new Response(JSON.stringify({ message: "No records found for the given fid and userId." }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          })
      }
    } catch (error) {
      console.error('Database query failed', error);
    //   res.status(500).json({ message: 'Internal Server Error' });
      return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } else {
    // Method Not Allowed
    // res.setHeader('Allow', ['POST']);
    // res.status(405).end(`Method ${req.method} Not Allowed`);
    return new Response(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    
  }
}
