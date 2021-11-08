import { useState } from "react";
import AppWrapper from "./AppWrapper";
import SelectedPoolContext from "./selected-pool-context";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({});

export default function App() {
    const [context, setContext] = useState({});

    return (
        <QueryClientProvider client={queryClient}>
            <SelectedPoolContext.Provider value={[context, setContext]}>
                <AppWrapper />
            </SelectedPoolContext.Provider>
        </QueryClientProvider>
    );
}
