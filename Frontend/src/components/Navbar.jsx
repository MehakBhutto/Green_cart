import { NavLink } from 'react-router-dom';
import {assets} from '../assets/assets.js'
import {useState} from 'react'
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const { user, setUser, setShowUserLogin, navigate, cart, setCart, logout } = useAppContext();

    const handleSearch = (event) => {
        event.preventDefault();
        const query = searchTerm.trim();
        setSearchTerm('');
        if (query) {
            navigate(`/products?search=${encodeURIComponent(query)}`);
        } else {
            navigate('/products');
        }
    };

    const setUserLogout = async() => {
        try {
            const response = await axios.post('https://green-cart-tan-three.vercel.app/api/auth/user/logout');
            if (response.data.success) {
                toast.success('Logged out successfully');
                setUser(null);
                setCart(null);
                setShowUserLogin(false);
                navigate('/');
                return;
            }
            toast.error(response.data.message || 'Logout failed');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Logout failed');
        }
    }

    return (
        <>
          <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to='/' onClick={() => setOpen(false)}>
                <img src={assets.logo} alt="" className="h-9"/>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <button onClick={() => navigate('/seller')}
                className="border border-gray-300 px-3 py-1 rounded-full text-xs cursor-pointer opacity-80">Seller Dashboard</button>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">All Product</NavLink>

                <form onSubmit={handleSearch} className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </form>

                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="" className='w-6 opacity-60'/>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{cart ? (Array.isArray(cart) ? cart.length : (cart.items ? cart.items.length : 0)) : 0}</button>
                </div>
               {!user ? (<button onClick={() =>{
                    setShowUserLogin(true);
                }} 
                    className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                    Login
                </button>) : (
                    <div className='relative group border-[3px] rounded-full border-gray-600 cursor-pointer'>
                        <img src={assets.profile_icon} className='w-10' alt='profile icon'/>
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                            <li onClick={() => navigate(`/${user}/orders`)} className='p-1.5 pl-3 hover:bg-primary/20 cursor-pointer'>My Orders</li>
                            <li onClick={() => {
                                logout();
                                setUserLogout();
                                navigate("/");
                            }} className='p-1.5 pl-3 hover:bg-primary/20 cursor-pointer'>Logout</li>
                        </ul>
                    </div>
                )}
            </div>

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                {/* Menu Icon SVG */}
                <img src={assets.menu_icon} alt="menu" />
            </button>

            {/* Mobile Menu */}
            {open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink to="/" className="block" onClick={()=> setOpen(false)}>Home</NavLink>
                <NavLink to="/products" className="block" onClick={()=> setOpen(false)}>All Products</NavLink>
                {user &&
                <NavLink to="/" className="block" onClick={()=> setOpen(false)}>My Orders</NavLink>
                }
                <NavLink to="/" className="block" onClick={()=> setOpen(false)}>Contacts</NavLink>
                {!user ? (
                <button className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-hover transition text-white rounded-full text-sm"
                onClick={() => {
                    setOpen(false);
                    setShowUserLogin(true);
                }}>
                    Login
                </button>
                ) : (
                <button onClick={logout}
                className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-hover transition text-white rounded-full text-sm">
                    Logout
                </button>
                )}
            </div>
            )}

        </nav>
        </>
    )
}

export default Navbar;
