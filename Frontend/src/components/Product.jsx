import React from 'react';
import { assets, dummyProducts } from '../assets/assets';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Product = (prop) => {
    const location = useLocation();
    const { navigate, cart, setCart } = useAppContext();
    const searchQuery = new URLSearchParams(location.search).get('search')?.toLowerCase() || '';

    const displayProducts = () => {
        let products;
        if (location.pathname === '/') {
            products = dummyProducts.slice(0, 5);
        } else if (location.pathname === '/products') {
            products = dummyProducts;
        } else {
            products = dummyProducts.filter(
                (product) =>
                    product.category.toLowerCase() ===
                    prop.category?.toLowerCase()
            );
        }

        if (!searchQuery) {
            return products;
        }

        return products.filter((product) =>
            product.name.toLowerCase().includes(searchQuery) ||
            product.category.toLowerCase().includes(searchQuery)
        );
    };

    const filteredProducts = displayProducts();

    // helper: get quantity from cart
    const getQuantity = (productId) => {
        const item = cart?.find((i) => i.product?._id === productId);
        return item ? item.quantity : 0;
    };

    return (
        <>
            {filteredProducts.map((product, index) => {
                const quantity = getQuantity(product._id);

                return (
                    <div
                        key={index}
                        className="border border-gray-500/20 rounded-md max-w-54 md:px-4 px-3 py-2"
                    >
                        {/* IMAGE */}
                        <div
                            onClick={() =>
                                navigate(
                                    `/products/${product.category.toLowerCase()}/${product._id}`
                                )
                            }
                            className="group cursor-pointer flex items-center justify-center px-2"
                        >
                            <img
                                className="group-hover:scale-105 transition max-w-26 md:max-w-36"
                                src={product.image[0]}
                                alt={product.name}
                            />
                        </div>

                        {/* DETAILS */}
                        <div className="text-gray-500/60 text-sm">
                            <p>{product.category}</p>

                            <p className="text-gray-700 font-medium text-lg truncate w-full">
                                {product.name}
                            </p>

                            {/* STARS */}
                            <div className="flex items-center gap-0.5 color-primary">
                                {Array(5)
                                    .fill('')
                                    .map((_, i) =>
                                        i < 4 ? (
                                            <img
                                                key={i}
                                                className="md:w-3.5 w-3"
                                                src={assets.star_icon}
                                                alt="star"
                                            />
                                        ) : (
                                            <img
                                                key={i}
                                                className="md:w-3.5 w-3"
                                                src={assets.star_dull_icon}
                                                alt="star"
                                            />
                                        )
                                    )}
                                <p>(4)</p>
                            </div>

                            {/* PRICE + CART */}
                            <div className="flex items-end justify-between mt-3">
                                <p className="md:text-xl text-base font-medium text-primary">
                                    ${product.offerPrice}{' '}
                                    <span className="text-gray-500/60 md:text-sm text-xs line-through">
                                        ${product.price}
                                    </span>
                                </p>

                                <div className="text-primary">
                                    {quantity === 0 ? (
                                        // ADD BUTTON
                                        <button
                                            className="flex items-center cursor-pointer justify-center gap-1 bg-primary/10 border border-primary/40 px-2 md:w-20 w-16 h-8.5 rounded"
                                            onClick={() => {
                                                setCart((prev) => 
                                                    (prev) ?
                                                    [...prev,
                                                    {
                                                        product,
                                                        quantity: 1,
                                                    },] :
                                                    [{
                                                        product,
                                                        quantity: 1,
                                                    },]);
                                            }}
                                        >
                                            <svg
                                                className="w-3.5"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                            >
                                                <path
                                                    d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                                                    stroke="#4fbf8b"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Add
                                        </button>
                                    ) : (
                                        // COUNTER
                                        <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                                            
                                            {/* MINUS */}
                                            <button
                                                onClick={() => {
                                                    setCart((prev) =>
                                                        prev.map((item) =>
                                                            item.product._id === product._id
                                                                ? {
                                                                    ...item,
                                                                    quantity: item.quantity - 1,
                                                                  } : item)
                                                            .filter(
                                                                (item) =>
                                                                    item.quantity > 0
                                                            )
                                                    );
                                                }}
                                                className="cursor-pointer text-md px-2 h-full"
                                            >
                                                -
                                            </button>

                                            {/* COUNT */}
                                            <span className="w-5 text-center">
                                                {quantity}
                                            </span>

                                            {/* PLUS */}
                                            <button
                                                onClick={() => {
                                                    setCart((prev) =>
                                                        prev.map((item) =>
                                                            item.product._id === product._id
                                                                ? {
                                                                      ...item,
                                                                      quantity:
                                                                          item.quantity + 1,
                                                                  }
                                                                : item
                                                        )
                                                    );
                                                }}
                                                className="cursor-pointer text-md px-2 h-full"
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default Product;