import React, { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input, InputGroup, useDisclosure } from "@chakra-ui/react";
import { LuUser } from "react-icons/lu";
import { PasswordInput } from "@/components/PasswordInput";
import { useNavigate } from "react-router-dom";
import { useDispatch, UseDispatch,useSelector } from "react-redux";
import { signInCreator } from "@/Redux/signinSlice";
import { AppDispatch,RootState } from "@/Redux/store";

export const CreatorLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const {loading,error} = useSelector((state:RootState)=>state.signin)
  
  // hndle login
  const handleLogin = async (e:React.FormEvent) => {
       e.preventDefault()
       const action = await dispatch(signInCreator({email,password}))
       if(signInCreator.fulfilled.match(action)){
        navigate("/")
       }else{
        alert("❌ Login failed: " + action.payload);
       }
  }
  return (
    <MobileLayout>
      <div className="flex flex-col justify-center px-5 mt-auto mb-auto">
        <p className="text-center text-sm">
          Welcome to <br />{" "}
          <span className="font-semibold text-xl">Creators Pro</span>
        </p>
        <div className="h-[500px] flex flex-col justify-center gap-5">
          <p className="text-left font-bold">Creator's Login</p>
          <form className="grid gap-2" onSubmit={handleLogin}>
            <InputGroup
              startElement={<LuUser />}
              border={"1px solid black"}
              rounded={"25px"}
            >
              <Input
                placeholder="Email"
                focusRing={"none"}
                type="email"
                fontSize={"15px"}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <PasswordInput value={password} setPassword={setPassword} />
            <button
              className="border w-[50%] m-auto py-2 rounded-[25px] bg-black text-white shadow-sm"
              type="submit"
              disabled={loading}
            >
              {loading?"Loggin in.." : "Login"}
            </button>
          </form>
           {/* Show error message if login fails */}
           {error && <p className="text-red-500 text-center">{error}</p>}
          <p className="text-center text-sm font-semibold">
            Not a creator?{" "}
            <span
              className="text-blue-500 font-bold cursor-pointer"
              onClick={() => navigate("/creator-signup")}
            >
              Register now
            </span>
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};
