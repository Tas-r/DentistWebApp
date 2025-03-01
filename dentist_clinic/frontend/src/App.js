import React, { useEffect, useState } from "react";
import { fetchTestData } from "./api";

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function getData() {
            const result = await fetchTestData();
            setData(result);
        }
        getData();
    }, []);

    return (
        <div>
            <h1>welcome to dentist clinic</h1>
            <h2>backend response:</h2>
            <p>{data ? JSON.stringify(data) : "loading..."}</p>
        </div>
    );
}

export default App;
