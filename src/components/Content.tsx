import { Outlet } from "react-router-dom";

export default function Content() {
  return (
    <div className="w-full min-h-screen bg-gray-200">
      <Outlet />
    </div>
  );
}
