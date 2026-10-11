import { useState } from "react";
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
    <div>
      <h1>Verify your email</h1>

      <p>
        Didn't receive your verification email? Enter your email address below
        and we'll send you a new one.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mt-4 mb-4">
          <label htmlFor="email">Email</label>

          <input
            className="ml-2"
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <button className="inline-flex items-center rounded-md bg-[#198754] px-3 py-1.5 font-medium text-white hover:bg-[#157347] disabled:opacity-65" type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Resend verification email"}
        </button>
      </form>
      <div className="mt-2">
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default ResendVerification;
