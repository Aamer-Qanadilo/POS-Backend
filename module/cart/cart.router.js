import { Router } from "express";
import { cartModel } from "../../DB/model/cart.model.js";
import cart_refValidator from "./cart_ref.validator.js";

const router = Router();

// Get all carts
router.get("", async (req, res) => {
  try {
    const carts = await cartModel.find({});

    res.status(201).json({ message: "success", data: carts });
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
});

// Get a custom cart
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await cartModel.findById(id);

    if (cart) {
      res.status(201).json({ message: "success", data: cart });
    } else {
      res.status(404).json({ message: "invalid cart id" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
});

router.post("", cart_refValidator.validateProduct, async (req, res) => {
  const { productId, quantity } = req.body;

  const user = req.user;

  try {
    let cart = await cartModel.findOne({
      userId: user._id,
      isActive: true,
    });

    if (cart) {
      //cart exists for user and is active
      let itemIndex = cart.products.findIndex((p) => p.productId == productId);

      console.log(itemIndex);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];

        console.log(productItem);
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.products.push({ productId, quantity });
      }
      cart = await cart.save();

      const cartData = {
        _id: cart._id,
        userId: cart.userId,
        products: cart.products,
      };

      return res.status(201).send({ message: "success", data: cartData });
    } else {
      //no cart for user, create new cart
      const newCart = await cartModel.create({
        userId: user._id,
        products: [{ productId, quantity }],
      });

      const cartData = {
        _id: newCart._id,
        userId: newCart.userId,
        products: newCart.products,
      };

      return res.status(201).send({ message: "success", data: cartData });
    }
  } catch (err) {
    res.status(500).send({ message: "something went wrong", error: err });
  }
});

export default router;
