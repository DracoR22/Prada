import { EditorBtns } from "@/lib/constants"
import { TypeIcon } from "lucide-react"

const TextPlaceholder = () => {

    // WITH THIS WE CAN DRAG IT TO THE RECURSIVE COMPONENT
    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
       if (type === null) return
       
       e.dataTransfer.setData('componentType', type)
    }

    return (
        <div draggable onDragStart={(e) => {handleDragStart(e, 'text')}} className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center cursor-grab">
            <TypeIcon size={40} className="text-muted-foreground"/>
        </div>
    )
}

export default TextPlaceholder
