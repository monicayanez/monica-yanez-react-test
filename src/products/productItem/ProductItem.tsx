import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../ProductsState';
import './ProductItem.scss';
import Loader from '../../UI/loader/Loader';
import PageNotFound from '../../pageNotFound/PageNotFound';
import useProductActions from '../ProductServices';

const ProductItem: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { getProductById, deleteProduct } = useProductActions();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const fetchedProduct = await getProductById(id as string);
                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                } else {
                    console.error('Product not found');
                    setProduct(null);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, getProductById]);

    const handleDelete = async () => {
        if (product) {
            try {
                await deleteProduct(product.id.toString());
                navigate('/products');
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    if (loading) return <Loader />;

    if (!product) return <PageNotFound />;

    return (
        <div className="productItemContainer">
            <div className="productItemHeader">
                <div>
                    <h1>Editar {product.title}</h1>
                    <button onClick={() => navigate('/products')} className="backButton">
                        Volver al Listado
                    </button>
                </div>
                <button onClick={() => navigate(`/products/edit/${id}`)} className="editButton">
                    Editar Producto
                </button>
                <button onClick={() => setShowModal(true)} className="deleteButton">
                    Eliminar Producto
                </button>
            </div>
            <div className="productItem">
                <img src={product.image} alt={product.title} />
                <div className="description">
                    <h2>{product.title}</h2>
                    <p>{product.description}</p>
                    <p><strong>Categoría:</strong> {product.category}</p>
                    <p><strong>Precio:</strong> ${product.price}</p>
                    <p><strong>Rating:</strong> {product.rating?.rate || 'N/A'}★ ({product.rating?.count || 0} reviews)</p>
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modalContent">
                        <h2>Confirmar Eliminación</h2>
                        <p>¿Estás seguro de que deseas eliminar este producto?</p>
                        <button onClick={handleDelete}>Eliminar</button>
                        <button onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductItem;
