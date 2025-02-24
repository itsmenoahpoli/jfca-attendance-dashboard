import React from "react";
import { useForm } from "react-hook-form";
import { Flex, TextField, Button } from "@radix-ui/themes";
import { useAuthService } from "@/services";
import { type SigninCredentials } from "@@types/auth";

export const SigninForm: React.FC = () => {
  const { signinCredentials } = useAuthService();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SigninCredentials>({
    defaultValues: {
      email: "admin@pmrfacility.com",
      password: "CT0bFG3MUW",
    },
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSignin = handleSubmit(async (formData) => {
    setLoading(true);

    return await signinCredentials(formData, setLoading);
  });

  return (
    <div className="h-full w-full">
      <form onSubmit={handleSignin}>
        <Flex direction="column" gap="3">
          <Flex direction="column" gap="1">
            <p className="text-xs text-gray-800">E-mail Address</p>
            <TextField.Root
              type="email"
              placeholder="yourname@domain.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              readOnly={loading}
              autoFocus
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </Flex>
          <Flex direction="column" gap="1">
            <p className="text-xs text-gray-800">Password</p>
            <TextField.Root
              type="password"
              placeholder="*********"
              {...register("password", {
                required: "Password is required",
              })}
              readOnly={loading}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </Flex>

          <Flex justify="end">
            <a href="#" className="text-xs text-blue-700">
              Forgot your password?
            </a>
          </Flex>

          <Button
            className="!font-bold mt-4"
            color="green"
            type="submit"
            disabled={loading}
            loading={loading}
          >
            SIGN IN
          </Button>
        </Flex>
      </form>
    </div>
  );
};
