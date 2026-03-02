'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Order from '../../../components/Order';

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
  const [groupData, setGroupData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [groupOrders, setGroupOrders] = useState(null);
  const [totalMap, setTotalMap] = useState({});
  const searchParams = useSearchParams();
  const ownerEmail = searchParams.get('email');
  const groupId = searchParams.get('group');


  const [isLoadingGroup, setLoadingGroup] = useState(true);
  const [isLoadingMenu, setLoadingMenu] = useState(true);

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
        setLoadingGroup(false)
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
    console.log(total, userId);
    //const temp = totalPrice + total;
    totalMap[userId] = total;

    setTotalMap(totalMap);
    console.log(totalMap)



    //setTotalPrice(temp);

    /*  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const formattedTotal = formatter.format(total);*/

  }

  const getTotalPrice = (type) => {
    let totalPrice = 0;

    Object.keys(totalMap).map(key => {
      totalPrice += totalMap[key];
    });

    console.log(totalPrice);
    if (type === 'NUMBER'){
      return totalPrice;
    }else if(type= 'STRING'){
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      return formatter.format(totalPrice)
    }
  }

  const handleReload = () => {
    fetchGroupData();
  }

  const handleSumbit = () => {
   
  }

  const handleClose = () => {
   
  }

  const postDone = async () => {

  };

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

  };

  if (isLoadingGroup || isLoadingMenu) return <p class = 'text-3xl'>Loading...</p>

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
            {getTotalPrice('NUMBER') > 0 ? (<div class = 'flex justify-between text-2xl m-5'>
            <p>Total: </p>
            <p>{getTotalPrice('STRING')}</p>
          </div>) : (<></>)}
          <div class = 'm-5'>
            <Button 
              onClick = {handleSumbit} 
              variant = 'outlined'
            >
              Sumbit Order 
            </Button>
            <div class = 'm-5' />
            <Button 
              onClick = {handleClose} 
              variant = 'outlined'
            >
              Close Without Submitting
            </Button>
          </div>
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
      {renderFinished()}

    </>
  );
}