import React, { useContext, useMemo, useState } from "react";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import TestMeteoTable from "../../components/TestMeteoTable";
import SelectedPoolContext from "../selected-pool-context";
import { useReactQuery } from "../services";

export default function TablePools({ data, onChange }) {
    let navigate = useNavigate();
    const [_, setContext] = useContext(SelectedPoolContext);
    const [apiUUID, setAPIUUID] = useState("");
    const { data: dataGit, isLoading } = useReactQuery({
        criteria: apiUUID,
        url: `https://api.github.com/search/users?q=${apiUUID}`,
        enabled: !!apiUUID,
    });
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
                        <Button
                            onClick={() => {
                                delete original["isNew"];
                                onChange();
                            }}
                        >
                            Save
                        </Button>
                    ) : original.isParallel ? (
                        <Button
                            onClick={() => {
                                original.dateRunStarted =
                                    new Date().toLocaleString();
                                setAPIUUID(original.id);
                                if (!isLoading && dataGit) {
                                    original.dateRunFinished =
                                        new Date().toLocaleString();
                                }
                            }}
                        >
                            Run
                        </Button>
                    ) : null,
            },
        ],
        [data]
    );

    const tableInstance = useTable({ columns, data });

    return <TestMeteoTable tableInstance={tableInstance} />;
}
