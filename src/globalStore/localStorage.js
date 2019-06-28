const clearAllFields = () => {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    if (localStorage.key(i).startsWith('builton-demo-')) {
      localStorage.removeItem(localStorage.key(i));
    }
  }
};

const clearFieldCurry = field => {
  return () => {
    try {
      localStorage.removeItem(`builton-demo-${field}`);
    } catch (error) {
      throw error;
    }
  };
};

const setFieldCurry = field => {
  return value => {
    try {
      localStorage.setItem(`builton-demo-${field}`, JSON.stringify(value));
    } catch (error) {
      throw error;
    }
  };
};

const getFieldCurry = field => {
  return () => {
    let value = null;
    try {
      value = JSON.parse(localStorage.getItem(`builton-demo-${field}`));
    } catch (error) {
      throw error;
    }
    return value;
  };
};

export { clearFieldCurry, setFieldCurry, getFieldCurry, clearAllFields };
