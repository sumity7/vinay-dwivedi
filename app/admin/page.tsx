import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";
import { adminEnabled } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin | Complaints", robots: { index: false, follow: false } };

export default function AdminPage() {
  return <AdminDashboard enabled={adminEnabled()} />;
}
