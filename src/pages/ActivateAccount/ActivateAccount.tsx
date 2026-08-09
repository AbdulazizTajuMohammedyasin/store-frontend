import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { activateUser } from "../../api/auth";

const ActivateAccount = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!uid || !token) {
      setStatus("error");
      return;
    }

    const activate = async () => {
      try {
        await activateUser(uid, token);
        setStatus("success");
      } catch (error) {
        console.error("Account activation failed:", error);
        setStatus("error");
      }
    };

    activate();
  }, [uid, token]);

  if (status === "loading") {
    return <h1>Activating your account...</h1>;
  }

  if (status === "success") {
    return (
      <div>
        <h1>Account activated successfully!</h1>

        <button className="btn btn-success" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Account activation failed</h1>

      <p>This activation link may be invalid or expired.</p>

      <button
        className="btn btn-success"
        onClick={() => navigate("/resend-verification")}
      >
        Resend verification email
      </button>

      <button
        className="btn btn-success ms-3"
        onClick={() => navigate("/login")}
      >
        Go to Login
      </button>
    </div>
  );
};

export default ActivateAccount;
