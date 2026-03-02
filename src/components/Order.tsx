import OrderItem from './OrderItem';

export default function Order(props) {
  const rawMenu = props.menu.items;
  const order = props.order;
  const tax = props.tax
  const title = props.title;
  const totalCallback = props.totalCallback;
  const userId = props.userId;

  const menu = {}; 

  Object.keys(rawMenu).map(key =>{
  	Object.keys(rawMenu[key]).map(innerKey =>{
  		menu[innerKey] = rawMenu[key][innerKey];
  	});
  }); 

  const renderOrderItems = () => {
      const orderItems=[];
    	Object.keys(order).map(key => {
    		orderItems.push(<OrderItem key = {key} num = {order[key]} info = {menu[key]} />)
      });
    return orderItems;
  }

  const getTotal = (order, menu, taxRate) => {
    const subtotal = getSubtotal(order, menu);
    const tax = getTax(subtotal, taxRate);

    return subtotal+tax;
  }

  const getSubtotal = (order, menu) => {
    let subTotal = 0;

    Object.keys(order).map(key => {
      const number = order[key];
      const price = menu[key].price;
      subTotal += number * price;
    });

    return subTotal;
  }

  const getTax = (total, taxRate) => {
    return total*taxRate;
  }

  const total = getTotal(order, menu, tax);
  const subtotal = getSubtotal(order, menu);
  const taxes = getTax(subtotal, tax);

  if (totalCallback && userId) {
    setTimeout(() => {totalCallback(total, userId)},0);
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const formattedTotal = formatter.format(total);
  const formattedSubtotal = formatter.format(subtotal);
  const formattedTax = formatter.format(taxes);

  if(!Object.keys(order).length){return (<></>) }

  return (
    <div class = 'm-5 border'>
      <p class = 'text-2xl m-2 border-b'>{title}</p>
      <div class = 'border-b'> {renderOrderItems()}</div>
      <div class ='flex justify-between'>
        <p>Subtotal:</p>
        <p>{formattedSubtotal}</p>
      </div>
      <div class ='flex justify-between'>
        <p>Tax:</p>
        <p>{formattedTax}</p>
      </div>
      <div class ='text-2xl flex justify-between'>
        <p>Total:</p>
        <p>{formattedTotal}</p>
      </div>
    </div>
  );
}
