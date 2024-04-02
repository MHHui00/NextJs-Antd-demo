import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req, res) {
  if (req.method === 'POST') {
    // const { fid, uid, newNum, newCost } = req.body;
    const fid = req.nextUrl.searchParams.get("fid");
    const uid = Number(req.nextUrl.searchParams.get("userId"));
    const newNum = Number(req.nextUrl.searchParams.get("newNum"));
    const newCost = Number(req.nextUrl.searchParams.get("newCost"));

    try {
      // 首先尝试在zhangben表中查找是否存在记录
      const existingRecord = await prisma.zhangben.findUnique({
        where: {
          fid_uid: {
            fid: fid,
            uid: uid,
          },
        },
      });

      if (existingRecord) {
        // 如果找到记录，更新该记录
        const updatedRecord = await prisma.zhangben.update({
          where: {
            fid_uid: {
              fid: fid,
              uid: uid,
            },
          },
          data: {
            fenshu: newNum,
            yuanjia: newCost,
          },
        });
        // return res.status(200).json(updatedRecord);
        return new Response(JSON.stringify({...updatedRecord, message: '提交成功'}), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } else {
        // 如果没有找到记录，从flist表查询fundName
        const fund = await prisma.flist.findUnique({
          where: {
            fid: fid,
          },
          select: {
            name: true,
          },
        });

        if (!fund) {
          //   return res.status(404).json({ message: '基金未找到' });
          return new Response(JSON.stringify({ message: '基金未找到' }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }

        // 将数据插入到zhangben表
        const insertedRecord = await prisma.zhangben.create({
          data: {
            fid: fid,
            uid: uid, // 添加uid作为插入数据的一部分
            name: fund.name,
            fenshu: newNum,
            yuanjia: newCost,
          },
        });
        // return res.status(200).json(insertedRecord);
        return new Response(JSON.stringify({...insertedRecord, message: '提交成功'}), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('数据库操作失败', error);
      // res.status(500).json({ message: '服务器内部错误' });
      return new Response(JSON.stringify({ message: '服务器内部错误' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } else {
    // res.setHeader('Allow', ['POST']);
    // res.status(405).end(`方法 ${req.method} 不被允许`);
    return new Response(JSON.stringify({ message: `方法 ${req.method} 不被允许` }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
