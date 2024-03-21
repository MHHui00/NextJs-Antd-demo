import excuteQuery from '../scripts/db';


export async function fetchZiXuan(){
    const uid = 4;
    try {
        const data = await excuteQuery({
            query: `select fid, uid, w01, w02, w03 from zixuan where uid = ${uid};`
        });
        return data;
        // return convertToObject(data);
        // return convertToJson(data)
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch Zixuan data.');
    }
}
