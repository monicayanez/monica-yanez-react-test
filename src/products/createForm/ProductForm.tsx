import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useProductStore, { Product } from '../ProductsState';
import useProductActions from '../ProductServices';
import './ProductForm.scss';
import Loader from '../../UI/loader/Loader';

interface FormValues {
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rate: number;
    count: number;
}

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { products, setProducts } = useProductStore();
    const { addProduct, updateProduct, uploadImage } = useProductActions();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            title: '',
            price: 0,
            description: '',
            category: '',
            image: '',
            rate: 0,
            count: 0,
        },
        mode: 'onChange'
    });

    const [imageURL, setImageURL] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const existingProduct = products.find(p => p.id === parseInt(id));
            if (existingProduct) {
                setValue('title', existingProduct.title);
                setValue('price', existingProduct.price);
                setValue('description', existingProduct.description);
                setValue('category', existingProduct.category);
                setValue('image', existingProduct.image);
                setImageURL(existingProduct.image);
                setValue('rate', existingProduct.rating.rate);
                setValue('count', existingProduct.rating.count);
            }
        }
    }, [id, products, setValue]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const imageURL = await uploadImage(file);
                setImageURL(imageURL);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        const product: Product = {
            id: id ? parseInt(id) : Math.floor(Math.random() * 1000),
            title: data.title,
            price: parseFloat(data.price as any),
            description: data.description,
            category: data.category,
            image: imageURL || localStorage.getItem('productImageURL') || '',
            rating: {
                rate: parseFloat(data.rate as any),
                count: parseInt(data.count as any),
            },
        };

        const storedProducts = localStorage.getItem('products');
        const productsArray: Product[] = storedProducts ? JSON.parse(storedProducts) : [];

        if (id) {
            const updatedProducts = productsArray.map(p => p.id === product.id ? product : p);
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            setProducts(updatedProducts); // Actualiza el estado global
            await updateProduct(id, product); // Actualiza en la API
        } else {
            productsArray.push(product);
            localStorage.setItem('products', JSON.stringify(productsArray));
            setProducts(productsArray);
            await addProduct(product);
        }
        setLoading(false);
        navigate('/products');
    };

    return (
        <div className="productForm">
            {loading && <Loader />}
            <h1>{id ? 'Actualizar producto' : 'Agregar nuevo producto'}</h1>
            <button onClick={() => navigate('/products')} className="backButton">
                Volver al Listado
            </button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Titulo:
                    <div className="error">
                        <input
                            type="text"
                            {...register('title', {required: 'El producto necesita un título'})}
                        />
                        {errors.title && <span>{errors.title.message}</span>}
                    </div>
                </label>
                <label>
                    Precio:
                    <div className="error">
                        <input
                            type="number"
                            step="any"
                            {...register('price', {required: 'Se necesita un precio'})}
                        />
                        {errors.price && <span>{errors.price.message}</span>}
                    </div>
                </label>
                <label>
                    Descripción:
                    <div className="error">
                        <textarea
                            {...register('description', {required: 'Se necesita una descripción'})}
                        />
                        {errors.description && <span>{errors.description.message}</span>}
                    </div>
                </label>
                <label>
                    Categoría:
                    <div className="error">
                        <input
                            type="text"
                            {...register('category', {required: 'Se necesita una categoría'})}
                        />
                        {errors.category && <span>{errors.category.message}</span>}
                    </div>
                </label>
                <label>
                    Imagen:
                    <div className="imageUploaded">
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        {imageURL && <img src={imageURL} alt="Preview" style={{width: '100px', height: '100px'}}/>}
                    </div>
                </label>
                <label>
                    Calificación:
                    <div className="error">
                        <input
                            type="number"
                            step="any"
                            {...register('rate', {
                                required: 'Se necesita una calificación',
                                min: {value: 0, message: 'La calificación mínima es 0'},
                                max: {value: 5, message: 'La calificación máxima es 5'},
                                validate: value => Math.abs(value * 10 % 1) < 1e-10 || ''
                            })}
                        />
                        {errors.rate && <span>{errors.rate.message}</span>}
                    </div>
                </label>
                <label>
                    Votos:
                    <div className="error">
                        <input
                            type="number"
                            {...register('count', {
                                required: 'Se necesita una cantidad de votos',
                                min: {value: 0, message: 'La cantidad mínima de votos es 0'},
                            })}
                        />
                        {errors.count && <span>{errors.count.message}</span>}
                    </div>
                </label>
                <button type="submit">{id ? 'Actualizar producto' : 'Agregar producto'}</button>
            </form>
        </div>
    );
};

export default ProductForm;
