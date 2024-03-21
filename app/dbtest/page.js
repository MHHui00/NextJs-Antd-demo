// 使用 useEffect 和 useState
'use client'
import React, { useEffect, useState } from 'react';

export default function TestPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // const response = await fetch('https://jsonplaceholder.org/users');
                const response = await fetch('http://localhost:3000/api/test');
                if (response.ok) {
                    const jsonData = await response.text(); // 先获取文本内容
                    try {
                        const obj = JSON.parse(jsonData); // 尝试解析文本为JSON
                        setData(obj);
                    } catch (error) {
                        console.error("Parsing error:", error);
                        console.log("Received text:", jsonData);
                    }
                } else {
                    console.error("API call failed:", response.statusText);
                }
            } catch (error) {
                console.error("Fetching error:", error);
                setData({ error: "Failed to load data." }); // 设置错误信息，以便在页面上显示
            }
        }

        fetchData();
    }, []);

    if (data && data.error) return <div>{data.error}</div>;

    return (
        <div>
            {JSON.stringify(data)}
            {console.log(data)}
        </div>
    );
}
