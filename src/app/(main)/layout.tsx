import { ClerkProvider } from "@clerk/nextjs"
import { PropsWithChildren } from "react"
import { dark } from "@clerk/themes"

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
        {children}
    </ClerkProvider>
  )
}

export default Layout