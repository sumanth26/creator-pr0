import { InputGroup, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsEyeSlashFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";

interface PasswordInputProps {
  value: string;
  setPassword: (password: string) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  setPassword,
}) => {
  const [show, setShow] = useState(false);

  return (
    <InputGroup
      startElement={<TbLockPassword />}
      border={"1px solid black"}
      rounded={"25px"}
      endElement={
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          className="w-full h-full flex items-center justify-center text-black cursor-pointer text-[15px]"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? <BsEyeSlashFill /> : <IoEyeSharp />}
        </button>
      }
    >
      <Input
        // pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Password"
        className="text-black"
        borderColor="black"
        value={value}
        onChange={(e) => setPassword(e.target.value)}
        focusRing={"none"}
        fontSize={"15px"}
      />
    </InputGroup>
  );
};
