import React, { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input, InputGroup } from "@chakra-ui/react";
import { LuUser } from "react-icons/lu";
import { PasswordInput } from "@/components/PasswordInput";
import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { signUpCreator } from "@/Redux/authslice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch,RootState } from "@/Redux/store";

export const CreatorSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Form State
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  //  redux state
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Handle Signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = await dispatch(
      signUpCreator({ email, password, fullName, username, mobile })
    );

    if (signUpCreator.fulfilled.match(action)) {
      alert("✅ Signup successful!");
      navigate("/"); // Redirect to dashboard
    } else {
      alert("❌ Signup failed: " + action.payload);
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col justify-center px-5 mt-auto mb-auto">
        <p className="text-center text-sm">
          Welcome to <br />{" "}
          <span className="font-semibold text-xl">Creators Pro</span>
        </p>
        <div className="h-fit flex flex-col justify-center gap-5 mt-5">
          <p className="text-left font-bold">Sign Up</p>
          <form action="" className="grid gap-2" onSubmit={handleSubmit}>
            {/* email */}
            <InputGroup
              // startElement={<MdOutlineMailOutline />}
              border={"1px solid black"}
              rounded={"25px"}
              pl={"20px"}
            >
              <Input
                placeholder="Email"
                focusRing={"none"}
                type="email"
                fontSize={"15px"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <div className="flex gap-2">
              {/* username */}
              <InputGroup
                // startElement={<LuUser />}
                border={"1px solid black"}
                rounded={"25px"}
                pl={"20px"}
              >
                <Input
                  placeholder="User name"
                  focusRing={"none"}
                  type="text"
                  fontSize={"15px"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </InputGroup>
              {/* name */}
              <InputGroup
                // startElement={<LuUser />}
                border={"1px solid black"}
                rounded={"25px"}
                pl={"20px"}
              >
                <Input
                  placeholder="Full Name"
                  focusRing={"none"}
                  type="text"
                  fontSize={"15px"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </InputGroup>
            </div>

            {/* mobile number */}
            <InputGroup
              // startElement={<LuUser />}
              border={"1px solid black"}
              rounded={"25px"}
              pl={"20px"}
            >
              <Input
                placeholder="Mobile Number"
                focusRing={"none"}
                type="number"
                fontSize={"15px"}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </InputGroup>
            {/* password */}
            <PasswordInput value={password} setPassword={setPassword} />
            <button
              className="border w-[50%] m-auto py-2 rounded-[25px] bg-black text-white shadow-sm"
              type="submit"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <p className="text-center text-sm font-semibold">
            Already a creator?{" "}
            <span
              className="text-blue-500 font-bold cursor-pointer"
              onClick={() => navigate("/creator-login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};
