import { EditorBtns } from "@/lib/constants"


const ContainerPlaceholder = () => {

     // WITH THIS WE CAN DRAG IT TO THE RECURSIVE COMPONENT
     const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return
        
        e.dataTransfer.setData('componentType', type)
     }

  return (
    <div draggable onDragStart={(e) => {handleDragStart(e, 'container')}} className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center cursor-grab">
       <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full"/>
    </div>
  )
}

export default ContainerPlaceholder