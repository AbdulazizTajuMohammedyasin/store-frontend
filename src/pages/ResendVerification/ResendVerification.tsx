import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { displayTitle, pageContainer } from "@/lib/Store";
import { resendActivationEmail } from "../../api/auth";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      await resendActivationEmail(email);

      setMessage(
        "If an unverified account exists with this email, a new verification email has been sent.",
      );

      setEmail("");
    } catch (error) {
      console.error(error);
      setError("Unable to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={pageContainer}>
      <div className="mx-auto max-w-md py-4 sm:py-8">
        <h1 className={displayTitle}>Verify your email</h1>

        <p className="mt-3 text-muted-foreground">
          Didn't receive your verification email? Enter your email address below
          and we'll send you a new one.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              className="h-11 rounded-none"
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <Button
            className="h-12 w-full rounded-none bg-signal text-base text-signal-foreground hover:bg-signal/85"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Resend verification email"}
          </Button>
        </form>

        <div className="mt-6" aria-live="polite">
          {message && (
            <p className="border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
              {message}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
