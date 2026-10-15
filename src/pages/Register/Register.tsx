import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { displayTitle, pageContainer } from "@/lib/Store";
import { registerUser } from "@/api/auth";
import type { RegisterData } from "@/types/auth";

const field = "h-11 rounded-none";

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
      toast.success(
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
        toast.error(
          responseData?.detail ||
            "Something went wrong while creating your account. Please try again.",
        );
      }
    }
  }

  return (
    <div className={pageContainer}>
      <div className="mx-auto max-w-md py-4 sm:py-8">
        <h1 className={displayTitle}>Create account</h1>
        <p className="mt-3 text-muted-foreground">Register to start shopping.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className={field}
              placeholder="Enter your email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              className={field}
              placeholder="Choose a username"
              aria-invalid={errors.username ? true : undefined}
              aria-describedby={errors.username ? "username-error" : undefined}
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
            />
            {errors.username && (
              <p id="username-error" className="text-sm text-destructive">
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
              className={field}
              placeholder="Enter your password"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
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
              className={field}
              placeholder="Confirm your password"
              aria-invalid={errors.re_password ? true : undefined}
              aria-describedby={
                errors.re_password ? "re_password-error" : undefined
              }
              {...register("re_password", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.re_password && (
              <p id="re_password-error" className="text-sm text-destructive">
                {errors.re_password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-none bg-signal text-base text-signal-foreground hover:bg-signal/85"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
