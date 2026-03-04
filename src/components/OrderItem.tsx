import { floatToDollars } from '../services';

export default function OrderItem(props) {
  const amount = props.amount;
  const info = props.info;
  const totalPrice = amount*info.price;

  return (
    <div class = 'm-1 flex justify-between'>
      <p class = 'text-lg'>{`${info.name} `} 
        <span class = 'text-sm mr-2'> 
            ({floatToDollars(info.price)} X {amount}) 
        </span>
      </p>
      <p class = 'text-lg'>{floatToDollars(totalPrice)}</p>
    </div>
  );
}