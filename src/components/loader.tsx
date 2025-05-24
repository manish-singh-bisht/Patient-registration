import { Loader2 } from "lucide-react";

export const Loader = ({ label }: { label?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin mb-2" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
};
