import { Router } from "express";
import { cartModel } from "../../DB/model/cart.model.js";
import cart_refValidator from "./cart_ref.validator.js";

const router = Router();

// Get all carts
router.get("", async (req, res) => {
  try {
    const carts = await cartModel.find({});

    const cartsData = [];

    carts.forEach((cart) => {
      const cartData = {
        _id: cart._id,
        userId: cart.userId,
        products: cart.products,
      };

      cartsData.push(cartData);
    });

    res.status(201).json({ message: "success", data: cartsData });
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
});

// Get a custom cart
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await cartModel.findById(id);

    const cartData = {
      _id: cart._id,
      userId: cart.userId,
      products: cart.products,
    };

    if (cart) {
      res.status(201).json({ message: "success", data: cartData });
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

router.delete(
  "/product/",
  cart_refValidator.validateProduct,
  async (req, res) => {
    const { productId } = req.body;

    const user = req.user;

    try {
      let cart = await cartModel.findOne({
        userId: user._id,
        isActive: true,
      });

      if (cart) {
        //cart exists for user and is active
        let itemIndex = cart.products.findIndex(
          (p) => p.productId == productId,
        );

        if (itemIndex > -1) {
          //product exists in the cart, delete the product
          cart.products.splice(itemIndex, 1);
        } else {
          //product does not exists in cart, return response 404
          return res.status(404).json({
            message: "failed",
            error: "product doesn't exist in cart",
          });
        }
        cart = await cart.save();

        const cartData = {
          _id: cart._id,
          userId: cart.userId,
          products: cart.products,
        };

        return res.status(201).send({ message: "success", data: cartData });
      } else {
        //no cart for user

        return res.status(404).send({
          message: "failed",
          error: "cart doesn't exist for this user",
        });
      }
    } catch (err) {
      res.status(500).send({ message: "something went wrong", error: err });
    }
  },
);

router.delete("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let carts = await cartModel.find({
      isActive: true,
    });

    // console.log("before", carts);

    if (carts.length) {
      //cart exists for user and is active
      carts.forEach(async (cart) => {
        let itemIndex = cart.products.findIndex((p) => p.productId == id);

        if (itemIndex > -1) {
          //product exists in the cart, delete the product
          cart.products.splice(itemIndex, 1);
          cart = await cart.save();
        }
      });
    }

    return res.status(201).send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "something went wrong", error: err });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const user = req.user;

  try {
    let cart = await cartModel.findOne({
      _id: id,
      userId: user._id,
      isActive: true,
    });

    if (cart) {
      await cartModel.findByIdAndUpdate(id, { isActive: false });

      res.status(201).json({ message: "success" });
    } else {
      res.status(404).json({ message: "invalid active cart id" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

export default router;
