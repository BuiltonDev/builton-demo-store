const getMediaItems = items => {
  return items.map(item => ({
    id: item.human_id,
    image_url: item.url
  }));
};

const exportMLItems = items => {
  return items.map(item => item.output)
};

const getComplementaryItems = results => {
  const complementaryItems = [];
  for (let i = 0; i < results.length; i += 1) {
    const output = results[i].predictions.output;
    for (let k = 0; k < output.length; k += 1) {
      complementaryItems.push(output[k])
    }
  }

  return complementaryItems;
};

export {
  exportMLItems,
  getMediaItems,
  getComplementaryItems
};
