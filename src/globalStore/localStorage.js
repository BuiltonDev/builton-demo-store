const clearAllFields = () => {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    if (localStorage.key(i).startsWith('builton-')) {
      localStorage.removeItem(localStorage.key(i));
    }
  }
};

const clearFieldCurry = field => {
  return () => {
    try {
      localStorage.removeItem(`builton-${field}`);
    } catch (error) {
      throw error;
    }
  };
};

const setFieldCurry = field => {
  return value => {
    try {
      localStorage.setItem(`builton-${field}`, JSON.stringify(value));
    } catch (error) {
      throw error;
    }
  };
};

const getFieldCurry = field => {
  return () => {
    let value = null;
    try {
      value = JSON.parse(localStorage.getItem(`builton-${field}`));
    } catch (error) {
      throw error;
    }
    return value;
  };
};

export { clearFieldCurry, setFieldCurry, getFieldCurry, clearAllFields };
