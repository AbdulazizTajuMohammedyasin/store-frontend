import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pageContainer, pageSubtitle } from "@/lib/Store";
import { registerUser } from "@/api/auth";
import type { RegisterData } from "@/types/auth";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setError,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<RegisterData>({ mode: "onChange" });

  const password = watch("password");

  useEffect(() => {
    if (touchedFields.re_password) {
      trigger("re_password");
    }
  }, [password, touchedFields.re_password, trigger]);

  async function onSubmit(data: RegisterData) {
    try {
      await registerUser(data);
      alert(
        "Account created successfully! Please check your email to verify your account.",
      );
      navigate("/login");
    } catch (error: any) {
      const responseData = error.response?.data;
      let handled = false;

      if (responseData?.username) {
        setError("username", {
          type: "server",
          message: responseData.username[0],
        });
        handled = true;
      }
      if (responseData?.email) {
        setError("email", { type: "server", message: responseData.email[0] });
        handled = true;
      }
      if (responseData?.password) {
        setError("password", {
          type: "server",
          message: responseData.password[0],
        });
        handled = true;
      }

      if (!handled) {
        alert(
          responseData?.detail ||
            "Something went wrong while creating your account. Please try again.",
        );
      }
    }
  }

  return (
    <div className={pageContainer}>
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <p className={pageSubtitle}>Register to start shopping.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="Choose a username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="re_password">Confirm password</Label>
                <Input
                  id="re_password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  {...register("re_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.re_password && (
                  <p className="text-sm text-destructive">
                    {errors.re_password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
