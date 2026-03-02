'use client'
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NextLink from 'next/link'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Menu from '../../components/Menu';

export default function Owner() {
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
  const [groupName, setGroupName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] =useState(null);
  const [guestEmails, setGuestEmails] = useState([]);

  const [restaurantData, setRestaurantData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [groupData, setGroupData] = useState(null)
  const [links, setLinks] = useState(null)

  const [isLoadingRestaurant, setLoadingRestaurant] = useState(true);

  useEffect(() => {
    fetch('https://group-order.jr373.workers.dev/api/restaurants')
      .then((res) => res.json())
      .then((data) => {
        const valuesArray = Object.keys(data).map(key => {
          data[key].id=key;
          return data[key];
        }); 
        setRestaurantData(valuesArray);
        setLoadingRestaurant(false);
      })
  }, [])

  useEffect(() => {
    console.log(selectedRestaurant)
    if (selectedRestaurant) {
      fetch(`https://group-order.jr373.workers.dev/api/menu?value=${selectedRestaurant.menu}`)
        .then((res) => res.json())
        .then((data) => {
          setMenuData(data);
          console.log(data);
  /////////////////////
       // setIsDone(true);
        //completeGroup({"name":"dsdsf","owner":"jr373@hotmail.com","emails":["some@email.com","more@email.com"],"restaurant":{"name":"Sara's Subs","menu":"menu_1","id":"restaurant_1"},"orders":{},"open":true,"id":"dsdsf 1772403156232"})
  //////////////////
      })
    }
  }, [selectedRestaurant])


  const handleDone = () => {
    postGroup();
  }

  const completeGroup = (data: Group) => {
    setLinks(generateLinks(data));
    setGroupData(data);
  }

  const generateLinks = (group: Group) => {
    const host = window.location.host; 
    const guests = [];
    const owner = `http://${host}/owner/group?email=${encodeURI(group.owner)}&group=${encodeURI(group.id)}`
   
    group.emails.forEach((email) => {
        guests.push(`http://${host}/guest?email=${encodeURI(email)}&group=${encodeURI(group.id)}`);
    });

    return {owner, guests};
  }

  const postGroup = async () => {
    //setError(null); 
    const postData = {
      "name": groupName, 
      "owner": ownerEmail,
      "emails": guestEmails, 
      "restaurant": selectedRestaurant
    }; 

    try {
      const response = await fetch('https://group-order.jr373.workers.dev/api/create', {
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
      setIsDone(true);
      completeGroup(data);
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
  };

  const renderDoneButton = () => {
    const readyToSubmit = 
      !!groupName && 
      !!ownerEmail && 
      !!selectedRestaurant &&
      !!guestEmails.length &&
      !isDone;
    
    return (
      <Button 
        onClick = {handleDone} 
        variant = 'outlined'
        disabled = {!readyToSubmit}
      >
        Done 
      </Button>
      )
  }

  const renderGuestEmails = (emails: string[]) => {
    const emailFields = [];
    for (let i = 0; i < 3; i++) {
      if(i <= emails.length){
        emailFields.push(
           <div class = "m-5" key = {i}>
            <TextField
                label="Enter a Guest's Email" 
                sx = {{width: 260}}
                variant = "outlined"
                value = {emails[i]}
                inputProps = {{maxLength : 255}}
                onChange = {(event: React.ChangeEvent<HTMLInputElement>) => {
                  let temp = guestEmails;
                  temp[i] = event.target.value;
                  setGuestEmails([...temp]);
                }
              }
            />
          </div>
        );
      }
    }
    return emailFields;
  };

  const renderFinished = () =>{
    return (
      <Modal
        open={isDone}
      >
        <div class = "flex h-screen w-full justify-center"> 
          <div class = "m-25"> 
            <p>Group {groupData.name} Created</p> 
             <p>Owner Link</p> 
             <p>{links.owner}</p> 
             <p>Guest Links</p>
              {links.guests.map((guest) => (
              <p>{guest}</p>
            ))}
          </div> 
        </div>
      </Modal>
    )
  }


  if (isLoadingRestaurant) return <p class = 'm-5 text-3xl'>Loading...</p>

  return (
    <>
      <p class = 'text-3xl m-5'> Create a group </p>
        <div class ='flex'>
          <div>
            <div class = 'm-5'>
              <TextField
                label="Enter Your Email" 
                sx = {{ width: 300 }}
                variant = "outlined"
                value = {ownerEmail}
                inputProps = {{maxLength : 255}}
                onChange = {(event: React.ChangeEvent<HTMLInputElement>) => {
                  setOwnerEmail(event.target.value);
                }}
              />
            </div>  
            <div class = 'm-5'>
              <TextField
                label="Name Your Group" 
                sx={{ width: 300 }}
                variant="outlined"
                value={groupName}
                inputProps = {{maxLength : 30}}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const cleaned = event.target.value.replace(/[^a-zA-Z0-9\s]$/g, '').trim();
                  setGroupName(cleaned);
                }}
              />
            </div>
            <div class = 'm-5'>
              <FormControl>
                <InputLabel id="restaurant-select-label">Select Restaurant</InputLabel>
                <Select
                  sx={{ width: 300 }}
                  label-id= "restaurant-select-label"
                  label="Select Restaurant"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedRestaurant(event.target.value);
                  }}
                >
                {restaurantData.map((restaurant) => (
                  <MenuItem value={restaurant}>{restaurant.name}</MenuItem>
                ))}
                </Select>
            </FormControl>
          </div>

          <div class = 'border m-5 w-75'>
            {renderGuestEmails(guestEmails)}
          </div>  

          <div class = 'm-5'>
            {renderDoneButton()}
          </div>
        </div>

        {menuData && <Menu menuData= {menuData} />}

      </div>

      {isDone && renderFinished()}

    </>
  );
}