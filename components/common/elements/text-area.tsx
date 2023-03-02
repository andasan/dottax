/* eslint-disable newline-per-chained-call */

import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import { TextStyleOptions, TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Box, Button, Text, Divider, Group, Modal, TextInput } from '@mantine/core';
import { IconList, IconStrikethrough, IconBold, IconItalic, IconIndentIncrease, IconH1, IconH2, IconH3, IconH4, IconH5, IconH6, IconListNumbers, IconSeparatorHorizontal, IconBlockquote, IconCornerDownLeft, IconArrowBackUp, IconArrowForwardUp, IconClearFormatting, IconLink } from '@tabler/icons-react';
import { FormValues } from '@/screens/email-template';

const MenuBar = ({ editor }: { editor: Editor }) => {
  const [url, setUrl] = useState<string>("");
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setUrl(editor.getAttributes("link").href || "");
    setIsOpen(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUrl("");
  }, []);

  const saveLink = useCallback(() => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    closeModal();
  }, [editor, url, closeModal]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <Modal
        opened={modalIsOpen}
        onClose={() => setIsOpen(false)}
        centered
        title="Enter a link"
      >
        <Box p="md" sx={{ textAlign: 'center' }}>
          <TextInput
            py={20}
            value={url}
            onChange={(e) => setUrl(e.currentTarget.value)}
          />
          <Button mx={5} onClick={saveLink}>Save</Button>
          <Button mx={5} onClick={removeLink} color="red">Remove</Button>
        </Box>

      </Modal>

      <Group align="stretch" position="left" spacing={2}>
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <IconBold size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <IconItalic size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          <IconStrikethrough size={12} />
        </Button>
        <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          <IconClearFormatting size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          <IconIndentIncrease size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          <IconH1 size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          <IconH2 size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          <IconH3 size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          <IconH4 size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          <IconH5 size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          <IconH6 size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          <IconList size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          <IconListNumbers size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          <IconBlockquote size={12} />
        </Button>
        <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <IconSeparatorHorizontal size={12} />
        </Button>
        <Button onClick={() => editor.chain().focus().setHardBreak().run()}>
          <IconCornerDownLeft size={12} />
        </Button>
        <Button onClick={openModal}>
          <IconLink size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <IconArrowBackUp size={12} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <IconArrowForwardUp size={12} />
        </Button>
      </Group>
    </>
  );
};

interface CustomTextAreaProps {
  label: string;
  templateState: FormValues;
  setTemplateState: Dispatch<SetStateAction<FormValues>>;
}

interface CustomTextStyleOptions extends TextStyleOptions {
  types: string[];
}

export default function CustomTextArea({ label, templateState, setTemplateState }: CustomTextAreaProps) {

  const customTextStyleOptions: CustomTextStyleOptions = {
    types: [ListItem.name],
    HTMLAttributes: {}
  };

  const editor = useEditor({
    onUpdate: (val) => {
      const updatedBody = val.editor.getHTML();
      setTemplateState((prev) => ({ ...prev, body: updatedBody }));
    },
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure(customTextStyleOptions),
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: templateState.body,
  }) as Editor;

  // console.log(editor.getHTML());

  return (
    <>
      <Text mt={20}>{label}</Text>
      <Box style={{
        border: '1px solid #373A40',
        backgroundColor: '#25262b',
        borderRadius: '4px',
        marginRight: 0,
        padding: '10px 14px',
        textAlign: 'left',
        minHeight: '42px',
      }}>
        <MenuBar editor={editor} />
        <Divider mt={5} mb={20} />
        <EditorContent editor={editor} />
      </Box>
    </>
  );
}
