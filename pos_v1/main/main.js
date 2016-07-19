/***buildCartItems****/
let buildCartItems = (tags, allItems) => {
  let cartItems = [];

  for (let tag of tags) {
    let splittedTags = tag.split('-');
    let barcode = splittedTags[0];
    let count = parseFloat(splittedTags[1] || 1);
    let cartItem = cartItems.find(cartItem => cartItem.item.barcode == barcode);

    if (cartItem) {
      cartItem.count++;
    }
    else {
      let item = allItems.find(item => item.barcode == barcode);
      cartItems.push({item, count});
    }
  }

  return cartItems;
};
/***buildSubCartItems****/
let buildSubCartItems = (cartItems, promotions) => {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subtotal, saved} = discount(cartItem, promotionType);

    return {cartItem, subtotal, saved};
  });
};

let getPromotionType = (barcode, promotions) => {
  let promotion = promotions.find(promotion => promotion.barcodes.includes(barcode));
  return promotion ? promotion.type : '';
};

let discount = (cartItem,promotionType) => {
let freeItemCount = 0;
  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeItemCount = parseInt(cartItem.count / 3);
  }
  let saved = freeItemCount * cartItem.item.price;
  let subtotal = cartItem.count * cartItem.item.price -saved;
  return {subtotal,saved};
  };




