import React from "react";
import reportWebVitals from "../reportWebVitals";
import Pools from "./Pools";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import DetailPool from "./DetailPool";

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

function App() {
    let routes = useRoutes([
        { path: "/pools", element: <Pools /> },
        { path: "/details/:id", element: <DetailPool /> },
    ]);

    return routes;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
