import create from "zustand";

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

interface ProductState {
    products: Product[];
    currentPage: number;
    setProducts: (products: Product[]) => void;
    setCurrentPage: (page: number) => void;
    addProduct: (product: Product) => void;
    updateProduct: (id: number, updatedProduct: Product) => void;
}

const useProductStore = create<ProductState>((set) => ({
    products: [],
    currentPage: 1,
    setProducts: (products) => set({ products }),
    setCurrentPage: (page) => set({ currentPage: page }),
    addProduct: (product) => set((state) => ({
        products: [...state.products, product],
    })),
    updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map((product) =>
            product.id === id ? updatedProduct : product
        ),
    })),
}));

export default useProductStore;
