import dynamic from 'next/dynamic';

const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false
});

export default QuillEditor;
