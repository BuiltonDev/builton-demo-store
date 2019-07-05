import { toast } from 'react-toastify';

const notify = (message, options) => {
  toast(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  })
};

export default notify;
