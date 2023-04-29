import { forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export interface TiptapMethods {
    addContent: (content: string) => void
}

interface TiptapProps {
    content: string
}

const Tiptap = forwardRef<TiptapMethods, TiptapProps>((props, ref) => {
    const editor = useEditor({
        extensions: [StarterKit],
        editorProps: {
            attributes: {
                class: 'prose prose-sm focus:outline-none mx-auto',
            },
        },
    }) as Editor

    const addContent = (content: string) => {
        if (editor && content != undefined && content != 'undefined') {
            editor.chain().focus().setContent(content, true).run()
            editor.commands.scrollIntoView()
        }
    }

    useImperativeHandle(ref, () => ({
        addContent,
    }))

    return <EditorContent editor={editor} />
})

Tiptap.displayName = 'Tiptap'

export default Tiptap
