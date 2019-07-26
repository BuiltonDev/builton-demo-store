const parseGooglePlace = place => {
  let componentForm = {
    street_number: { type: 'short_name', apiName: 'street_name' },
    route: { type: 'long_name', apiName: 'street_name' },
    locality: { type: 'long_name', apiName: 'state' },
    country: { type: 'long_name', apiName: 'country' },
    postal_code: { type: 'short_name', apiName: 'zip_code' },
    administrative_area_level_1: { type: 'short_name', apiName: 'city' }
  };

  let address = {};
  place.address_components.map(component => {
    let addressType = component.types[0];
    if (componentForm[addressType]) {
      let myComponentForm = componentForm[addressType];
      let val = component[componentForm[addressType].type];
      if (
        address[myComponentForm.apiName] &&
        address[myComponentForm.apiName].length > 0
      ) {
        val = address[myComponentForm.apiName] + ' ' + val;
      }
      address[myComponentForm.apiName] = val;
    }
  });

  address['geo'] = [
    place.geometry.location.lat(),
    place.geometry.location.lng()
  ];

  return address;
};


// Used to parse google place address object into a string representation
const parseAddress = address => {
  if (!address) return;
  var stringAddress = '';
  if (address.street_name)
    stringAddress += address.street_name + (address.building ? ' ' : ', ');
  if (address.street_name && address.building)
    stringAddress += address.building + ', ';
  if (address.zipcode) stringAddress += address.zipcode + ' ';
  if (address.city) stringAddress += address.city + ', ';
  if (address.state && address.state !== address.city)
    stringAddress += address.state + ', ';
  if (address.country) stringAddress += address.country;
  return stringAddress;
};

export { parseGooglePlace, parseAddress }
