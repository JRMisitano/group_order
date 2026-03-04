'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Order from '../../../components/Order';
import { 
  getTaxRate,
  getTotalFromOrder, 
  floatToDollars, 
  flattenMenu,
  fetchMenu,
  fetchOrders 
} from '../../../services';

import InfoModal from '../../../components/InfoModal';

export default function Group() {

  interface Group {
    name: string;
    owner: string;
    emails: string[];
    restaurant: string;
    orders: object;
    open: boolean;
    id: string;
  }

  const taxRate = getTaxRate();

  const [isDone, setIsDone] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [groupData, setGroupData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [groupOrders, setGroupOrders] = useState(null);
  const [totalMap, setTotalMap] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  
  const searchParams = useSearchParams();
  const ownerEmail = searchParams.get('email'); //get from group?
  const groupId = searchParams.get('group'); //get from group?

  const [isLoadingGroup, setLoadingGroup] = useState(true);
  const [isLoadingMenu, setLoadingMenu] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrdersPostData = {
      "id": groupId, 
      "email": ownerEmail, 
    };

  useEffect(() => {
    if (menuData && groupData) {
      setTotalPrice(getOrdersTotalPrice());
    }  
  }, [menuData,groupData]);

  useEffect(() => {
    if (groupData) {
      (async () => {
        setMenuData(await fetchMenu(groupData.restaurant.menu));
        setLoadingMenu(false)
      })();
    }
  }, [groupData]);

  useEffect(() => {
    processOrders();
  }, [])

   const processOrders = async() => {
      const data = await fetchOrders(fetchOrdersPostData);
      setGroupData(data);
      setGroupOrders(data.orders);
      setIsClosed(!data.open)
      setLoadingGroup(false);
   }

  const getOrdersTotalPrice = () => {
    let total = 0;
    for (const [key, value] of Object.entries(groupOrders)) {
      total += getTotalFromOrder(value, flattenMenu(menuData), taxRate)
    }
    return total;
  }

  const handleReload = () => {
    processOrders();
  }

  const handleSumbit = async () => {
    setIsSubmitting(true);
    const postData = {
      "id": groupId, 
      "email": ownerEmail, 
    };

    try {
      const response = await fetch('https://group-order.jr373.workers.dev/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      setIsSubmitting(false);
      setIsDone(true);
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
  }

  const handleReady = () => {
    fetchGroupData();
    setReadyToSubmit(true);
  }

  const handleClose = async () => {

    setIsClosing(true);
    const postData = {
      "id": groupId, 
      "email": ownerEmail, 
    };

    try {
      const response = await fetch('https://group-order.jr373.workers.dev/api/close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      setIsClosed(true);
      setIsClosing(false);
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
  }

  const renderOrders = () => {
    const orders =[];

    Object.keys(groupOrders).map(key => {
      orders.push(     
        <Order 
          order = {groupOrders[key]} 
          menu = {menuData} 
          taxRate = {taxRate}
          title = {key}
          key = {key}
        />
      )
    });
    return (orders)
  };

  const renderFinished = () => {
    return (
      <InfoModal 
        open = {isDone} 
        text = "Your Group Order has been Submitted"
      />
    )
  }

  const renderClosed = () => {
    return (
      <InfoModal 
        open = {isClosed} 
        text = "This order is closed"
      />
    )
  };

  if (isLoadingGroup || isLoadingMenu) return <p class = 'text-3xl'>Loading...</p>
  if (isSubmitting) return <p class = 'text-3xl'>Submitting...</p>
  if (isClosing) return <p class = 'text-3xl'>Closing...</p>

  return (
    <>
      <div class = 'flex m-5'>
        <div>
          <p class = 'text-3xl m-5'> Group {groupData.name}</p>
          <p class = 'text-xl m-5'> Reload to update </p>
          <p class = 'text-2xl m-5' > {groupData.restaurant.name}</p>

          <p class = 'text-2xl m-5'> Members </p>
          <div class = 'm-5'>
            {groupData.emails.map((email) => (
              <p class = 'text-xl, m-2' key = {email}> {email}</p>
            ))}
          </div>
            {totalPrice!==0 ? (
              <>
                <div class = 'flex justify-between text-2xl m-5'>
                  <p>Total: </p>
                  <p>{floatToDollars(totalPrice)}</p>
                </div>
                <div class = 'm-5'>  

                <Button 
                  onClick = {handleSumbit} 
                  variant = 'outlined'
                >
                Sumbit Order 
              </Button>
            </div>
          </>) : (<></>)}
          <div class = 'm-5' />
            <Button 
              onClick = {handleClose} 
              variant = 'outlined'
            >
              Close Without Submitting
            </Button>
          </div>
      
        <div>
          <div class = 'flex justify-between m-5 text-2xl' > 
            {totalPrice !==0 ? <p>Orders</p> : <p class = "w-50">No orders yet</p>}

            <Button 
              onClick = {handleReload} 
              variant = 'outlined'
            >
              Reload
            </Button>

          </div>
          <div> {renderOrders()} </div>
        </div>

      </div>

      {renderClosed()}
      {renderFinished()}
    </>
  );
}