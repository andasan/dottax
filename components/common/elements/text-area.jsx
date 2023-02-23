// import { Color } from '@tiptap/extension-color';
// import ListItem from '@tiptap/extension-list-item';
// import TextStyle from '@tiptap/extension-text-style';
// import { EditorContent, useEditor } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';

// import {
//     Button,
//   } from '@mantine/core';

// export default function CustomTextArea() {
//   const editor = useEditor({
//     extensions: [
//       Color.configure({ types: [TextStyle.name, ListItem.name] }),
//       TextStyle.configure({ types: [ListItem.name] }),
//       StarterKit.configure({
//         bulletList: {
//           keepMarks: true,
//           keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//         },
//         orderedList: {
//           keepMarks: true,
//           keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//         },
//       }),
//     ],
//     content: `<p>A digital Tuition Enrolment Certificate (T2202) has been issued to you and is ready for viewing.
//         Please see the attached file for your T2202.</p>
//         <p>If you have any queries, please contact <a href="mailto:info@ciccc.ca">here</a></p>

//         Thank you,<br>
//         Cornerstone International Community College Admin`,
//   });

//   return (
//     <>
//       <MenuBar editor={editor} />
//       <EditorContent editor={editor} />
//     </>
//   );
// }

// const MenuBar = ({ editor }: { editor: any }) => {
//   if (!editor) {
//     return null;
//   }

//   return (
//     <>
//       <Button
//         onClick={() => editor.chain().focus().toggleBold().run()}
//         disabled={!editor.can().chain().focus().toggleBold().run()}
//         className={editor.isActive('bold') ? 'is-active' : ''}
//       >
//         bold
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//         disabled={!editor.can().chain().focus().toggleItalic().run()}
//         className={editor.isActive('italic') ? 'is-active' : ''}
//       >
//         italic
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleStrike().run()}
//         disabled={!editor.can().chain().focus().toggleStrike().run()}
//         className={editor.isActive('strike') ? 'is-active' : ''}
//       >
//         strike
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleCode().run()}
//         disabled={!editor.can().chain().focus().toggleCode().run()}
//         className={editor.isActive('code') ? 'is-active' : ''}
//       >
//         code
//       </Button>
//       <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>clear marks</Button>
//       <Button onClick={() => editor.chain().focus().clearNodes().run()}>clear nodes</Button>
//       <Button
//         onClick={() => editor.chain().focus().setParagraph().run()}
//         className={editor.isActive('paragraph') ? 'is-active' : ''}
//       >
//         paragraph
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//         className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
//       >
//         h1
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//         className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
//       >
//         h2
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//         className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
//       >
//         h3
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
//         className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
//       >
//         h4
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
//         className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
//       >
//         h5
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
//         className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
//       >
//         h6
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//         className={editor.isActive('bulletList') ? 'is-active' : ''}
//       >
//         bullet list
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleOrderedList().run()}
//         className={editor.isActive('orderedList') ? 'is-active' : ''}
//       >
//         ordered list
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//         className={editor.isActive('codeBlock') ? 'is-active' : ''}
//       >
//         code block
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().toggleBlockquote().run()}
//         className={editor.isActive('blockquote') ? 'is-active' : ''}
//       >
//         blockquote
//       </Button>
//       <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
//         horizontal rule
//       </Button>
//       <Button onClick={() => editor.chain().focus().setHardBreak().run()}>hard break</Button>
//       <Button
//         onClick={() => editor.chain().focus().undo().run()}
//         disabled={!editor.can().chain().focus().undo().run()}
//       >
//         undo
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().redo().run()}
//         disabled={!editor.can().chain().focus().redo().run()}
//       >
//         redo
//       </Button>
//       <Button
//         onClick={() => editor.chain().focus().setColor('#958DF1').run()}
//         className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
//       >
//         purple
//       </Button>
//     </>
//   );
// };

import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Box, Button, Text, Divider } from '@mantine/core';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </Button>
      <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>clear marks</Button>
      <Button onClick={() => editor.chain().focus().clearNodes().run()}>clear nodes</Button>
      <Button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </Button>
      <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </Button>
      <Button onClick={() => editor.chain().focus().setHardBreak().run()}>hard break</Button>
      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </Button>
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </Button>
      <Button
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
      >
        purple
      </Button>
    </>
  );
};

export default function CustomTextArea({ label, templateState, setTemplateState }) {
  const editor = useEditor({
    onUpdate: (val) => {
      const updatedBody = val.editor.getHTML();
      setTemplateState((prev) => ({ ...prev, body: updatedBody }));
    },
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
    content: templateState.body,
  });

  // console.log(editor.getHTML());

  return (
    <>
      <Text mt={20}>{label}</Text>
    <Box style={headerBlue}>
      <MenuBar editor={editor} />
      <Divider mt={5} mb={20} />
      <EditorContent editor={editor} />
    </Box>
    </>
  );
}

const headerBlue = {
  border: '1px solid #373A40',
  backgroundColor: '#25262b',
  borderRadius: '4px',
  marginRight: 0,
  padding: '10px 14px',
  textAlign: 'left',
  minHeight: '42px',
};
