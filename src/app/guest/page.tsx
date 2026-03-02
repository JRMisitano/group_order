'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Menu from '../../components/Menu';

export default function Group() {
  interface Order {
    name: string;
    email: string;
    restaurant: string;
    order: array;
    open: boolean;
  }

  const [isDone, setIsDone] = useState(false);
  const [orderData, setOrderData] = useState(null)
  const [menuData, setMenuData] = useState(null);
  const [orderOpen, setOrderOpen] = useState(null);

  const searchParams = useSearchParams();
  const guestEmail = searchParams.get('email');
  const groupId = searchParams.get('group');

  const [isLoadingOrder, setLoadingOrder] = useState(true);
  const [isLoadingMenu, setLoadingMenu] = useState(true);
  
  useEffect(() => {
    if (orderData) {
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
        const data = await response.json();
        setOrderData(data);
        setLoadingOrder(false);
        setOrderOpen(data.open)
        console.log(data);
      } catch (err) {
        //setError(err.message); 
        console.error('There was an error!', err);
      }
    }

    fetchGroupData();

  }, [])

  const handleSumbit = () => {
   
  }

  const postDone = async () => {

  };

  const renderFinished = () => {
    /*return (
      <Modal
        open={isDone}
        onClose={handleModalClose} 
      >
        <div class = "flex h-screen w-full justify-center"> 
          <div class = "m-25"> 
            <div>Group {groupData.name} Created</div> 
           <div>Owner Link</div> 
           <div>{links.owner}</div> 
           <div>Guest Links</div>
            {links.guests.map((guest) => (
              <div>{guest}</div>
            ))}
          </div> 
        </div>
      </Modal>
    )*/
  }

  if (isLoadingOrder || isLoadingMenu) return <p class= ' m-5 text-3xl'>Loading...</p>
  if (!orderOpen) return <p class= 'm-5 text-3xl'>Sorry {orderData.email}, the ordering Window has Closed</p>
  return (
    <>
      <div class = 'flex'>
        
        <div>
          <p class = 'text-3xl m-5'> Group {orderData.name}</p>
          <p class = 'text-2xl m-5' > {orderData.restaurant.name}</p>
          <p class = 'text-xl m-5'> {orderData.email} </p>
          
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
          <Menu menuData= {menuData} />
        </div>

      </div>

      {renderFinished()}

    </>
  );
}