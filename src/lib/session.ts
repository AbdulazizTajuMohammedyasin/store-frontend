/** Fired on window when the tokens can no longer be refreshed. AuthProvider listens for it. */
export const SESSION_EXPIRED_EVENT = "auth:session-expired";

/** Clear the stored tokens and tell the app the login session has ended. */
export function endSession() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}
