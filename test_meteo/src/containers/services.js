import { useState } from "react";
import { useQuery, useQueries } from "react-query";

export function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

export function useReactQuery({ criteria, url, enabled }) {
    const { isLoading, error, data } = useQuery(
        criteria,
        () => fetch(url).then((res) => res.json()),
        { enabled }
    );
    console.log("enabled", enabled);
    console.log("data", data);
    console.log("url", url);
    return { data, isLoading, error };
}

export function useReactSequentialQuery({ criterias, url, enabled }) {
    const [enabledArray, setEnabledArray] = useState(
        criterias.map(() => false)
    );
    return useQueries(
        criterias.map((criteria, index) => {
            return {
                queryKey: ["criteria", criteria],
                queryFn: () =>
                    fetch(url).then(() => {
                        enabledArray[index + 1] = true;
                        setEnabledArray([...enabledArray]);
                    }),
                enabled: enabled && (enabledArray[index] || index === 0),
            };
        })
    );
}

export function useReactQueries({ criterias, url, enabled }) {
    return useQueries(
        criterias.map((criteria) => {
            return {
                queryKey: ["criteria", criteria],
                queryFn: () => fetch(url),
                enabled,
            };
        })
    );
}

export function useMergeState(initialState) {
    const [state, setState] = useState(initialState);
    const setMergedState = (newState) =>
        setState((prevState) => Object.assign({}, prevState, newState));
    return [state, setMergedState];
}
