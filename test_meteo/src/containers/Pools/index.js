import Button from "@restart/ui/esm/Button";
import React, { useState } from "react";
import { mockData } from "../constants";
import { makeid } from "../services";

import TablePools from "../TablePools";

export default function Pools() {
    const [data, setData] = useState(mockData);

    return (
        <div>
            <TablePools
                data={data}
                onChange={() => {
                    setData([...data]);
                }}
            />
            <Button
                onClick={() => {
                    addNewPool();
                }}
            >
                Add Pool
            </Button>
        </div>
    );

    function addNewPool() {
        setData([
            ...data,
            {
                name: "",
                count: 0,
                isParallel: false,
                isNew: true,
                id: makeid(10),
                dateCreated: new Date().toLocaleString(),
            },
        ]);
    }
}
