import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Quill } from 'react-quill';
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';

 
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);
const CustomEditor = ({ value, onChange }) => {
const formats = [
  "align",
  "bold",
  "code-block",
  "color",
  "float",
  "height",
  "image",
  "italic",
  "link",
  "list",
  "placeholder",
  "calltoaction",
  "size",
  "underline",
  "width"
];
const modules = {
  imageActions: {},
  imageFormats: {},
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  },
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    [],
    ["bold", "italic", "underline", { color: [] }],
    [{ align: [] }],
    [{ list: "bullet" }, { list: "ordered" }],
    ["link", "image", "code-block"]
  ]
};

return (
  <ReactQuill
    value={value}
    onChange={onChange}
    formats={formats}
    modules={modules}
    theme="snow"
  />
);
};

export default CustomEditor;
