'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Menu from '../../components/Menu';
import Order from '../../components/Order';
import InfoModal from '../../components/InfoModal';
import { 
  getTaxRate,
  getTotalFromOrder, 
  floatToDollars, 
  flattenMenu,
  fetchMenu,
  fetchOrder,
  fetchAddOrder 
} from '../../services';


export default function Group() {
  interface Order {
    name: string;
    email: string;
    restaurant: object;
    order: object;
    open: boolean;
  }

  const [isDone, setIsDone] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [groupOpen, setGroupOpen] = useState(null);

  const searchParams = useSearchParams();
  const guestEmail = searchParams.get('email');
  const groupId = searchParams.get('group');

  const [isLoadingOrder, setLoadingOrder] = useState(true);
  const [isLoadingMenu, setLoadingMenu] = useState(true);
  
  const [guestOrder, setGuestOrder] = useState({})

  const taxRate =getTaxRate();

  const basePostData = {
      "id": groupId, 
      "email": guestEmail, 
  };

  useEffect(() => {
    if(orderData){
      (async () => {
        const data = await fetchMenu(orderData.restaurant.menu);
        setMenuData(data);
        setLoadingMenu(false);
      })();
    }
  }, [orderData])

  useEffect(() => {
    (async () => {
      const data = await fetchOrder(basePostData);
      setOrderData(data);
      setLoadingOrder(false);
      setGroupOpen(data.open);
      setGuestOrder(data.order);
      })();
  }, [])

  const handleSumbit = () => {
    setLoadingOrder(true);
    addOrder();
  }

  const addOrder = async () => {
    const postData = { 
      ...basePostData, 
      order: guestOrder
    }; 

    const success = await fetchAddOrder(postData)
    if (success){
      setLoadingOrder(false);
      setIsDone(true);
    }
  };

  const addItemCallback = (item, type) => {
    const id = item.id;

    if(guestOrder[id] == null && type === 'ADD'){
      guestOrder[id] = 0;
    }

    switch (type) {
      case 'ADD':
          if (guestOrder[id] < 20){
            guestOrder[id]++;
          }
        break;
      case 'SUBTRACT':
          if (guestOrder[id] > 0){
            guestOrder[id]--;
          }
        break;
    }

    if (guestOrder[id]=== 0){
      delete guestOrder[id];
    }

    setGuestOrder({...guestOrder});
  }

  const renderFinished = () => {
    return (
      <InfoModal 
        open = {isDone} 
        text = "Your Order has been Submitted"
        subtext = "You may still change it by reloading the this page"
      />
    )
  }

  if (isLoadingOrder || isLoadingMenu) return <p class= 'm-5 text-3xl'>Loading...</p>
  if (!groupOpen) return <p class= 'm-5 text-3xl'>Sorry {orderData.email}, the ordering Window has Closed</p>
  return (
    <>
      <div class = 'flex'>
        
        <div>
          <p class = 'text-3xl m-5'> Group {orderData.name}</p>
          <p class = 'text-2xl m-5' > {orderData.restaurant.name}</p>
          <p class = 'text-xl m-5'> {orderData.email} </p>
          <Order 
            order = {guestOrder} 
            menu = {menuData} 
            taxRate = {taxRate}
            title = 'Your Order'
          />
          <div class = 'm-5'>
            <Button 
              onClick = {handleSumbit} 
              variant = 'outlined'
            >
              Sumbit Order 
            </Button>
          </div>
        </div>

         <div>
          <Menu menuData= {menuData} addItemCallback = {addItemCallback}/>
        </div>

      </div>

      {renderFinished()}

    </>
  );
}