import BlurPage from "@/components/global/blur-page"
import { PropsWithChildren } from "react"


const PipelineLayout = ({ children }: PropsWithChildren) => {
  return (
    <BlurPage>
        {children}
    </BlurPage>
  )
}

export default PipelineLayout