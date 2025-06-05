import Layout from "./Layout";
import { Navigate } from "react-router-dom";

const Protected = ({children}) => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return (
        <Layout>
            {children}
        </Layout>
    );
}

export default Protected