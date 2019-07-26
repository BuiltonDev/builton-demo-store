const getStatusColor = status => {
  if (status === "PENDING") {
    return "undetermined";
  } else if (status === "CANCELLED") {
    return "negative";
  } else {
    return "positive";
  }
};

export { getStatusColor };
