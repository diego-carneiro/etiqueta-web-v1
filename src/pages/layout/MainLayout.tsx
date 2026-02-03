import Sidebar from "@/components/Sidebar";
import Content from "@/components/Content";

export default function MainLayout() {
  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <Content />
    </div>
  );
}
