let buildCartItems = (tags, allItems) => {
  let cartItems = [];

  for(let tag of tags){
    let splittedTags = tag.split('-');
    let barcode = splittedTags[0];
    let itemCount = parseFloat(splittedTags[1] || 1);
    let cartItem = cartItems.find((cartItem) => {

      return cartItem.item.barcode == barcode;
    });
    if (cartItem) {
      cartItem.count++;
    }
    else {
      let item = allItems.find((item)=>{

        return item.barcode ==  barcode;
      });
      cartItems.push({item: item, count: itemCount});
    }
  }

  return cartItems;
};
