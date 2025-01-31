import Cart from "../Models/cart.model.js";
import Product from "../Models/product.model.js";
import { SuccessResponse } from "../Utils/successResponse.js";
import { ErrorResponse } from "../Utils/errorrResponse.js";

const addToCart = async (req,res)=>{
    try {
        const product_id=req.query.id;
        const user_id=req.user_id;

        //check product stock
        const product_stock = await Product.findOne({
            _id:product_id
        })

        const available_stock=product_stock.stock;

        if(available_stock<1){
            return res.status(500).json(new ErrorResponse(500,'product out of stock'));
        }

        const userCart=await Cart.findOne({
            user_id,
            product_id
        })

        //if user has the product in cart , update quantity , else add into cart
        if(!userCart){
            const data = new Cart({
                product_id:product_id,
                user_id:user_id,
                quantity:1
            })

            await data.save();
        }
        else{
            const data=await Cart.findByIdAndUpdate(userCart._id,{
                $inc:{
                    quantity:1
                }
            })
        }

        return res.status(200).json(new SuccessResponse(200,null,'cart updated succesfully'))
        
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ErrorResponse(500,error?.message));
    }
}

const removeFromCart= async (req,res)=>{
    try {
        const id=req.query.id;
        await Cart.findByIdAndDelete(id);
        return res.status(200).json(new SuccessResponse(200,null,'cart updated succesfully'))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new ErrorResponse(500,error?.message));
    }
}

const updateItemQuantity= async (req,res)=>{
    try {
        const cart_id=req.query.id;
        const user_id=req.user_id;
        const action=req.query.action;

        //find cart
        const cartItem=await Cart.findById(cart_id);

        const product_of_cart_id=cartItem.product_id;
        const quantity_of_product_in_cart = cartItem.quantity;

        const findProduct = await Product.findById(product_of_cart_id)

        const product_stock=findProduct.stock;

        if(action=='increment'){
            if(product_stock>quantity_of_product_in_cart+1){
                await Cart.findByIdAndUpdate(cart_id,{
                    $inc:{
                        quantity:1
                    }
                })
            }
            else{
                return res.status(400).json(new ErrorResponse(400,'product not in stock , Kindly update your cart')); 
            }

        } //for decrement
        else{
            if(product_stock>quantity_of_product_in_cart-1){
                await Cart.findByIdAndUpdate(cart_id,{
                    $inc:{
                        quantity:-1
                    }
                })
            }
            else{
                return res.status(400).json(new ErrorResponse(400,'product not in stock')); 
            }
        }

        return res.status(200).json(new SuccessResponse(200,null,'cart updated succesfully , Kindly update your cart'))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new ErrorResponse(500,error?.message));
    }
}

const clearCart = async (req,res) =>{
    try {
        const user_id=req.user_id;

        await Cart.deleteMany({
            user_id
        })
        return res.status(200).json(new SuccessResponse(200,null,'cart updated succesfully '))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new ErrorResponse(500,error?.message));
    }
}

const fetchCart = async (req,res)=>{
    try {
        const user_id=req.user_id;
        const data= await Cart.find({
            user_id
        }).populate("product_id")

        return res.status(200).json(new SuccessResponse(200,data,'cart fetched succesfully '))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new ErrorResponse(500,error?.message));
    }
}

const bill= async (req,res)=>{
    try {

        const user_id=req.user_id;
        const userCart= await Cart.find({user_id}).populate("product_id");

        let total=0;

        for(let item of userCart){
            let temp=item.product_id.price * item.quantity;
            total+=temp;
        }

        return res.status(200).json(new SuccessResponse(200,total,'bill fetched succesfully '))
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ErrorResponse(500,error?.message));
    }
}



export {
    clearCart,
    updateItemQuantity,
    removeFromCart,
    addToCart,
    fetchCart,
    bill
}