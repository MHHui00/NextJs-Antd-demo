import { PrismaClient } from '@prisma/client'

export async function GET(request) {
  const prisma = new PrismaClient();
//   const result = await prisma.zixuan.findMany();
  const result = await prisma.zixuan.findMany({
    where: {
      uid: 1,
  },
})
  // const data = JSON.stringify(result);
  
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
//   console.log(processedData);


  return new Response(JSON.stringify(processedData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Length': zixuan.length.toString()
    },
  })

}
