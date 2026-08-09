import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import { getCurrentUser, loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

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
  } = useForm<LoginData>({
    mode: "onChange",
  });

  async function onSubmit(data: LoginData) {
    try {
      const response = await loginUser(data);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      const userResponse = await getCurrentUser();

      setUser(userResponse.data);
      navigate("/products");
    } catch (error: any) {
      const data = error.response?.data;

      setError("root", {
        type: "server",
        message: data?.detail || "Invalid username or password",
      });
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h2 className="text-center fw-bold mb-4">Login</h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Username */}
                <div className="mb-3">
                  <label className="form-label">Username</label>

                  <input
                    type="text"
                    placeholder="Enter your username"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    {...register("username", {
                      required: "Username is required",
                      onChange: () => clearErrors("root"),
                    })}
                  />

                  <div className="invalid-feedback">
                    {errors.username?.message}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label">Password</label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      onChange: () => clearErrors("root"),
                    })}
                  />

                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>
                {errors.root && (
                  <div className="alert alert-danger">
                    {errors.root.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-100"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
                <p className="text-center mt-3">
                  Didn't verify your email?{" "}
                  <Link to="/resend-verification">
                    Resend verification email
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
