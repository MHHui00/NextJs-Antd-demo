import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET(req, res) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    // console.log('geted uid:', userId);
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId parameter' });
    }

    const result = await prisma.zixuan.findMany({
      where: {
        uid: +userId,
    },
    });
    if (result.length === 0) {
      return res.status(409).json({ message: 'no result on zixuan table' });
    }

    const processedData = result.map(item => {
      const processedItem = { ...item };
      // 遍历对象的属性
      for (let key in processedItem) {
        // 检查属性值是否为浮点数
        if (typeof processedItem[key] === 'number') {
          // 使用 toFixed() 将浮点数保留两位小数
          processedItem[key] = parseFloat(processedItem[key].toFixed(2));
        }
      }
      return processedItem;
    });

    return new Response(JSON.stringify(processedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Length': zixuan.length.toString()
      },
    })
  } catch(error) {
    console.error('Failed fetch zixuan table', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
