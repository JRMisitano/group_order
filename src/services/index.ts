/// Money Functions

export const getTaxRate = () => {
	return .07
}

export const getTotalFromOrder = (order, menu, taxRate) => {
    const subtotal = getSubtotalFromOrder(order, menu);
    const tax = getTax(subtotal, taxRate);
    return subtotal+tax;
}

export const getSubtotalFromOrder = (order, menu) => {
	let subtotal = 0;
    Object.keys(order).map(key => {
      const number = order[key];
      const price = menu[key].price;
      subtotal += number * price;
    });
    return subtotal;
}

const getTax = (total, taxRate) => {
	return total*taxRate;
}

export const getAllOrderCalculatons = (order, menu, taxRate) => {
	const total = getTotalFromOrder(order, menu, taxRate); 
	return {
		total: total, 
		subtotal: getSubtotalFromOrder(order,menu), 
		tax: getTax(total, taxRate)
	}
}

export const floatToDollars = (float) => {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});
	return formatter.format(float);
}

///Utility funcitons

export const flattenMenu = (rawMenu) => {
	const flatMenu = {}
	if (rawMenu.items){
		rawMenu = rawMenu.items;
	}
	for (const [keyi, valuei] of Object.entries(rawMenu)) {
		for (const [keyj, valuej] of Object.entries(rawMenu[keyi])) {
			flatMenu[keyj] = rawMenu[keyi][keyj];
			flatMenu[keyj].id = keyj;
		}
    }
    return flatMenu;
}

///fetch functions

const baseUrl = 'https://group-order.jr373.workers.dev/api/';

export const fetchMenu = async (menuId) => {
    try {
      const response = await fetch(`${baseUrl}menu?value=${menuId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      const data = await response.json();
      return data;
	} catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
}

export const fetchOrders = async (postData) => {
    try {
      const response = await fetch(`${baseUrl}retrieve_orders`, {
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
  	  return data;
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
}

export const fetchOrder = async (postData) => {
    try {
      const response = await fetch(`${baseUrl}get_order`, {
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
  	  return data;
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
}

 export const fetchAddOrder = async (postData) => {
    try {
      const response = await fetch('https://group-order.jr373.workers.dev/api/add_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      return true;

    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
  };

  export const fetchCreateGroup = async (postData) => {
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
        return data;
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
  }

  export const fetchSubmitOrder = async (postData) => {
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
     return true;
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
  }

  export const fetchCloseGroup = async (postData) => {
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
     return true;
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
  }