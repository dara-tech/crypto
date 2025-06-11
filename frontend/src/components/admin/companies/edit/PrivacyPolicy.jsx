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

const Toolbar = ({ editor }) => {
  const { t } = useTranslation();
  if (!editor) return null

  const buttonClass = (name) =>
    `btn btn-sm ${editor.isActive(name) ? 'btn-accent' : 'btn-outline'}`

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b rounded-t-md bg-gray-50">
      <button type="button" className={buttonClass('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>{t('privacyPolicy.bold')}</button>
      <button type="button" className={buttonClass('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>{t('privacyPolicy.italic')}</button>
      <button type="button" className={buttonClass('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>{t('privacyPolicy.underline')}</button>
      <button type="button" className={buttonClass('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>{t('privacyPolicy.bulletList')}</button>
      <button type="button" className={buttonClass('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>{t('privacyPolicy.orderedList')}</button>
    </div>
  )
}

const PrivacyPolicy = ({ formData, onInputChange }) => {
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
        <span className="label-text font-bold text-lg">{t('privacyPolicy.title')}</span>
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
