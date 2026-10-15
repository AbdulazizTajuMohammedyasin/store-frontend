import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { displayTitle, pageContainer } from "@/lib/Store";
import { getCurrentUser, loginUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

type LoginData = {
  username: string;
  password: string;
};

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ mode: "onChange" });

  async function onSubmit(data: LoginData) {
    try {
      const response = await loginUser(data);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      const userResponse = await getCurrentUser();
      setUser(userResponse.data);
      navigate("/products");
    } catch (error: any) {
      setError("root", {
        type: "server",
        message: error.response?.data?.detail || "Invalid username or password",
      });
    }
  }

  return (
    <div className={pageContainer}>
      <div className="mx-auto max-w-md py-4 sm:py-8">
        <h1 className={displayTitle}>Login</h1>
        <p className="mt-3 text-muted-foreground">
          Sign in with your DexShop username.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              className="h-11 rounded-none"
              placeholder="Enter your username"
              aria-invalid={errors.username ? true : undefined}
              aria-describedby={errors.username ? "username-error" : undefined}
              {...register("username", {
                required: "Username is required",
                onChange: () => clearErrors("root"),
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
              autoComplete="current-password"
              className="h-11 rounded-none"
              placeholder="Enter your password"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password", {
                required: "Password is required",
                onChange: () => clearErrors("root"),
              })}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p
              role="alert"
              className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-none bg-signal text-base text-signal-foreground hover:bg-signal/85"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
          Didn't verify your email?{" "}
          <Link
            to="/resend-verification"
            className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Resend verification
          </Link>
        </p>
      </div>
    </div>
  );
}
