import { createContext, useState, useContext } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials = true;

export const AppContext = createContext()

export const AppContextProvider = ({children}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [cart, setCart] = useState(null)
    const [showAddress, setShowAddress] = useState(false)
    // const [address, setAddress] = useState(null)

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/auth/user/is-auth');
            if (data.success) {
                setUser(data.data.user);
                setCart(data.data.user.cartItems ?? null);
            }
        } catch (error) {
            setUser(null);
            setCart(null);
        }
    }

    const logout = async () => {
        try {
            await axios.post('/api/auth/user/logout');
        } catch (error) {
            // ignore logout errors, still clear client state
        }
        setUser(null);
        setCart(null);
        setShowUserLogin(false);
        navigate('/', { replace: true });
    }

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        cart,
        setCart,
        axios,
        fetchUser,
        logout,
        showAddress,
        setShowAddress,
        // address,
        // setAddress
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext)
}
