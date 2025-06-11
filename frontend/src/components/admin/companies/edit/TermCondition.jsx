import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'

// 🎯 Toolbar with advanced controls
const Toolbar = ({ editor }) => {
  const { t } = useTranslation();
  if (!editor) return null

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b rounded-t-md bg-gray-50">
      <button
        type="button"
        className={`btn btn-sm ${editor.isActive('bold') ? 'btn-accent' : 'btn-outline'}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        {t('termsAndConditions.bold')}
      </button>
      <button
        type="button"
        className={`btn btn-sm ${editor.isActive('italic') ? 'btn-accent' : 'btn-outline'}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        {t('termsAndConditions.italic')}
      </button>
      <button
        type="button"
        className={`btn btn-sm ${editor.isActive('underline') ? 'btn-accent' : 'btn-outline'}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        {t('termsAndConditions.underline')}
      </button>
      <button
        type="button"
        className={`btn btn-sm ${editor.isActive('bulletList') ? 'btn-accent' : 'btn-outline'}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        {t('termsAndConditions.bulletList')}
      </button>
      <button
        type="button"
        className={`btn btn-sm ${editor.isActive('orderedList') ? 'btn-accent' : 'btn-outline'}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        {t('termsAndConditions.orderedList')}
      </button>
    </div>
  )
}

const TermsAndConditions = ({ formData, onInputChange }) => {
  const { t } = useTranslation();
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
    content: formData.termsConditions || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onInputChange({ target: { name: 'termsConditions', value: html } })
    },
  })

  // Sync external formData.termConditions changes into editor content
  useEffect(() => {
    if (editor && formData.termsConditions !== editor.getHTML()) {
      editor.commands.setContent(formData.termsConditions || '', false)
    }
  }, [formData.termsConditions, editor])

  return (
    <div className="space-y-4">
      <label className="label">
        <span className="label-text font-bold text-lg">{t('termsAndConditions.title')}</span>
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

export default TermsAndConditions
