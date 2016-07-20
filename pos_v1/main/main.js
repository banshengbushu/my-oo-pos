'use strict'

function printReceipt(tags) {
  const allItems = loadAllItems();
  const  cartItems = buildCartItems(tags,allItems);
  const allPromotions = loadPromotions();
  const receiptItems = buildReceiptItems(cartItems,allPromotions);
  const receipt = buildReceipt(receiptItems);
  const receiptText = buildReceiptText(receipt);
  console.log(receiptText);
}
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
/***buildReceiptItems****/
let buildReceiptItems =(cartItems,promotions)=>{
  return cartItems.map(cartItem=>{
    let promotionType = getPromotionType(cartItem.item.barcode,promotions);
    let {subtotal,saved} = discount(cartItem,promotionType);

    return {cartItem,subtotal,saved};
  });
};
let getPromotionType=(barcode,promotions)=>{
  let promotion = promotions.find(promotion => promotion.barcodes.includes(barcode));
  return promotion ? promotion.type:'';
};

let discount=(cartItem,promotionType)=>{
  let freeItemCount = 0;
  if(promotionType === 'BUY_TWO_GET_ONE_FREE'){
    freeItemCount = parseInt(cartItem.count/3);

  }
  let saved = cartItem.item.price * freeItemCount;
  let subtotal =  cartItem.item.price * cartItem.count-saved;

  return {subtotal,saved};
};
/***buildReceipt****/
let buildReceipt = (subCartItems)=>{
  let total = 0;
  let savedTotal = 0;
  for(let receiptCartItem of subCartItems){
       total += receiptCartItem.subtotal;
       savedTotal += receiptCartItem.saved;
  }
  return {receiptItems:subCartItems,total,savedTotal}
};
/***buildReceiptText****/
let buildReceiptText = (receipt)=>{
  let receiptItemText = receipt.receiptItems.map(receiptItem=>{
    let name =receiptItem.cartItem.item.name;
    let subtotal = formatMoney(receiptItem.subtotal);
    let price =formatMoney(receiptItem.cartItem.item.price);
    let count =receiptItem.cartItem.count;
    let unit =receiptItem.cartItem.item.unit;
    return `名称：${name}，数量：${count}${unit}，单价：${price}(元)，小计：${subtotal}(元)`;

  }).join('\n   ');
    return  `***<没钱赚商店>收据***
   ${receiptItemText}
   ----------------------
   总计：${formatMoney(receipt.total)}(元)
   节省：${formatMoney(receipt.savedTotal)}(元)
   **********************`;
};
 function formatMoney(money) {
   return money.toFixed(2);
 }
