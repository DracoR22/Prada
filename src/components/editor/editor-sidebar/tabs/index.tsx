import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Plus, SettingsIcon, SquareStackIcon } from "lucide-react"


const TabList = () => {
    return (
        <TabsList className=" flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4 ">

        <TabsTrigger value="Settings" className="w-10 h-10 p-0 data-[state=active]:bg-muted hover:bg-muted">
          <SettingsIcon/>
        </TabsTrigger>

        <TabsTrigger value="Components" className="data-[state=active]:bg-muted w-10 h-10 p-0 hover:bg-muted">
          <Plus/>
        </TabsTrigger>
  
        <TabsTrigger value="Layers" className="w-10 h-10 p-0 data-[state=active]:bg-muted hover:bg-muted">
          <SquareStackIcon/>
        </TabsTrigger>

        <TabsTrigger value="Media" className="w-10 h-10 p-0 data-[state=active]:bg-muted hover:bg-muted">
          <Database/>
        </TabsTrigger>

      </TabsList>
    )
}

export default TabList
