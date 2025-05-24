import type { ReactNode } from "react";
import logo from "../../../public/logo.png";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b p-4 border-gray-200">
        <div className="flex items-center">
          <img src={logo} alt="logo" className="h-10 w-10" />
          <div className="text-4xl font-bold text-gray-900">Medicare</div>
        </div>
      </div>

      <main className="p-4">{children}</main>
    </div>
  );
};
