export default {
  async fetch(request, env) {
   
    const corsHeaders = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS', 
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Headers': 'Content-Type' 
    };

    const url = new URL(request.url)

    switch (request.method) {
      case 'OPTIONS':
        return new Response(null, {
          headers: {
            ...corsHeaders,
          }
        });

      case 'POST':
        if (url.pathname.startsWith('/api/create')) {
          let requestObj = await request.clone().json();

          console.log('--c1--',requestObj)
          let theTime = new Date().getTime();
          let id = requestObj.name+' '+ theTime
          requestObj.orders = {};
          requestObj.open = true;
          requestObj.id = id;

          console.log('--c2--',requestObj)
          await env.GROUP_ORDERS_KV.put(id, JSON.stringify(requestObj));
          const jsonBody = JSON.stringify(requestObj);
          return new Response(jsonBody, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
        }

        if (url.pathname.startsWith('/api/add_order')) {
          let requestObj = await request.clone().json(); 

          console.log('--a1--',requestObj)

          let kvStr= await env.GROUP_ORDERS_KV.get(requestObj.id);
          let kvJson = await JSON.parse(kvStr);
          console.log('--a2--',kvJson)
          if(kvJson.open){
            if (kvJson.emails.indexOf(requestObj.email)!== -1){
              kvJson.orders[requestObj.email] = requestObj.order;
              await env.GROUP_ORDERS_KV.put(requestObj.id, JSON.stringify(kvJson));  
              return new Response("200, success", { status: 200, headers: {...corsHeaders} });
            }else{
              return new Response("403, forbidden", { status: 403 });
            }
          }else{
            return new Response("423, locked", { status: 423 });
          }
        }

        if (url.pathname.startsWith('/api/get_order')) {
          let requestObj = await request.clone().json(); 

          console.log('--g1--',requestObj)

          let kvStr= await env.GROUP_ORDERS_KV.get(requestObj.id);
          let kvJson = await JSON.parse(kvStr);
          console.log('--g2--',kvJson)
            if (kvJson.emails.indexOf(requestObj.email)!== -1){
                await env.GROUP_ORDERS_KV.put(requestObj.id, JSON.stringify(kvJson));

                let tempJson = {
                  name: kvJson.name, 
                  email: requestObj.email, 
                  order: kvJson.orders[requestObj.email] || {}, 
                  restaurant: kvJson.restaurant,
                  open: kvJson.open
                }
                const jsonBody = JSON.stringify(tempJson);
                //const jsonBody = JSON.stringify(kvJson.orders[requestObj.email]);
                return new Response(jsonBody, {
                  headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                  },
                }); 
            }else{
              return new Response("403, forbidden", { status: 403 });
            }
        }

        if (url.pathname.startsWith('/api/retrieve_orders')) {
          let requestObj = await request.clone().json(); 

          console.log('--r1--',requestObj)

          let kvStr= await env.GROUP_ORDERS_KV.get(requestObj.id);
          let kvJson = await JSON.parse(kvStr);
          console.log('--r2--',kvJson)
            if (kvJson.owner === requestObj.email){ 
                await env.GROUP_ORDERS_KV.put(requestObj.id, JSON.stringify(kvJson));  
                const jsonBody = JSON.stringify(kvJson);
                return new Response(jsonBody, {
                  headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                  },
                });
            }else{
              return new Response("403, forbidden", { status: 403 });
            }
        }

        if (url.pathname.startsWith('/api/close')) {
          let requestObj = await request.clone().json();

          console.log('--x1--',requestObj)

          let kvStr= await env.GROUP_ORDERS_KV.get(requestObj.id);
          let kvJson = await JSON.parse(kvStr);
          console.log('--x2--',kvJson);
          if (kvJson.owner === requestObj.email){
            kvJson.open = false;
            await env.GROUP_ORDERS_KV.put(requestObj.id, JSON.stringify(kvJson));  
            return new Response("200, success", { status: 200, headers: {...corsHeaders} });
          }else{
             return new Response("403, forbidden", { status: 403 });
          }
        }

        if (url.pathname.startsWith('/api/send')) {
          let requestObj = await request.clone().json();

          console.log('--s1--',requestObj)

          let kvStr= await env.GROUP_ORDERS_KV.get(requestObj.id);
          let kvJson = await JSON.parse(kvStr);
          console.log('--s2--',kvJson);
          if (kvJson && kvJson.open === true && kvJson.owner === requestObj.email){
            kvJson.open = false;
            await env.GROUP_ORDERS_KV.put(requestObj.id, JSON.stringify(kvJson));  
            return new Response("200, success", { status: 200, headers: {...corsHeaders} });
          }else{
             return new Response("403, forbidden", { status: 403 });
          }
        }

        return new Response("404, not found", { status: 404 });

      case 'GET':
        if (url.pathname.startsWith('/api/restaurants')) {

        let restaurants = {
          restaurant_1: {name: 'Sara\'s Subs', menu: 'menu_1'},
          restaurant_2: {name: 'Gregs\'s Grinders', menu: 'menu_2'},
          restaurant_3: {name: 'Hanks\'s Hogies', menu: 'menu_3'}
        };
        // Convert the object to a JSON string
        const jsonBody = JSON.stringify(restaurants);
        // Create the response with the correct headers
        return new Response(jsonBody, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }

    if (url.pathname.startsWith('/api/menu')) {
      if (url.searchParams.get('value')) {
        let menuParam = url.searchParams.get('value');
        //TODO: getMenu Function
        //TODO: Menus in R2
        let menu = {items:{mains:{},sides:{},drinks:{}}};
        let sides = {side_1: {name: 'Chips', price: 1.99, priceString: "$1.99"}}
        let drinks = {drink_1:{name: 'Soda', price: 1.99, priceString: "$1.99"}}
        switch (menuParam) {
          case "menu_1":
            menu.items.mains ={main_1: {name: 'Salami Sammich', price: 6.99, priceString: "$6.99"}, main_2:{name:'Big \'ol Veggie', price: 5.99, priceString: '$5.99' }};
            menu.items.sides = sides;
            menu.items.sides['side_2']={name: 'Cookie', price: 2, priceString: "$2.00"}
            menu.items.drinks = drinks;
            menu.items.drinks['drink_2']={name: 'Ginger Ale', price: 1.99, priceString: "$1.99"}
            break;
          case "menu_2":
            menu.items.mains ={main_1: {name: 'Giant Chicken Salad', price: 6.99, priceString: "$6.99"}, main_2:{name:'Mega Meatball', price: 7.99, priceString: '$7.99' }};
            menu.items.sides = sides;
            menu.items.sides['side_2']={name: 'Onion Rings', price: 4.5, priceString: "$4.50"}
            menu.items.drinks = drinks;
            menu.items.drinks['drink_2']={name: 'Fancy Root Beer', price: 1.99, priceString: "$3.00"}
            break;
          case "menu_3":
            menu.items.mains ={main_1: {name: 'Hearty Cheesesteak ', price: 7.5, priceString: "$7.50"}, main_2:{name:'Ham and Swiss', price: 4.99, priceString: '$4.99' }};
            menu.items.sides = sides;
            menu.items.sides['side_2']={name: 'Salad', price: 3.99, priceString: "$3.99"}
            menu.items.drinks = drinks;
            menu.items.drinks['drink_2']={name: 'Orange Soda', price: 1.99, priceString: "$1.99"}
            break;
          default: 
            return new Response("400, bad request", { status: 400 });
        }
        // Convert the object to a JSON string
        const jsonBody = JSON.stringify(menu);
        // Create the response with the correct headers
        return new Response(jsonBody, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
        }else{
          return new Response("400, bad request", { status: 400 });
        }
      }
        return new Response("404, not found", { status: 404 });
      default:
      return new Response(`${request.method} is not allowed.`, {status: 405,})
    }
  }
}