export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      cart {
        total
      }
    }
  }
`;

export const APPLY_COUPON_MUTATION = `
  mutation ApplyCoupon($input: ApplyCouponInput!) {
    applyCoupon(input: $input) {
      cart {
        total
        appliedCoupons {
          code
          discountAmount
        }
      }
    }
  }
`;

export const CHECKOUT_MUTATION = `
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        databaseId
        orderKey
        orderNumber
        status
        total
      }
      result
      redirect
    }
  }
`;