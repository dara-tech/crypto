import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'

const Toolbar = ({ editor }) => {
  if (!editor) return null

  const buttonClass = (name) =>
    `btn btn-sm ${editor.isActive(name) ? 'btn-accent' : 'btn-outline'}`

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b rounded-t-md bg-gray-50">
      <button type="button" className={buttonClass('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
      <button type="button" className={buttonClass('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
      <button type="button" className={buttonClass('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
      <button type="button" className={buttonClass('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>• Bullet List</button>
      <button type="button" className={buttonClass('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. Ordered List</button>
    </div>
  )
}

const PrivacyPolicy = ({ formData, onInputChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        paragraph: false,
        listItem: false,
        bulletList: false,
        orderedList: false,
      }),
      Bold,
      Italic,
      Underline,
      Paragraph,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: formData.privacyPolicy || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onInputChange({ target: { name: 'privacyPolicy', value: html } })
    },
  })

  useEffect(() => {
    if (editor && formData.privacyPolicy !== editor.getHTML()) {
      editor.commands.setContent(formData.privacyPolicy || '', false)
    }
  }, [formData.privacyPolicy, editor])

  return (
    <div className="space-y-4">
      <label className="label">
        <span className="label-text font-bold text-lg">Privacy Policy</span>
      </label>

      <div className="rounded-md border shadow-sm">
        <Toolbar editor={editor} />
        <div className="p-2 min-h-[12rem]">
          <EditorContent editor={editor} className="outline-none" />
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
