import React, { useContext, useMemo, useState } from "react";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import TestMeteoTable from "../../components/TestMeteoTable";
import SelectedPoolContext from "../selected-pool-context";
import {
    useReactSequentialQuery,
    useReactQueries,
    useMergeState,
} from "../services";
import { apiKey } from "../../apiKeystore";

export default function TablePools({ data, onChange }) {
    let navigate = useNavigate();
    const [_, setContext] = useContext(SelectedPoolContext);
    const [
        { apiCountSequential, apiCountParallel, apiUUID, isParallel },
        setState,
    ] = useMergeState({
        apiCountSequential: [],
        apiCountParallel: [],
    });

    const resParallelQuery = useReactQueries({
        criterias: apiCountParallel,
        url: `http://api.openweathermap.org/geo/1.0/direct?q=Paris&limit=1&appid=${apiKey}`,
        enabled: !!apiCountParallel && isParallel,
    });

    const resSequentialQuery = useReactSequentialQuery({
        criterias: apiCountSequential,
        url: `http://api.openweathermap.org/geo/1.0/direct?q=Paris&limit=1&appid=${apiKey}`,
        enabled: !!apiCountSequential && !isParallel,
    });

    useMemo(() => {
        if (
            resParallelQuery.every(({ isLoading }) => !isLoading) &&
            isParallel &&
            resParallelQuery.length > 0 &&
            apiUUID
        ) {
            data.find(({ id }) => id === apiUUID).dateRunFinished =
                new Date().toLocaleString();
        }
        if (
            resSequentialQuery.every(({ isLoading }) => !isLoading) &&
            !isParallel &&
            resSequentialQuery.length > 0 &&
            apiUUID
        ) {
            data.find(({ id }) => id === apiUUID).dateRunFinished =
                new Date().toLocaleString();
            setState({ resSequentialQuery: [], apiUUID: null });
        }
    }, [resSequentialQuery, resParallelQuery]);

    const columns = useMemo(
        () => [
            {
                Header: "Name",
                Cell: ({ row: { original } }) => {
                    const [name, setName] = useState(original.name);
                    return original.isNew ? (
                        <input
                            type="text"
                            onBlur={() => {
                                original.name = name;
                                onChange();
                            }}
                            onChange={(nextValue) => {
                                setName(nextValue.target.value);
                            }}
                            value={name}
                        />
                    ) : (
                        <Button
                            onClick={() => {
                                setContext({ ...original });
                                navigate("/details/" + original.id);
                            }}
                        >
                            {original.name}
                        </Button>
                    );
                },
            },
            {
                Header: "Count",
                Cell: ({ row: { original } }) => {
                    const [count, setCount] = useState(original.count);
                    return original.isNew ? (
                        <input
                            type="number"
                            onBlur={() => {
                                original.count = count;
                                onChange();
                            }}
                            onChange={(nextValue) => {
                                setCount(parseInt(nextValue.target.value));
                            }}
                            value={count}
                        />
                    ) : (
                        original.count
                    );
                },
            },
            {
                Header: "Is parallel?",
                Cell: ({ row: { original } }) =>
                    original.isNew ? (
                        <Button
                            value={original.isParallel}
                            onClick={() => {
                                original.isParallel = !original.isParallel;
                                onChange();
                            }}
                        >
                            {original.isParallel ? "Yes" : "No"}
                        </Button>
                    ) : original.isParallel ? (
                        "Yes"
                    ) : (
                        "No"
                    ),
            },
            {
                Header: "Actions",
                Cell: ({ row: { original } }) =>
                    original.isNew ? (
                        <>
                            <Button
                                onClick={() => {
                                    delete original["isNew"];
                                    onChange();
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={() => {
                                    runQuery(original);
                                    delete original["isNew"];
                                    onChange();
                                }}
                            >
                                Save and Run
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => {
                                runQuery(original);
                            }}
                        >
                            Run
                        </Button>
                    ),
            },
        ],
        [data]
    );

    const tableInstance = useTable({ columns, data });

    return <TestMeteoTable tableInstance={tableInstance} />;

    function runQuery(pool) {
        const arrayCount = Array.from(Array(pool.count).keys());
        pool.dateRunStarted = new Date().toLocaleString();
        if (pool.isParallel) {
            setState({
                apiCountParallel: arrayCount,
                apiUUID: pool.id,
                isParallel: true,
            });
        } else {
            setState({
                apiCountSequential: arrayCount,
                apiUUID: pool.id,
                isParallel: false,
            });
        }
    }
}
