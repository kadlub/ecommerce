import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from '../../api/fetchProducts'; // API do pobierania kategorii
import { createProductAPI } from '../../api/productAPI'; // API do tworzenia produktów
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Nowa');
  const [categoryId, setCategoryId] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error('Błąd podczas ładowania kategorii:', err));
  }, []);

  const handleFileChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('condition', condition);
    formData.append('categoryId', categoryId);
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('images', imageFiles[i]);
    }

    try {
      await createProductAPI(formData); // API POST do backendu
      alert('Produkt został pomyślnie utworzony!');
      navigate('/');
    } catch (err) {
      console.error('Błąd podczas tworzenia produktu:', err);
      alert('Wystąpił błąd podczas tworzenia produktu.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Wystaw produkt na sprzedaż</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nazwa produktu
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Cena
          </label>
          <input
            type="number"
            id="price"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Opis produktu
          </label>
          <textarea
            id="description"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Stan produktu
          </label>
          <select
            id="condition"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="Nowa">Nowa</option>
            <option value="Używana">Używana</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Kategoria
          </label>
          <select
            id="category"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Wybierz kategorię</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Zdjęcia produktu
          </label>
          <input
            type="file"
            id="images"
            className="mt-1 block w-full"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
        >
          Wystaw produkt
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
