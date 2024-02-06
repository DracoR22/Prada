import { EditorElement } from "@/providers/editor/editor-provider"
import TextComponent from "./text"
import Container from "./container"
import VideoComponent from "./video"
import LinkComponent from "./link-component"

interface Props {
    element: EditorElement
}

const RecursiveComponent = ({ element }: Props) => {
    switch (element.type) {
        case 'text': return <TextComponent element={element}/>
        case '__body': return <Container element={element}/>
        case 'container': return <Container element={element}/>
        case 'video': return <VideoComponent element={element}/>
        case '2Col': return <Container element={element} />
        case 'link': return <LinkComponent element={element} />
        default: null
    }
}

export default RecursiveComponent
