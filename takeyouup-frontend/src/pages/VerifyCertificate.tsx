import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";

// Public page — verifies a certificate by serial without needing a login.

export default function VerifyCertificate() {
  const { serial } = useParams();
  const [state, setState] = useState<"loading" | "valid" | "invalid">("loading");
  const [cert, setCert] = useState<any>(null);

  useEffect(() => {
    document.title = "Verify Certificate | TakeYouUp - Master Programming & Build Your Future";
  }, []);

  useEffect(() => {
    api
      .get(`/certificates/verify/${serial}`)
      .then((r) => { setCert(r.data); setState("valid"); })
      .catch(() => setState("invalid"));
  }, [serial]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-xs tracking-widest text-orange-500 font-mono mb-2">// CERTIFICATE VERIFICATION</p>

      {state === "loading" && <p className="opacity-60">Verifying {serial}…</p>}

      {state === "invalid" && (
        <div className="rounded-2xl border p-10">
          <h1 className="text-2xl font-bold text-red-500">Not valid</h1>
          <p className="mt-2 opacity-70">No certificate found with serial <span className="font-mono">{serial}</span>.</p>
        </div>
      )}

      {state === "valid" && cert && (
        <div className="rounded-2xl border p-10" style={{ background: "linear-gradient(135deg, rgba(255,77,28,0.12), transparent)" }}>
          <div className="text-4xl">🏆</div>
          <h1 className="text-2xl font-bold mt-3">Valid Certificate</h1>
          <p className="mt-4 text-lg">{cert.courseTitle}</p>
          <p className="opacity-80">Awarded to <strong>{cert.userName}</strong></p>
          <p className="mt-4 font-mono text-xs opacity-60">{cert.serialNo}</p>
        </div>
      )}
    </div>
  );
}
