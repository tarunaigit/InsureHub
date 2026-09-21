import { useEffect, useRef, useState } from "react";
import { Chrome, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function GoogleSignIn({
  onSuccess,
  text = "Continue with Google",
}) {
  const buttonRef = useRef(null);
  const { google } = useAuth();
  const successRef = useRef(onSuccess);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    successRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    const render = () => {
      if (cancelled || !window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const data = await google(response.credential);
            successRef.current?.(data);
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Google sign-in failed.",
            );
          }
        },
        auto_select: false,
        ux_mode: "popup",
      });
      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: text === "Sign up with Google" ? "signup_with" : "continue_with",
        shape: "rectangular",
        width: Math.min(420, buttonRef.current.clientWidth || 420),
      });
      setReady(true);
    };
    const existing = document.querySelector("script[data-insurehub-google]");
    if (existing) {
      existing.addEventListener("load", render);
      render();
      return () => {
        cancelled = true;
        existing.removeEventListener("load", render);
      };
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.insurehubGoogle = "true";
    script.onload = render;
    document.head.appendChild(script);
    return () => {
      cancelled = true;
    };
  }, [text]);

  if (!clientId)
    return (
      <button
        type="button"
        className="google-placeholder"
        onClick={() =>
          toast.error(
            "Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to frontend/.env.",
          )
        }
      >
        <Chrome size={19} />
        <span>{text}</span>
        <ShieldAlert size={16} className="google-placeholder-icon" />
      </button>
    );
  return (
    <div className="google-signin-wrap">
      <div ref={buttonRef} className="google-signin-button" />
      {!ready && <div className="google-loading">Loading Google sign-in…</div>}
    </div>
  );
}
