const getMediaItems = items => {
  return items.map(item => ({
    id: item.human_id,
    image_url: item.url
  }));
};

const exportMLItems = items => {
  return items.map(item => item.output)
};

export {
  exportMLItems,
  getMediaItems
};
