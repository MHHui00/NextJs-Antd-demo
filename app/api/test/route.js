import { fetchZiXuan } from '@/lib/data';


export async function GET(request) {
  const zixuan = await fetchZiXuan();

  console.log(JSON.stringify(zixuan));

  return new Response(JSON.stringify(zixuan), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Length': zixuan.length.toString()
    },
  })

}
