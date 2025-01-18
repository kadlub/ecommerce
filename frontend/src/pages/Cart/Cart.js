import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartItems } from '../../store/features/cart';
import { NumberInput } from '../../components/NumberInput/NumberInput';
import { delteItemFromCartAction, updateItemToCartAction } from '../../store/actions/cartAction';
import DeleteIcon from '../../components/common/DeleteIcon';
import Modal from 'react-modal';
import { customStyles } from '../../styles/modal';
import { isTokenValid } from '../../utils/jwt-helper';
import { Link, useNavigate } from 'react-router-dom';
import EmptyCart from '../../assets/img/empty.png';

const headers = [
    "Produkty", "Cena", "Ilość", "Dostawa", "Cena z dostawą", ""
];


const Cart = () => {
    const cartItems = useSelector(selectCartItems);
    const dispatch = useDispatch();
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [deleteItem, setDeleteItem] = useState({});
    const navigate = useNavigate();

    const onChangeQuantity = useCallback((value, productId, variantId) => {

        console.log("Received ", value);

        dispatch(updateItemToCartAction({
            productId: productId,
            variant_id: variantId,
            quantity: value
        }))


    }, [dispatch]);

    const onDeleteProduct = useCallback((productId, variantId) => {
        setModalIsOpen(true);
        setDeleteItem({
            productId: productId,
            variantId: variantId
        })
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
            value += element?.subTotal + 15
        });
        return value?.toFixed(2);
    }, [cartItems]);

    const isLoggedIn = useMemo(() => {
        return isTokenValid();
    }, [])
    console.log("isLoggedIn ", isLoggedIn, isTokenValid());

    return (
        <>
            <div className='p-4'>
                {cartItems?.length > 0 &&
                    <>
                        <p className='text-xl text-black p-4'>Koszyk</p>
                        <table className='w-full text-lg'>
                            <thead className='text-sm bg-black text-white uppercase'>
                                <tr>
                                    {headers?.map(header => {
                                        return (
                                            <th scope='col' className='px-6 py-3'>
                                                {header}
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartItems?.map((item, index) => {
                                        return (
                                            <tr className='p-4 bg-white border-b'>
                                                <td>
                                                    <div className='flex p-4'>
                                                        <img src={item?.thumbnail} alt={'product-' + index} className='w-[120px] h-[120px] object-cover' />
                                                        <div className='flex flex-col text-sm px-2 text-gray-600'>
                                                            <p>{item?.name || 'Nazwa'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p className='text-center text-sm text-gray-600'>{item?.price}zł</p>
                                                </td>

                                                <td>
                                                    <p className='text-center text-sm text-gray-600'>1</p>
                                                </td>

                                                <td>
                                                    <p className='text-center text-sm text-gray-600'>15 zł</p>
                                                </td>

                                                <td>
                                                    <p className='text-center text-sm text-gray-600'>{item?.subTotal + 15}zł</p>
                                                </td>

                                                <td>
                                                    <button className='flex justify-center items-center w-full' onClick={() => onDeleteProduct(item?.productId, item?.variant?.id)}><DeleteIcon /></button>
                                                </td>
                                            </tr>

                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <div className='flex justify-between bg-gray-200 p-8'>
                            <div>
                                <p className='text-lg font-bold'>Kod zniżkowy</p>
                                <p className='text-sm text-gray-600'>Tutaj wprowadź swój kod</p>
                                <form>
                                    <input type='text' className='w-[150px] h-[48px] mt-2 border-gray-500 p-2 hover:outline-none' placeholder='Kod zniżkowy' />
                                    <button className='w-[80px] h-[48px] bg-black text-white'>Zatwierdź</button>
                                </form>
                            </div>
                            <div className='mr-20 pr-8'>
                                <div className='flex gap-8 text-lg'><p className='w-[120px]'>Suma za przedmioty</p> <p>{subTotal}zł</p></div>
                                <div className='flex gap-8 text-lg mt-2'><p className='w-[120px]'>Dostawa</p> <p>{15}zł</p></div>
                                <div className='flex gap-8 text-lg mt-2 font-bold'><p className='w-[120px]'>Suma</p> <p>{subTotal}zł</p></div>
                                <hr className='h-[2px] bg-slate-400 mt-2'></hr>
                                {isLoggedIn && <button className='w-full items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800' onClick={() => navigate("/checkout")}>Podsumowanie</button>}
                                {!isLoggedIn && <div className='p-4'><Link to={"/v1/login"} className='w-full p-2 items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'>Zaloguj się!</Link></div>}
                            </div>
                        </div>
                    </>}
                {
                    !cartItems?.length &&
                    <div className='w-full items-center text-center'>
                        <div className='flex justify-center'><img src={EmptyCart} className='w-[512px] h-[512px] ' alt='empty-cart' /></div>
                        <p className='text-3xl font-bold'>Twój koszyk jest pusty</p>
                        <div className='p-4'><Link to={"/"} className='w-full p-2 items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'>Wróć do zakupów</Link></div>
                    </div>
                }
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={onCloseModal}
                style={customStyles}
                contentLabel="Usuń przedmiot"
            >
                <p>Na pewno chcesz usunąć ten przedmiot?</p>
                <div className='flex justify-between p-4'>
                    <button className='h-[48px]' onClick={onCloseModal}>Anuluj</button>
                    <button className='bg-black text-white w-[80px] h-[48px] border rounded-lg' onClick={onDeleteItem}>Usuń</button>
                </div>
            </Modal>
        </>
    )
}

export default Cart