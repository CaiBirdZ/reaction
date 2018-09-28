import React, { Component } from "react";
import PropTypes from "prop-types";
import { Session } from "meteor/session";
import { Components } from "@reactioncommerce/reaction-components";

class NavBarCustomer extends Component {
  static propTypes = {
    brandMedia: PropTypes.object,
    hasProperPermission: PropTypes.bool,
    searchEnabled: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
    shop: PropTypes.object,
    visibility: PropTypes.object.isRequired
  };

  static defaultProps = {
    visibility: {
      hamburger: true,
      brand: true,
      tags: true,
      search: true,
      notifications: true,
      languages: true,
      currency: true,
      mainDropdown: true,
      cartContainer: true
    }
  };

  state = {
    navBarVisible: false,
    searchModalOpen: false
  }

  toggleNavbarVisibility = () => {
    const isVisible = this.state.navBarVisible;
    this.setState({ navBarVisible: !isVisible });
  }

  handleCloseNavbar = () => {
    this.setState({ navBarVisible: false });
  }

  handleOpenSearchModal = () => {
    this.setState({ searchModalOpen: true });
  }

  handleCloseSearchModal = () => {
    this.setState({ searchModalOpen: false });
  }

  renderLanguage() {
    return (
      <div className="languages">
        <Components.LanguageDropdownCustomer />
      </div>
    );
  }

  renderCurrency() {
    return (
      <div className="currencies">
        <Components.CurrencyDropdownCustomer />
      </div>
    );
  }

  renderBrand() {
    const { brandMedia, shop } = this.props;

    const { name } = shop || {};
    const logo = brandMedia && brandMedia.url({ store: "large" });

    return (
      <Components.Brand
        logo={logo}
        title={name || ""}
      />
    );
  }

  renderSearchButton() {
    if (this.props.searchEnabled) {
      return (
        <div className="search">
          <Components.FlatButton
            icon="fa fa-search"
            kind="flat"
            onClick={this.handleOpenSearchModal}
          />
          <Components.SearchSubscription
            open={this.state.searchModalOpen}
            onClose={this.handleCloseSearchModal}
          />
        </div>
      );
    }
  }

  renderNotificationIcon() {
    if (this.props.hasProperPermission) {
      return (
        <div className="navbar-notification">
          <Components.Notification />
        </div>
      );
    }
  }

  renderCartContainerAndPanel() {
    return (
      <div className="cart-container">
        <div className="cart">
          <Components.CartIconCustomer />
        </div>
        <div className="cart-alert">
          <Components.CartPanelCustomer />
        </div>
      </div>
    );
  }

  renderMainDropdown() {
    return (
      <Components.MainDropdownCustomer />
    );
  }

  renderHamburgerButton() {
    return (
      <div className="showmenu"><Components.Button icon="bars" onClick={this.toggleNavbarVisibility} /></div>
    );
  }

  renderTagNav() {
    return (
      <header className="menu" role="banner">
        <Components.TagNavCustomer
          isVisible={this.state.navBarVisible}
          closeNavbar={this.handleCloseNavbar}
          {...this.props}
        />
      </header>
    );
  }

  renderCartDrawer() {
    if (!Session.equals("displayCart", true)) {
      return (
        <div id="cart-drawer-container">
        </div>
      );
    }
    return (
      <div id="cart-drawer-container" className="opened">
        <Components.CartDrawerCustomer className="reaction-cart-drawer" {...this.props}/>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="rui navbar">
          {this.props.visibility.hamburger && this.renderHamburgerButton()}
          {this.props.visibility.brand && this.renderBrand()}
          {this.props.visibility.tags && this.renderTagNav()}
          {this.props.visibility.search && this.renderSearchButton()}
          {this.props.visibility.notifications && this.renderNotificationIcon()}
          {this.props.visibility.languages && this.renderLanguage()}
          {this.props.visibility.currency && this.renderCurrency()}
          {this.props.visibility.mainDropdown && this.renderMainDropdown()}
          {this.props.visibility.cartContainer && this.renderCartContainerAndPanel()}
        </div>
        <div>
          {this.renderCartDrawer()}
        </div>
      </div>
    );
  }
}

export default NavBarCustomer;
