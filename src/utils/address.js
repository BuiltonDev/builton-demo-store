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
  console.log(place);
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

export { parseGooglePlace }
