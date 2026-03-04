'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Menu from '../../components/Menu';
import Order from '../../components/Order';
import Modal from '@mui/material/Modal';

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

  const taxRate =.07;

  useEffect(() => {
    if (orderData && orderData.restaurant) {
      fetch(`https://group-order.jr373.workers.dev/api/menu?value=${orderData.restaurant.menu}`)
        .then((res) => res.json())
        .then((data) => {
          setMenuData(data);
          setLoadingMenu(false);
        })
    }
  }, [orderData])

  

  useEffect(() => {
    const postData = {
      "id": groupId, 
      "email": guestEmail, 
    };

    const fetchGroupData = async () => {
      try {
        const response = await fetch('https://group-order.jr373.workers.dev/api/get_order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const data: Order = await response.json();
        setOrderData(data);
        setLoadingOrder(false);
        setGroupOpen(data.open);
        setGuestOrder(data.order);
      } catch (err) {
        //setError(err.message); 
        console.error('There was an error!', err);
      }
    }

    fetchGroupData();

  }, [])

  const handleSumbit = () => {
    setLoadingOrder(true);
    postOrder();
  }

  const postOrder = async () => {
    //setError(null); 

    const postData = {
      "email": guestEmail, 
      "id": groupId,
      "order": guestOrder
    }; 

    try {
      const response = await fetch('https://group-order.jr373.workers.dev/api/add_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      setLoadingOrder(false);
      setIsDone(true);

    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
  };

  const postDone = async () => {

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
          if (guestOrder[id] >0){
            guestOrder[id]--;
          }
        break;
    }

    if (guestOrder[id]===0){
      delete guestOrder[id];
    }

    setGuestOrder({...guestOrder});
  }

  const renderFinished = () => {
    return (
      <Modal
        open={isDone}
      >
        <div class = "flex h-screen w-full justify-center"> 
          <div class = "m-25">
            <p class = "text-3xl"> Your Order has been Submitted</p> 
            <p class = "text-xl"> Your may still change it by reloading the this page</p> 
          </div>
        </div>
      </Modal>
    )
  }

  if (isDone) return (renderFinished());
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