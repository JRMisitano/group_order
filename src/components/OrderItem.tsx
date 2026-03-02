export default function OrderItem(props) {
  const num = props.num;
  const info = props.info;

  const menu = {}; 

  const totalPrice = num*info.price;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const formattedAmount = formatter.format(totalPrice);

  return (
    <div class = 'm-1 flex justify-between'>
      <p class = 'text-lg'>{info.name} 
        <span class = 'text-sm mr-2'> ({info.priceString}) X {num} </span>
      </p>
      <p class = 'text-lg'>{formattedAmount}</p>
    </div>
  );
}