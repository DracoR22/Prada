import { EditorBtns } from "@/lib/constants"
import { PlaySquare } from "lucide-react"

const VideoPlaceholder = () => {

   // WITH THIS WE CAN DRAG IT TO THE RECURSIVE COMPONENT
   const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    
    e.dataTransfer.setData('componentType', type)
 }

  return (
    <div draggable onDragStart={(e) => {handleDragStart(e, 'video')}} className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center cursor-grab">
         <PlaySquare size={40} className="text-muted-foreground"/>
    </div>
  )
}

export default VideoPlaceholder