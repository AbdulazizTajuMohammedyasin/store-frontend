import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageContainer, sectionTitle } from "@/lib/Store";
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
    return (
      <div className={pageContainer}>
        <div className="mx-auto max-w-md py-4 sm:py-8" role="status">
          <LoaderCircle
            className="size-8 animate-spin text-muted-foreground motion-reduce:animate-none"
            aria-hidden="true"
          />
          <h1 className={`${sectionTitle} mt-6`}>Activating your account...</h1>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={pageContainer}>
        <div className="mx-auto max-w-md py-4 sm:py-8">
          <CircleCheck className="size-8 text-success" aria-hidden="true" />
          <h1 className={`${sectionTitle} mt-6`}>
            Account activated successfully!
          </h1>

          <Button
            className="mt-8 h-12 w-full rounded-none bg-signal text-base text-signal-foreground hover:bg-signal/85 sm:w-auto sm:px-8"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={pageContainer}>
      <div className="mx-auto max-w-md py-4 sm:py-8">
        <CircleAlert className="size-8 text-destructive" aria-hidden="true" />
        <h1 className={`${sectionTitle} mt-6`}>Account activation failed</h1>

        <p className="mt-3 text-muted-foreground">
          This activation link may be invalid or expired.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            className="h-12 rounded-none bg-signal px-6 text-signal-foreground hover:bg-signal/85"
            onClick={() => navigate("/resend-verification")}
          >
            Resend verification email
          </Button>

          <Button
            variant="outline"
            className="h-12 rounded-none px-6"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
