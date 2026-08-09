import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../../api/auth";
import type { RegisterData } from "../../types/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setError,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<RegisterData>({
    mode: "onChange",
  });

  const password = watch("password");

  // Re-validate confirm-password whenever password changes,
  // so a stale "match" doesn't slip through after editing password.
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
      const data = error.response?.data;

      let handled = false;

      if (data?.username) {
        setError("username", {
          type: "server",
          message: data.username[0],
        });
        handled = true;
      }

      if (data?.email) {
        setError("email", {
          type: "server",
          message: data.email[0],
        });
        handled = true;
      }

      if (data?.password) {
        setError("password", {
          type: "server",
          message: data.password[0],
        });
        handled = true;
      }

      // Fallback for anything not mapped to a specific field
      // (network errors, 500s, generic detail messages, etc.)
      if (!handled) {
        alert(
          data?.detail ||
            "Something went wrong while creating your account. Please try again.",
        );
      }
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h2 className="text-center fw-bold mb-2">Create Account</h2>

              <p className="text-center text-muted mb-4">
                Register to start shopping
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className={`form-control ${
                      errors.email
                        ? "is-invalid"
                        : touchedFields.email
                          ? "is-valid"
                          : ""
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />

                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                {/* Username */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Choose a username"
                    className={`form-control ${
                      errors.username
                        ? "is-invalid"
                        : touchedFields.username
                          ? "is-valid"
                          : ""
                    }`}
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                  />

                  <div className="invalid-feedback">
                    {errors.username?.message}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    className={`form-control ${
                      errors.password
                        ? "is-invalid"
                        : touchedFields.password
                          ? "is-valid"
                          : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />

                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label htmlFor="re_password" className="form-label">
                    Confirm Password
                  </label>

                  <input
                    id="re_password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className={`form-control ${
                      errors.re_password
                        ? "is-invalid"
                        : touchedFields.re_password
                          ? "is-valid"
                          : ""
                    }`}
                    {...register("re_password", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />

                  <div className="invalid-feedback">
                    {errors.re_password?.message}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-success w-100"
                >
                  {isSubmitting ? "Creating Account..." : "Register"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
