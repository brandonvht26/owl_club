// src/components/MathEditor/MathEditor.jsx (NUEVO ARCHIVO)

import React, { useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Estilos del editor
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Estilos de KaTeX

// Hacemos que KaTeX esté disponible globalmente para que Quill lo encuentre
window.katex = katex;

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        // ¡El botón mágico para las fórmulas!
        ['formula'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    // ¡El formato para las fórmulas!
    'formula'
];

const MathEditor = ({ value, onChange }) => {
    return (
        <ReactQuill
            theme="snow"
            value={value || ''}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder="Escribe tu pregunta... ¡Puedes añadir fórmulas matemáticas!"
        />
    );
};

export default MathEditor;