import type { ReactNode } from "react";

const MainTableLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b p-4 border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 text-white bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            M
          </div>
          <div className="text-4xl font-bold text-gray-900">Medicare</div>
        </div>
      </div>

      <main className="p-4">{children}</main>
    </div>
  );
};

export default MainTableLayout;
