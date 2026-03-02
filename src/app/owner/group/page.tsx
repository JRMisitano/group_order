'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Order from '../../../components/Order';
import Modal from '@mui/material/Modal';

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

  const [isDone, setIsDone] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [groupData, setGroupData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [groupOrders, setGroupOrders] = useState(null);
  const [totalMap, setTotalMap] = useState({});
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const searchParams = useSearchParams();
  const ownerEmail = searchParams.get('email');
  const groupId = searchParams.get('group');

  const [isLoadingGroup, setLoadingGroup] = useState(true);
  const [isLoadingMenu, setLoadingMenu] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (groupData) {
      fetch(`https://group-order.jr373.workers.dev/api/menu?value=${groupData.restaurant.menu}`)
        .then((res) => res.json())
        .then((data) => {
          setMenuData(data);
          setLoadingMenu(false);
        })
    }
  }, [groupData])

  const fetchGroupData = async () => {
    const postData = {
      "id": groupId, 
      "email": ownerEmail, 
    };

    try {
      const response = await fetch('https://group-order.jr373.workers.dev/api/retrieve_orders', {
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
      setGroupData(data);
      setGroupOrders(data.orders);
      setIsClosed(!data.open)
      setLoadingGroup(false);

      console.log(data)
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
  }

  useEffect(() => {
    fetchGroupData();

  }, [])

  const totalCallback = (total, userId) => {
    totalMap[userId] = total;
    setTotalMap(totalMap);
  }

  const getTotalPrice = (type) => {
    let total = 0;

    Object.keys(totalMap).map(key => {
      total += totalMap[key];
    });

    if (type === 'NUMBER'){
      return total;
    }else if(type= 'STRING'){
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      return formatter.format(total)
    }
  }

  const handleReload = () => {
    fetchGroupData();
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
          tax = {.07}
          title = {key}
          key = {key}
          totalCallback = {totalCallback}
          userId = {key}
        />
      )
    });
    return (orders)
  };

    const renderFinished = () => {
    return (
      <Modal
        open={isDone}
      >
        <div class = "flex h-screen w-full justify-center"> 
          <div class = "m-25">
            <p class = "text-3xl"> Your Group Order has been Submitted</p> 
          </div>
        </div>
      </Modal>
    )
  }

  const renderClosed = () => {
    return (
      <Modal
        open={isClosed}
      >
        <div class = "flex h-screen w-full justify-center"> 
          <div class = "m-25">
            <p class = "text-3xl"> This order is closed</p> 
          </div>
        </div>
      </Modal>
    )
  };

  if (isLoadingGroup || isLoadingMenu) return <p class = 'text-3xl'>Loading...</p>
  if (isSubmitting) return <p class = 'text-3xl'>Submitting...</p>
  if (isClosing) return <p class = 'text-3xl'>Closing...</p>

  return (
    <>
      <div class = 'flex'>
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
           
            {readyToSubmit ? (
              <>
                <div class = 'flex justify-between text-2xl m-5'>
                  <p>Total: </p>
                  <p>{getTotalPrice('STRING')}</p>
                </div>
                <div class = 'm-5'>  

                <Button 
                  onClick = {handleSumbit} 
                  variant = 'outlined'
                >
                Sumbit Order 
              </Button>
            </div>
          </>
          ) : (
            <>   
              <div class = 'm-5'>  
                <Button 
                  onClick = {handleReady} 
                  variant = 'outlined'
                >
                Ready to Submit 
              </Button>
            </div>
          </>)}

          <div class = 'm-5' />
            <Button 
              onClick = {handleClose} 
              variant = 'outlined'
            >
              Close Without Submitting
            </Button>
          </div>
      

        <div> 
          <div class = 'flex justify-between m-5 text-2xl'> 
            <p>Orders</p>
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