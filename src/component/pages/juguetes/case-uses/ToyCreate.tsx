import React, { useState } from "react";
import Button from "../../../../IU/bottons/Botton";

const CreateToy = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [precio, setPrecio] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newToy = { title, slug, content, precio };
    console.log("Nuevo juguete:", newToy);
    alert(`Juguete creado: ${JSON.stringify(newToy, null, 2)}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">Crear Juguete</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Título
            </label>
            <input
              type="text"
              id="title"
              placeholder="Nombre del juguete"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block mb-1 font-medium">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              placeholder="slug-del-juguete"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block mb-1 font-medium">
              Descripción
            </label>
            <textarea
              id="content"
              placeholder="Escribe una descripción del juguete..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="precio" className="block mb-1 font-medium">
              Precio
            </label>
            <input
              type="number"
              id="precio"
              placeholder="1000"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={0}
            />
          </div>

          {/* Botón */}
          <Button type="submit">Crear Juguete</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateToy;
