import { Outlet } from "react-router-dom";
import Login from "../../Pages/Login/Login";

const useAuth = () => {
    const x = 2;
    const token = x === 1 ? false : true;
    return token;
}

const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Login />;
}

export default ProtectedRoutes;