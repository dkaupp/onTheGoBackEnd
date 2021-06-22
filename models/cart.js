class Cart {
  constructor(oldCart) {
    this.cart = oldCart || [];
    this.totalAmount = oldCart.totalAmount || 0;
    this.totalQuantity = oldCart.totalQuantity || 0;
  }
  addItemCart(item) {
    if (this.cart.length > 0) {
      const id = item._id;
      const index = this.cart.findIndex((i) => {
        return i.item._id == id;
      });
      if (index == -1) {
        this.addItem(item);
      } else {
        this.updateCartItem(id, "+");
      }
    } else {
      this.addItem(item);
    }
  }

  addItem(item) {
    this.cart = [...this.cart, { item, quantity: 1 }];
    this.totalQuantity = total(this.cart).qty;
    this.totalAmount = total(this.cart).ammount;
  }

  updateCartItem(id, operator) {
    const cart = this.cart.map((i) => {
      return i.item._id == id
        ? (i = {
            ...i,
            quantity: operator === "+" ? i.quantity + 1 : i.quantity - 1,
          })
        : i;
    });
    this.cart = cart;
    this.totalQuantity = total(this.cart).qty;
    this.totalAmount = total(this.cart).ammount;
  }

  removeItem(id, operator) {
    const item = this.cart.find((i) => i.item._id === id);
    if (!item) return;
    if (item.quantity == 1 && operator === "-") {
      this.updateCartItem(id, operator);
      this.removeCartItem(id);
    } else {
      this.updateCartItem(id, operator);
    }
  }

  removeCartItem(id) {
    this.cart = [...this.cart.filter((i) => i.item._id != id)];
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
  const totalAmount = cart
    .map((i) => {
      return i.item.price * i.quantity;
    })
    .reduce((a, b) => a + b);
  const totalQuantity = cart.map((i) => i.quantity).reduce((a, b) => a + b);

  return { ammount: Number(totalAmount.toFixed(2)), qty: totalQuantity };
};

exports.Cart = Cart;
