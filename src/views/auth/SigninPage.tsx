import React from "react";
import { SigninForm } from "@/components";
import { ASSETS } from "@/constants";

export const SigninPage: React.FC = () => {
  return (
    <div className="h-full w-full">
      <img
        src={ASSETS.BRAND}
        alt="JCFA Logo"
        className="w-[200px] mx-auto mb-4"
      />
      <h1 className="text-2xl text-center text-black font-bold">
        JFCA Attendance Monitoring System
      </h1>
      <p className="text-lg text-center text-gray-900 font-medium my-6">
        Dashboard Sign-in
      </p>

      <div>
        <SigninForm />
      </div>
    </div>
  );
};
