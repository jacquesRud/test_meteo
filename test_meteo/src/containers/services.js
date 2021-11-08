import { useQuery } from "react-query";

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

    return { data, isLoading, error };
}
