// 引入 PrismaClient
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export default async function handler(req, res) {
export async function DELETE(req, res) {
    
    if (req.method !== 'DELETE') {
        // return res.status(405).json({ message: 'Only DELETE requests are allowed' });
        return new Response(JSON.stringify({ message: '只允许Delete请求' }), {
            status: 405,
            headers: {
              'Content-Type': 'application/json',
            },
          })
    }

    // const { fid, uid } = req.query;
    const fid = req.nextUrl.searchParams.get("fid");
    const uid = Number(req.nextUrl.searchParams.get("userId"));

    if (!fid || !uid) {
        // return res.status(400).json({ message: 'Missing fid or uid parameter' });
        return new Response(JSON.stringify({ message: '缺少参数' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          })
    }

    try {
        // 使用 fid 和 uid 作为复合主键查找唯一的记录
        const record = await prisma.zixuan.findUnique({
            where: {
                fid_uid: {
                    fid: fid,
                    uid: uid,
                },
            },
        });

        if (!record) {
            // return res.status(404).json({ message: 'Record not found' });
            return new Response(JSON.stringify({ message: '该基金已经不在自选表里' }), {
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                },
              })
        }

        // 如果找到了，删除这条记录
        await prisma.zixuan.delete({
            where: {
                fid_uid: {
                    fid: fid,
                    uid: uid,
                },
            },
        });

        // return res.status(200).json({ message: 'Record deleted successfully' });
        return new Response(JSON.stringify({ message: '删除成功' }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          })
    } catch (error) {
        console.error('Error deleting record:', error);
        // return res.status(500).json({ message: 'Internal Server Error' });
        return new Response(JSON.stringify({ message: 'Internal Server Error. 操作出错' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          })
    }
}
