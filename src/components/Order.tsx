import OrderItem from './OrderItem';
import { getAllOrderCalculatons,  floatToDollars, flattenMenu } from '../services';

export default function Order(props) {
  const rawMenu = props.menu.items;
  const order = props.order;
  const taxRate = props.taxRate
  const title = props.title;

  const menu = flattenMenu(rawMenu); 

  const renderOrderItems = () => {
      const orderItems=[];
    	Object.keys(order).map(key => {
    		orderItems.push(
          <OrderItem 
            key = {key} 
            amount = {order[key]} 
            info = {menu[key]} 
          />)
      });
    return orderItems;
  }

  const calculations = getAllOrderCalculatons(order, menu, taxRate);

  if(!Object.keys(order).length){return (<></>) }

  return (
    <div class = 'm-5 border'>
      <p class = 'text-xl m-2 border-b'>{title}</p>
      <div class = 'border-b'> {renderOrderItems()}</div>
      <div class ='flex justify-between'>
        <p>Subtotal:</p>
        <p>{floatToDollars(calculations.subtotal)}</p>
      </div>
      <div class ='flex justify-between'>
        <p>Tax:</p>
        <p>{floatToDollars(calculations.tax)}</p>
      </div>
      <div class ='text-xl flex justify-between'>
        <p>Total:</p>
        <p>{floatToDollars(calculations.total)}</p>
      </div>
    </div>
  );
}
