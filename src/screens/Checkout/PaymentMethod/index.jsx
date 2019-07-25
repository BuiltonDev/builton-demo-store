import React, {useState, useEffect} from 'react';
import builton from '../../../utils/builton';
import notify from '../../../utils/toast';
import { useGlobal, useDispatch } from 'reactn';
import Spinner from "../../../components/Spinner";
import ListItem from "../../../components/ListItem";

// We create test payment method on Builton API
// And we attach the payment method to our order

const StepThree = () => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useGlobal('user');
  const [order] = useGlobal('order');
  const updateOrder = useDispatch('updateOrder');
  const updatePaymentMethod = useDispatch('updatePaymentMethod');

  const getPaymentMethod = async () => {
    if (!user) return;
    try {
      const paymentMethods = await builton.paymentMethods.get();
      if (!paymentMethods.length) {
         const paymentMethod = await builton.paymentMethods.create({
           body: {
             payment_method: 'stripe',
             token: 'tok_visa'
           }
         });
         setPaymentMethod(paymentMethod);
        updateOrderState(paymentMethod);
      } else {
        setPaymentMethod(paymentMethods[0]);
        updateOrderState(paymentMethods[0]);
      }
      setLoading(false);
    } catch(err) {
      notify('Failed to get payment method', {
        type: 'error',
      });
      setLoading(false);
    }
  };

  const updateOrderState = (paymentMethod) => {
    updatePaymentMethod(paymentMethod);
    updateOrder({
      ...order,
      payment_method: paymentMethod._id.$oid,
    })
  };

  useEffect(() => {
    getPaymentMethod();
  }, []);

  return (
    <>
      <div className="checkout-items-container-title">Payment method</div>
      {loading &&
        <div className="checkout-spinner-container">
          <Spinner height={32} width={32} />
        </div>
      }
      <div className="checkout-sub-header-title">
        Selected payment method
      </div>
      {!loading && paymentMethod &&
        <ListItem>
          <div className="checkout-list-item-left">
            <div className="checkout-payment-card-number">
              **** **** **** {paymentMethod.card.last4}
            </div>
            <div className="checkout-payment-method-card-name">
              John Doe
            </div>
          </div>
          <div className="checkout-list-item-right">
            <div className="checkout-payment-card-exp-date">
              {paymentMethod.card.exp_month} / {paymentMethod.card.exp_year}
            </div>
            <div className="checkout-list-item-checkmark">
              &#10003;
            </div>
          </div>
        </ListItem>
      }
    </>
  )
};

export default StepThree;
