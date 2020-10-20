import { CART_ITEM_ADD, CART_ITEM_REMOVE } from '../constants/cartConstants'

export const cartReducer = (state = { cartItems: [] }, action){
    switch(action.type){
        case CART_ITEM_ADD:
            const item = action.payload

            const existItem = state.cartItems.find(x => x.product === item.product)

            if(existItem){

            }else{
                return{
                    ...state,
                    cartItems: {...state.cartItems, item}
                }
            }
            return
        case CART_ITEM_REMOVE:
            return
        default: 
            return state
    }
}
