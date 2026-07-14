import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-[#090B10] min-h-screen p-10">

        <TopBar />

        <Outlet />

      </div>

    </div>
  );
}
