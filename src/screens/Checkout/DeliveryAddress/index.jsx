import React, { useState } from "react";
import ListItem from "../../../components/ListItem";
import { useDispatch, useGlobal } from "reactn";
import PlacesAutocomplete, {
  geocodeByAddress
} from "react-places-autocomplete";
import Spinner from "../../../components/Spinner";
import Input from "../../../components/Input";
import Search from "../../../assets/icons/search";
import { parseGooglePlace } from "../../../utils/address";
import notify from "../../../utils/toast";
import SectionHeader from "../../../components/SectionHeader";

const CheckoutDeliveryAddress = () => {
  const [order] = useGlobal("order");
  const [selectedAddress, setSelectedAddress] = useState(
    order.delivery_address
  );
  const [address, setAddress] = useState("");

  const updateOrder = useDispatch("updateOrder");

  const handleChange = newAddress => {
    setAddress(newAddress);
  };

  const handleSelect = async address => {
    setAddress("");
    try {
      const addressObj = await geocodeByAddress(address);
      const parsedAddress = parseGooglePlace(addressObj[0]);

      updateOrder({
        ...order,
        delivery_address: parsedAddress
      });
      setSelectedAddress(parsedAddress);
    } catch (err) {
      notify("Failed to get address", {
        type: "error"
      });
      setSelectedAddress(undefined);
    }
  };

  return (
    <>
      <SectionHeader title="Delivery address" />
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        debounce={1000}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
          return (
            <div className="checkout-address-picker-container">
              <div className="checkout-address-search-container">
                <Input
                  leftAdornment={
                    <Search width={22} height={22} color="rgb(141, 141, 141)" />
                  }
                  inputProps={{
                    ...getInputProps(),
                    onChange: (val, ev) => {
                      getInputProps().onChange(ev);
                    }
                  }}
                  placeholder="Search address..."
                  colorScheme={1}
                />
              </div>
              <div
                className={`autocomplete-dropdown-container ${
                  suggestions.length > 0 ? "show-suggestions" : ""
                }`}
              >
                {loading && (
                  <div className="checkout-address-spinner-container">
                    <Spinner />
                  </div>
                )}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? "suggestion-item suggestion-item--active"
                    : "suggestion-item";
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }}
      </PlacesAutocomplete>
      <SectionHeader title="Selected delivery address" type="sub" />
      <div>
        {selectedAddress && (
          <ListItem>
            <div className="checkout-list-item-left">
              <div>{selectedAddress.street_name}</div>
              <div className="checkout-address-city">
                <div>{selectedAddress.zip_code}</div>
                <div>{selectedAddress.city}</div>
              </div>
            </div>
            <div className="checkout-list-item-right">
              <div>{selectedAddress.country}</div>
              <div className="checkout-list-item-checkmark">&#10003;</div>
            </div>
          </ListItem>
        )}
      </div>
    </>
  );
};

export default CheckoutDeliveryAddress;
