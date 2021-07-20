class Cart {
  constructor(oldCart) {
    this.cart = oldCart || [];
    this.totalAmount = oldCart.totalAmount || 0;
    this.totalQuantity = oldCart.totalQuantity || 0;
  }
  addItemCart(item, qty) {
    if (this.cart.length > 0) {
      const id = item._id;
      const index = this.cart.findIndex((i) => {
        return i.item._id == id;
      });
      if (index == -1) {
        this.addItem(item, qty);
      } else {
        this.updateCartItem(id, "+", qty);
      }
    } else {
      this.addItem(item, qty);
    }
  }

  addItem(item, qty) {
    this.cart = [...this.cart, { item, quantity: qty }];
    this.totalQuantity = total(this.cart).qty;
    this.totalAmount = total(this.cart).ammount;
  }

  updateCartItem(id, operator, qty) {
    const cart = this.cart.map((i) => {
      return i.item._id == id
        ? (i = {
            ...i,
            quantity: operator === "+" ? i.quantity + qty : i.quantity - qty,
          })
        : i;
    });
    this.cart = cart;
    this.totalQuantity = total(this.cart).qty;
    this.totalAmount = total(this.cart).ammount;
  }

  removeItem(id, operator, qty) {
    const item = this.cart.find((i) => i.item._id === id);
    if (!item) return;
    if (item.quantity == qty && operator === "-") {
      this.updateCartItem(id, operator, qty);
      this.removeCartItem(id);
    } else {
      this.updateCartItem(id, operator, qty);
    }
  }

  removeCartItem(id) {
    this.cart = [...this.cart.filter((i) => i.item._id.toString() != id)];
    this.totalAmount = total(this.cart).ammount;
    this.totalQuantity = total(this.cart).qty;
  }

  clearCart() {
    this.cart = [];
    this.totalQuantity = 0;
    this.totalAmount = 0;
  }
}

const total = (cart) => {
  if (!cart.length) return { ammount: 0, qty: 0 };
  const totalAmount = cart
    .map((i) => {
      return i.item.price * i.quantity;
    })
    .reduce((a, b) => {
      return a + b;
    });
  const totalQuantity = cart.map((i) => i.quantity).reduce((a, b) => a + b);

  return { ammount: Number(totalAmount.toFixed(2)), qty: totalQuantity };
};

exports.Cart = Cart;

const cart = new Cart([]);

// cart.addItemCart({ _id: "12234", name: "somethign", price: 200 }, 3);
// cart.addItemCart({ _id: "12235", name: "else", price: 100 }, 3);
// cart.addItemCart({ _id: "12236", name: "anotherone", price: 500 }, 6);

// cart.removeCartItem("12236");

// console.log(cart);

// cart.cart.map((i) => console.log(i));
