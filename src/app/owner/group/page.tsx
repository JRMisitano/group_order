'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';

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
  const [groupData, setGroupData] = useState(null)

  const searchParams = useSearchParams();
  const ownerEmail = searchParams.get('email');
  const groupId = searchParams.get('group');

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const postData = {
      "id": groupId, 
      "email": ownerEmail, 
    };

    const fetchGroupData = async () => {
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
        setLoading(false)
        console.log(data)
      } catch (err) {
        //setError(err.message); 
        console.error('There was an error!', err);
      }
    }
    fetchGroupData();

  }, [])

  const handleSumbit = () => {
   
  }

  const handleClose = () => {
   
  }

  const postDone = async () => {

  };

  const renderFinished = () => {

  }

  if (isLoading) return <p>Loading...</p>

  return (
    <>
      <p class = 'text-3xl m-5'> Group {groupData.name}</p>
      <p class = 'text-xl m-5'> Reload to update </p>
      <p class = 'text-2xl m-5' > {groupData.restaurant.name}</p>

      <p class = 'text-2xl m-5'> Members </p>
      <div class = 'm-5'>
        {groupData.emails.map((email) => (
              <p class = 'text-xl, m-2'>{email}</p>
            ))}
      </div>
          
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

      {renderFinished()}

    </>
  );
}