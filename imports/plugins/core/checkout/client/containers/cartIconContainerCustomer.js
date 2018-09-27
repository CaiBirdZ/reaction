import Velocity from "velocity-animate";
import { compose, withProps } from "recompose";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Reaction } from "/client/api";
import withAccountCart from "/imports/plugins/core/graphql/lib/hocs/withAccountCart";
import withShopId from "/imports/plugins/core/graphql/lib/hocs/withShopId";
import withViewer from "/imports/plugins/core/graphql/lib/hocs/withViewer";
import CartIconCustomer from "../components/cartIconCustomer";

const handlers = {
  handleClick(event) {
    event.preventDefault();
    document.querySelector("#cart-drawer-container").classList.toggle("opened");
    Reaction.toggleSession("displayCart");
  }
};

const composer = (props, onData) => {
  onData(null, { shopSlug: Reaction.getSlug(Reaction.getShopName().toLowerCase()) });
};

registerComponent("CartIconCustomer", CartIconCustomer, [
  withProps(handlers),
  composeWithTracker(composer),
  withShopId,
  withViewer,
  withAccountCart
]);

export default compose(
  withProps(handlers),
  composeWithTracker(composer),
  withShopId,
  withViewer,
  withAccountCart
)(CartIconCustomer);
