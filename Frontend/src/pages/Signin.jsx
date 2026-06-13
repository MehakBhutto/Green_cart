import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

function Signin() {
  const { setShowUserLogin, axios, navigate, fetchUser, setUser } = useAppContext();
  const location = useLocation();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const action = state === "register" ? "register" : "login";
      const payload = { email, password, role: "user" };
      if (state === "register") {
        payload.name = name;
      }
      console.log(payload);

      if (location.pathname === "/signin") {
        payload.role = "admin";
      }
      console.log(payload);

      console.log(state)
      const { data } = await axios.post(`http://localhost:8080/api/auth/user/${action}`, payload );

      console.log(data);
      if (!data.success) {
        toast.error(data.message || "Authentication failed");
        return;
      }

      // await fetchUser();

      if (state === "login") {
        const role = data?.data?.user?.role;
        const adminId = data?.data?.user?._id;
        if (role === "admin") {
            navigate(`/seller/${adminId}/dashboard`);
          } else {
            setShowUserLogin(false);
            setUser(adminId);
            navigate("/");
          }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Unexpected error");
    }
  }

    return (
    <>
        { location.pathname === '/seller' ?
        <div>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()}
            className="min-h-screen flex items-center text-sm text-gray-600">
                <div className=" flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
                    <p className="text-2xl font-medium m-auto">
                       <span className='text-primary'>Seller </span> Login
                    </p>
            
                    <input id="email" className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3" 
                    type="email" placeholder="Email" 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    required />
                    <input id="password" className="w-full border mt-1 bg-indigo-500/5 mb-7 border-gray-500/10 outline-none rounded py-2.5 px-3" 
                    type="password" placeholder="Password" 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    required />
        
                    <button className="w-full mb-3 bg-primary hover:bg-primary-dull transition-all active:scale-95 py-2.5 rounded text-white font-medium">Login</button>
                </div>
            </form>
        </div> 
        :
        <div onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50" >
      <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white" >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>
        {state === "register" && (
          <div className="w-full">
            <div className="relative">
              {/* <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dull" /> */}
              <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter Name"
                className="border border-gray-200 rounded w-full pl-10 pr-3 py-2 mt-1 outline-primary focus:ring-2 focus:ring-primary"
                type="text" required />
            </div>
          </div>
        )}
        <div className="w-full">
          <div className="relative">
            {/* <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dull" /> */}
            <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter Email"
              className="border border-gray-200 rounded w-full pl-10 pr-3 py-2 mt-1 outline-primary focus:ring-2 focus:ring-primary"
              type="email" required />
          </div>
        </div>
        <div className="w-full">
          <div className="relative">
            {/* <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dull" /> */}
            <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter Password"
              className="border border-gray-200 rounded w-full pl-10 pr-3 py-2 mt-1 outline-primary focus:ring-2 focus:ring-primary"
              type="password" required />
          </div>
        </div>
        {state === "register" ? (
          <p> Already have account?{" "}
            <span onClick={() => setState("login")} className="text-primary-dull cursor-pointer">
              click here </span>
          </p>
        ) : (
          <p> Create an account?{" "}
            <span onClick={() => setState("register")} className="text-primary-dull cursor-pointer">
              click here </span>
          </p>
        )}
        <button className="bg-primary hover:bg-primary-dull transition-all text-white font-bold w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
        }
    </>
    )
}

export default Signin
