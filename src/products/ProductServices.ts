import useProductStore, {Product} from './ProductsState';

const API_URL = 'https://fakestoreapi.com/products';

const addProduct = async (product: Product): Promise<void> => {
    try {
        // Simula el POST a la API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        const result = await response.json();
        console.log('Response from API:', result);

        // Agrega el producto a localStorage
        const storedProducts = localStorage.getItem('products');
        const productsArray: Product[] = storedProducts ? JSON.parse(storedProducts) : [];
        productsArray.push(product);
        localStorage.setItem('products', JSON.stringify(productsArray));

        // Actualiza el estado global
        const { setProducts } = useProductStore.getState();
        setProducts(productsArray);
    } catch (error) {
        console.error('Error adding product:', error);
    }
};

const getProducts = async (): Promise<Product[]> => {
    try {
        const products = localStorage.getItem('products');
        if (products) {
            try {
                const parsedProducts = JSON.parse(products);
                return Array.isArray(parsedProducts) ? parsedProducts : [];
            } catch (jsonError) {
                console.error('Error parsing JSON from localStorage:', jsonError);
                return [];
            }
        } else {
            console.log('No products found in localStorage');
            return [];
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

const getProductById = async (id: string): Promise<Product | null> => {
    const productsFromLocalStorage = localStorage.getItem('products');
    if (productsFromLocalStorage) {
        const products: Product[] = JSON.parse(productsFromLocalStorage);
        const foundProduct = products.find(product => product.id === parseInt(id));
        if (foundProduct) {
            return foundProduct;
        }
    }

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

const updateProduct = async (id: string, product: Product): Promise<void> => {
    console.log('Updating product:', { id, product });
    try {
        // Simula el PUT a la API
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        await response.json();

        // Actualiza el producto en localStorage
        const storedProducts = localStorage.getItem('products');
        const productsArray: Product[] = storedProducts ? JSON.parse(storedProducts) : [];
        const updatedProducts = productsArray.map(p => p.id.toString() === id ? product : p);
        localStorage.setItem('products', JSON.stringify(updatedProducts));

        // Actualiza el estado global
        const { setProducts } = useProductStore.getState();
        setProducts(updatedProducts);
    } catch (error) {
        console.error('Error updating product:', error);
    }
};

const deleteProduct = async (id: string): Promise<void> => {
    try {
        // Simula la eliminación en la API
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        console.log('Response:', result);

        // Actualiza localStorage
        const storedProducts = localStorage.getItem('products');
        const productsArray: Product[] = storedProducts ? JSON.parse(storedProducts) : [];
        const updatedProducts = productsArray.filter(product => product.id.toString() !== id);
        localStorage.setItem('products', JSON.stringify(updatedProducts));

        // Actualiza el estado global
        const { setProducts } = useProductStore.getState();
        setProducts(updatedProducts);
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                const base64Data = reader.result.toString();
                localStorage.setItem('uploadedImage', base64Data);
                resolve(base64Data);
            } else {
                reject(new Error('Image reading failed'));
            }
        };
        reader.onerror = () => {
            reject(new Error('Image reading failed'));
        };
        reader.readAsDataURL(file);
    });
};

const useProductActions = () => ({
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadImage,
});

export default useProductActions;
