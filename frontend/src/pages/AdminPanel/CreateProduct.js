import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllCategories } from '../../api/fetchProducts'; // API to fetch categories
import { createProductAPI } from '../../api/productAPI'; // API to create products

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Nowa');
  const [categoryId, setCategoryId] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await fetchAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Nie udało się załadować kategorii. Spróbuj ponownie później.');
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleFileChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Przygotowanie obiektu FormData
      const formDataToSend = new FormData();

      // Dodanie szczegółów produktu jako JSON
      const productDetails = {
        name: name,
        description: description,
        price: price,
        categoryId: categoryId,
        condition: condition,
      };
      formDataToSend.append("product", JSON.stringify(productDetails));

      // Dodanie obrazów
      for (let i = 0; i < imageFiles.length; i++) {
        formDataToSend.append("images", imageFiles[i]);
      }

      // Wywołanie API
      await createProductAPI(formDataToSend);

      // Powrót na stronę główną lub komunikat o sukcesie
      navigate("/");
    } catch (error) {
      console.error("Błąd podczas tworzenia produktu:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Wystaw produkt na sprzedaż</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
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

        {/* Price */}
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

        {/* Description */}
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

        {/* Condition */}
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

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Kategoria
          </label>
          {loadingCategories ? (
            <p>Ładowanie kategorii...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
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
          )}
        </div>

        {/* Images */}
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

        {/* Submit Button */}
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
