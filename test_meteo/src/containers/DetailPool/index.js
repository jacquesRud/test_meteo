import { useContext } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { dictKeyPool } from "../constants";
import SelectedPoolContext from "../selected-pool-context";

export default function DetailPool() {
    const navigate = useNavigate();
    const [context] = useContext(SelectedPoolContext);

    return (
        <>
            <div>
                <Button
                    onClick={() => {
                        navigate("/pools");
                    }}
                >
                    Back
                </Button>
            </div>
            <div>
                {Object.keys(context).map((key) => (
                    <li>{dictKeyPool[key] + " : " + context[key]}</li>
                ))}
            </div>
        </>
    );
}
