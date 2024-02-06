import { EditorElement } from "@/providers/editor/editor-provider"
import TextComponent from "./text"
import Container from "./container"

interface Props {
    element: EditorElement
}

const RecursiveComponent = ({ element }: Props) => {
    switch (element.type) {
        case 'text': return <TextComponent element={element}/>
        case '__body': return <Container element={element}/>
        case 'container': return <Container element={element}/>

        default: null
    }
}

export default RecursiveComponent
