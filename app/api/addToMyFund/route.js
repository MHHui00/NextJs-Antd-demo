import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req, res) {
  if (req.method === 'POST') {
    try {
      // const { fid, userId, fundName } = req.body;
      const fid = req.nextUrl.searchParams.get("fid");
      const userId = req.nextUrl.searchParams.get("userId");
      const fundName = req.nextUrl.searchParams.get("fundName");

      console.log(fid, userId, fundName);  //undefined undefined undefined
      if (!fid) {
        // return res.status(400).json({ message: 'Missing fid parameter' });
        return new Response(JSON.stringify({ message: '获取基金id失败' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
      if (!userId) {
        // return res.status(400).json({ message: 'Missing userId parameter' });
        return new Response(JSON.stringify({ message: '获取用户id失败' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      // 检查 fid 是否已存在于 zixuan 表中
      const existingEntry = await prisma.zixuan.findUnique({
        where: {
          fid_uid: {
            fid: fid,
            uid: +userId,
          },
        },
      });

      if (existingEntry) {
        // return res.status(409).json({ message: 'Fund already added to the list' });
        return new Response(JSON.stringify({ message: '自选列表已存在该基金' }), {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      // 在 fdata 表中查找 fid 对应的数据
      const fundData = await prisma.fdata.findUnique({
        where: {
          fid: fid,
        },
      });

      if (!fundData) {
        // return res.status(404).json({ message: 'Fund data not found' });
        return new Response(JSON.stringify({ message: '找不到该基金的历史数据' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }


      // 将数据插入 zixuan 表
      await prisma.zixuan.create({
        data: {
          // 假设 zixuan 表和 fdata 表的结构是一致的
          // 你可能需要根据实际情况调整这里的数据字段
          fid: fundData.fid,
          name: fundName,
          uid: +userId,
          // 其他需要插入的字段...
        },
      });
      return new Response(JSON.stringify({ message: '已添加至自选基金' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Failed to add fund to the list', error);
      return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } else {
    return new Response(JSON.stringify({ message: 'Only POST requests are allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
