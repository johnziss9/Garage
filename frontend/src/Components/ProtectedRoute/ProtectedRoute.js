import { Outlet, Navigate } from "react-router-dom";
import Login from "../../Pages/Login/Login";

const useAuth = () => {
    const token = sessionStorage.getItem('token') === null ? false : true
    return token;
}

const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;