import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata = {
  title: "表单管理后台 | 翔哥 AI 工作流",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
