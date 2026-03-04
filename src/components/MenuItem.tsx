import Button from '@mui/material/Button';
import { floatToDollars } from '../services';

export default function MenuItem(props) {

  const buttonStyle = { fontSize: '20px', padding: '0px', 'minWidth': '40px', 'minHeight': '20px'}

  return (
      <div class ='flex justify-between'>
        <p class = 'text-lg p-1 ml-3'>
          {props.item.name} - {floatToDollars(props.item.price)}
        </p>
        {props.addItemCallback && (
          <span class = 'ml-5 mr-5 mb-2'> 
            <Button
              style= {buttonStyle}
              variant = "outlined"
              onClick = {() => {props.addItemCallback(props.item, 'ADD')}}
            > + </Button>
            <span class ="ml-2"/> 
            <Button
              style= {buttonStyle}
              variant = "outlined"
              onClick = {() => {props.addItemCallback(props.item, 'SUBTRACT')}}
            > - </Button>
          </span>)
        } 
      </div>
  );
}