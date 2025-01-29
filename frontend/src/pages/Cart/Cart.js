import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../store/features/cart';
import { delteItemFromCartAction, updateItemToCartAction } from '../../store/actions/cartAction';
import DeleteIcon from '../../components/common/DeleteIcon';
import Modal from 'react-modal';
import { customStyles } from '../../styles/modal';
import { isTokenValid } from '../../utils/jwt-helper';
import { Link, useNavigate } from 'react-router-dom';
import EmptyCart from '../../assets/img/empty.png';

const Cart = () => {
    const cartItems = useSelector(selectCartItems);
    const dispatch = useDispatch();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState({});
    const navigate = useNavigate();

    const onChangeQuantity = useCallback((value, productId, variantId) => {
        dispatch(updateItemToCartAction({
            productId: productId,
            variant_id: variantId,
            quantity: value
        }));
    }, [dispatch]);

    const onDeleteProduct = useCallback((productId, variantId) => {
        setModalIsOpen(true);
        setDeleteItem({
            productId: productId,
            variantId: variantId
        });
    }, []);

    const onCloseModal = useCallback(() => {
        setDeleteItem({});
        setModalIsOpen(false);
    }, []);

    const onDeleteItem = useCallback(() => {
        dispatch(delteItemFromCartAction(deleteItem));
        setModalIsOpen(false);
    }, [deleteItem, dispatch]);

    const subTotal = useMemo(() => {
        let value = 0;
        cartItems?.forEach(element => {
            value += element?.subTotal;
        });
        return value?.toFixed(2);
    }, [cartItems]);

    const isLoggedIn = useMemo(() => {
        return isTokenValid();
    }, []);

    return (
        <div className='flex justify-center bg-gray-100 py-10'>
            <div className='w-full max-w-4xl p-6 bg-white rounded-lg shadow-md'>
                {cartItems?.length > 0 ? (
                    <>
                        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Koszyk</h1>
                        <div className='grid grid-cols-1 gap-4'>
                            {cartItems.map((item, index) => (
                                <div key={index} className='flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm'>
                                    <img
                                        src={item?.thumbnail}
                                        alt={`product-${index}`}
                                        className='w-[100px] h-[100px] object-cover rounded-md border border-gray-200'
                                    />
                                    <div className='flex flex-col justify-between flex-grow ml-4'>
                                        <p className='text-gray-800 font-semibold'>{item?.name || 'Nazwa'}</p>
                                        <p className='text-gray-600 text-sm'>Cena: {item?.price} zł</p>
                                        <p className='text-gray-600 text-sm'>Dostawa: 15 zł</p>
                                        <p className='text-gray-800 font-bold'>Suma: {item?.subTotal} zł</p>
                                    </div>
                                    <button
                                        onClick={() => onDeleteProduct(item?.productId, item?.variant?.id)}
                                        className='text-red-500 hover:text-red-700 flex-shrink-0'
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className='bg-gray-50 p-4 rounded-lg shadow-sm mt-6'>
                            <h2 className='text-lg font-bold text-gray-800'>Podsumowanie</h2>
                            <div className='flex justify-between mt-4'>
                                <span className='text-gray-600'>Suma za przedmioty:</span>
                                <span className='text-gray-800'>{subTotal} zł</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span className='text-gray-600'>Dostawa:</span>
                                <span className='text-gray-800'>{cartItems.length * 15} zł</span>
                            </div>
                            <div className='flex justify-between mt-4 text-lg font-bold'>
                                <span className='text-gray-800'>Łącznie:</span>
                                <span className='text-gray-800'>{(parseFloat(subTotal) + cartItems.length * 15).toFixed(2)} zł</span>
                            </div>
                            <button
                                className='w-full mt-6 bg-gray-800 text-white py-2 rounded hover:bg-gray-700'
                                onClick={() => navigate("/checkout")}
                            >
                                Przejdź do podsumowania
                            </button>
                        </div>
                    </>
                ) : (
                    <div className='text-center'>
                        <img src={EmptyCart} alt='empty-cart' className='w-40 h-40 mx-auto mb-6' />
                        <p className='text-lg font-bold text-gray-800'>Twój koszyk jest pusty</p>
                        <Link
                            to='/'
                            className='inline-block mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700'
                        >
                            Wróć do zakupów
                        </Link>
                    </div>
                )}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={onCloseModal}
                    style={customStyles}
                    contentLabel='Usuń przedmiot'
                >
                    <p className='text-gray-800'>Na pewno chcesz usunąć ten przedmiot?</p>
                    <div className='flex justify-end mt-4'>
                        <button
                            className='text-gray-600 hover:text-gray-800 mr-4'
                            onClick={onCloseModal}
                        >
                            Anuluj
                        </button>
                        <button
                            className='bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600'
                            onClick={onDeleteItem}
                        >
                            Usuń
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Cart;
