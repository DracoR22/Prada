import { PropsWithChildren } from "react"


const AutthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-full flex items-center justify-center">
       {children}
    </div>
  )
}

export default AutthLayout