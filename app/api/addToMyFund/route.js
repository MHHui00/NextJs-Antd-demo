import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic'; // 强制动态渲染
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

      console.log(fundData);
      const a = {
        fid: '000076',
        w01: -1.68,
        w02: -3.149999999999999,
        w03: 1.39,
        w04: 8.91,
        M01: 5.470000000000001,
        w05: -0.3300000000000001,
        w06: -6.07,
        w07: -6.959999999999999,
        w08: 1.99,
        M02: -11.37,
        name: '海富通先进制造股票C',
        Value: 0.9816,
        Rate: -0.62,
        R01: -0.3,
        R02: 0.69,
        R03: -0.08,
        R04: -2.65,
        R05: 0.66,
        R06: -2.38,
        R07: -1.9,
        R08: 0.34,
        R09: 1.27,
        R10: -0.48,
        R11: 0.4,
        R12: 1.01,
        R13: 1.85,
        R14: -1.28,
        R15: -0.59,
        R16: 1.2,
        R17: 2.48,
        R18: 4.66,
        R19: 2.51,
        R20: -1.94,
        R21: -0.67,
        R22: -2.39,
        R23: 2.65,
        R24: -0.4699999999999999,
        R25: 0.55,
        R26: 0.09,
        R27: 1.69,
        R28: -2.6,
        R29: -3.52,
        R30: -1.73,
        R31: -1.86,
        R32: -1.42,
        R33: -1.23,
        R34: -1.27,
        R35: -1.18,
        R36: 1.14,
        R37: -0.85,
        R38: -0.9200000000000002,
        R39: 2.13,
        R40: 0.49,
        pinyin: null,
        bh: null
      }
      // 将数据插入 zixuan 表
      await prisma.zixuan.create({
        data: {
          // 假设 zixuan 表和 fdata 表的结构是一致的
          // 你可能需要根据实际情况调整这里的数据字段
          fid: fundData.fid,
          w01: fundData.w01,
          w02: fundData.w02,
          w03: fundData.w03,
          w04: fundData.w04,
          M01: fundData.M01,
          w05: fundData.w05,
          w06: fundData.w06,
          w07: fundData.w07,
          w08: fundData.w08,
          M02: fundData.M02,
          Value: fundData.Value,
          Rate: fundData.Rate,
          R01: fundData.R01,
          R02: fundData.R02,
          R03: fundData.R03,
          R04: fundData.R04,
          R05: fundData.R05,
          R06: fundData.R06,
          R07: fundData.R07,
          R08: fundData.R08,
          R09: fundData.R09,
          R10: fundData.R10,
          R11: fundData.R11,
          R12: fundData.R12,
          R13: fundData.R13,
          R14: fundData.R14,
          R15: fundData.R15,
          R16: fundData.R16,
          R17: fundData.R17,
          R18: fundData.R18,
          R19: fundData.R19,
          R20: fundData.R20,
          R21: fundData.R21,
          R22: fundData.R22,
          R23: fundData.R23,
          R24: fundData.R24,
          R25: fundData.R25,
          R26: fundData.R26,
          R27: fundData.R27,
          R28: fundData.R28,
          R29: fundData.R29,
          R30: fundData.R30,
          R31: fundData.R31,
          R32: fundData.R32,
          R33: fundData.R33,
          R34: fundData.R34,
          R35: fundData.R35,
          R36: fundData.R36,
          R37: fundData.R37,
          R38: fundData.R38,
          R39: fundData.R39,
          R40: fundData.R40,
          pinyin: null,
          bh: null,
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
