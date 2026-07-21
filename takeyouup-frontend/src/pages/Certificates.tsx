import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";
import { CardGridSkeleton, ListSkeleton } from "@/components/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Certificates() {
  const token = localStorage.getItem("token");
  const [certs, setCerts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get("/certificates/mine").then((r) => setCerts(r.data)).catch(() => {});
  useEffect(() => {
    // Both feed the page; only drop the placeholders once each has answered,
    // otherwise "no certificates yet" flashes before the real list arrives.
    Promise.allSettled([
      load(),
      api.get("/courses/basic").then((r) => setCourses(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  if (!token) return <Navigate to="/login" replace />;

  const claim = async (courseId: number) => {
    try {
      await api.post(`/certificates/courses/${courseId}`);
      toast.success("Certificate issued!");
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Complete the course first");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <p className="text-xs tracking-widest text-orange-500 font-mono mb-2">// ACHIEVEMENTS</p>
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>My Certificates</h1>

      {loading && (
        <div className="mb-10 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
          <ListSkeleton count={4} height={64} />
        </div>
      )}

      {!loading && certs.length === 0 && (
        <p className="opacity-60 mb-8">No certificates yet — finish a course to earn one.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {certs.map((c) => (
          <div key={c.serialNo} className="rounded-2xl border p-6" style={{ background: "linear-gradient(135deg, rgba(255,77,28,0.12), transparent)" }}>
            <p className="text-xs font-mono opacity-60">CERTIFICATE OF COMPLETION</p>
            <h3 className="text-xl font-bold mt-2">{c.courseTitle}</h3>
            <p className="mt-1 text-sm opacity-80">Awarded to {c.userName}</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="font-mono">{c.serialNo}</span>
              <Link className="text-orange-500" to={`/verify/${c.serialNo}`}>Verify →</Link>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">Claim a certificate</h2>
      <ul className="divide-y">
        {courses.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-3">
            <span>{c.title}</span>
            <button className="rounded-lg bg-orange-500 text-white px-3 py-1.5 text-sm" onClick={() => claim(c.id)}>
              Claim
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
