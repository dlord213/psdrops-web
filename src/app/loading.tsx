import { LoaderPinwheel } from "lucide-react";

export default function Loading() {
  return (
    <div className="items-center justify-center flex flex-col lg:min-h-[80vh] xl:min-h-[88vh] 2xl:min-h-[90vh] min-h-screen">
      <LoaderPinwheel className="animate-spin" size={96} />
    </div>
  );
}
