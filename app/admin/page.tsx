import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata = {
  title: "表单管理后台 | 亚里士多翔的 AI 世界",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
