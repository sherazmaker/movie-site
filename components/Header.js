import { useRouter } from "next/router"
import { FaMagnifyingGlassPlus } from "react-icons/fa6"
import { FaMagnifyingGlass } from "react-icons/fa6"
import { FaPlus } from "react-icons/fa6"

export default function Header() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center w-full p-6">
        <div className="w-max md:border border-gray-300 md:bg-gray-50 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 px-6 py-3 rounded-full gap-3 md:gap-12">
            <p className="flex items-center gap-3 whitespace-nowrap text-sm md:text-lg font-semibold">
                <FaMagnifyingGlassPlus size={20}/>Lead Finder
            </p>
            <div className="flex gap-4">
                <button 
                onClick={() => router.push("/search")}
                className="button-primary flex items-center gap-2 text-sm md:text-base"
                >
                <FaMagnifyingGlass />Search Existing Leads
                </button>
                <button
                onClick={() => router.push("/scrape")} 
                className="button-secondary flex items-center gap-2 text-sm md:text-base"
                >
                <FaPlus />Scrape New Leads
                </button>
            </div>
        </div>
    </div>
  )
}
