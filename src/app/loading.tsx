import { LoaderPinwheel } from "lucide-react";

export default function Loading() {
    return <div className="items-center justify-center flex flex-col 2xl:min-h-[90vh]">
        <LoaderPinwheel className="animate-spin" size={96}/>
    </div>
}