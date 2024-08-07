import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProductStore, { Product } from '../ProductsState';
import './ProductsList.scss';
import Loader from "../../UI/loader/Loader";

const ProductsList: React.FC = () => {
    const { products, currentPage, setProducts, setCurrentPage } = useProductStore();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndStoreProducts = async () => {
            setLoading(true);
            try {
                // Cargar productos desde localStorage
                const storedProducts = localStorage.getItem('products');
                const localProducts: Product[] = storedProducts ? JSON.parse(storedProducts) : [];

                // Cargar productos desde la API
                const response = await fetch('https://fakestoreapi.com/products');
                const apiProducts = await response.json();

                const combinedProducts = [...localProducts, ...apiProducts];

                // Elimina duplicados basado en el id
                const uniqueProducts = Array.from(new Map(combinedProducts.map(product => [product.id, product])).values());

                localStorage.setItem('products', JSON.stringify(uniqueProducts));

                setProducts(uniqueProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndStoreProducts();
    }, [setProducts]);

    if (loading) return <Loader />;

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(filter.toLowerCase())
    );

    const sortedProducts = filteredProducts.sort((a, b) => {
        const aValue = a.price;
        const bValue = b.price;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    const handleSort = (order: 'asc' | 'desc') => {
        setSortOrder(order);
    };

    const handleProductClick = (id: number) => {
        navigate(`/products/${id}`);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 8;
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const renderPagination = () => {
        const pages = [];
        const maxPages = 5;
        const half = Math.floor(maxPages / 2);

        let startPage = Math.max(1, currentPage - half);
        let endPage = Math.min(totalPages, currentPage + half);

        if (endPage - startPage < maxPages - 1) {
            if (startPage > 1) {
                endPage = Math.min(totalPages, endPage + (maxPages - (endPage - startPage)));
            } else {
                startPage = Math.max(1, startPage - (maxPages - (endPage - startPage)));
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button key={i} onClick={() => setCurrentPage(i)} className={i === currentPage ? 'active' : ''}>
                    {i}
                </button>
            );
        }

        return pages;
    };

    const handleAddProduct = () => {
        navigate('/products/create');
    };

    return (
        <div className="productsList">
            <div className="headerList">
                <h1>Productos</h1>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Buscar producto"
                        value={filter}
                        onChange={handleFilterChange}
                    />
                    <div className="sort">
                        <span>Ordenar por Precio</span>
                        <button
                            onClick={() => handleSort('asc')}
                            className={sortOrder === 'asc' ? 'active' : ''}
                        >
                            ↑
                        </button>
                        <button
                            onClick={() => handleSort('desc')}
                            className={sortOrder === 'desc' ? 'active' : ''}
                        >
                            ↓
                        </button>
                    </div>
                    <button onClick={handleAddProduct}>+ Agregar producto</button>
                </div>
            </div>
            <div className="productsGrid">
                {paginatedProducts.map(product => (
                    <div
                        key={product.id}
                        className="productCard"
                        onClick={() => handleProductClick(product.id)}
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                        />
                        <p>{product.title}</p>
                        <p><strong>${product.price}</strong></p>
                    </div>
                ))}
            </div>
            <div className="pagination">
                {renderPagination()}
            </div>
        </div>
    );
};

export default ProductsList;
