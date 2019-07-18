import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { useGlobal, useDispatch } from 'reactn';

import './index.scss';
import useReactRouter from "use-react-router";
import Header from "../../components/Header";
import Button from "../../components/Button";

const MAX_checkoutSteps = 3;

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [bag] = useGlobal('bag');

  const [checkout] = useGlobal('checkout');
  const updateCheckoutStep = useDispatch('updateCheckoutStep');

  const { match, history } = useReactRouter();

  useEffect(() => {
    if (checkout) {
      const stepsVals = [...Object.values(checkout)];
      if (match.params.step) {
        let length = 0;
        for (let i = 0; i < stepsVals.length; i += 1) {
          if (match.params.step === stepsVals[i].title) {
            setStep(i);
            length = i;
            break;
          }
        }
        const elements = document.getElementsByClassName("checkout-steps-container");
        if (elements && elements[0] && elements[0].children) {
          const childrenElements = elements[0].children;
          let defaultTransitionDelay = 0;
          for (let i = 0; i < childrenElements.length; i += 1) {
            if (i < length + 1) {
              defaultTransitionDelay += 350;
              for (let x = 0; x < childrenElements[i].children.length; x +=1) {
                if (childrenElements[i].children[x].className.includes('checkout-step-progress')) {
                  childrenElements[i].children[x].children[0].style.transitionDelay = `${defaultTransitionDelay}ms`;
                } else if (childrenElements[i].children[x].className.includes('checkout-step-circle')) {
                  childrenElements[i].children[x].children[0].style.animationDelay = `${defaultTransitionDelay + 350}ms`;
                }
              }

            }
          }
        }

      } else {
        for (let i = 0; i < stepsVals.length; i += 1) {
          if (!stepsVals[i].complete) {
            setStep(i - 1);
            break;
          } else if (i === stepsVals.length - 1) {
            setStep(stepsVals.length - 1);
          }
        }
      }
    }
  }, [match.params.step]);

  const renderStep1 = () => {
    if (!bag || !bag.length) return null;
    return (
      <div className="checkout-bag-items-container">
        {bag.map((item, index) => (
          <div className="checkout-bag-item-row" key={`bag-item-${item.product.id}-${index}`}>
            {item.product.name}
          </div>
          ))}
      </div>
    )
  };

  const pushStep = async (stepNumb) => {
    const checkoutStepsCopy = {...checkout};
    checkoutStepsCopy[step].complete = true;
    await updateCheckoutStep(checkoutStepsCopy);

    setStep(typeof stepNumb !== 'undefined' ? stepNumb : step + 1);

    history.push(`/checkout/${checkout[typeof stepNumb !== 'undefined' ? stepNumb : step + 1].title}`);
  };

  return (
    <div className="main-container">
      <Header />
      <div className="wrapper">
        <div className="checkout-container">
          <div className="checkout-inner-container">
            {renderStep1()}
          </div>
          <div className="checkout-nav-container">
            <div className="checkout-steps-container">
              <div className={`checkout-step ${step >= 0 ? 'active-step' : ''}`}>
                <div className="checkout-step-circle" onClick={() => step >= 0 && pushStep(0)}>
                  <div/>
                </div>
                <div className="checkout-step-title">Your bag</div>
              </div>
              <div className={`checkout-step ${step >= 1 ? 'active-step' : ''}`}>
                <div className="checkout-step-progress">
                  <div/>
                </div>
                <div className="checkout-step-circle" onClick={() => step >= 1 && pushStep(1)}>
                  <div/>
                </div>
                <div className="checkout-step-title">Authentication</div>
              </div>
              <div className={`checkout-step ${step >= 2 ? 'active-step' : ''}`}>
                <div className="checkout-step-progress">
                  <div/>
                </div>
                <div className="checkout-step-circle" onClick={() => step >= 2 && pushStep(2)}>
                  <div/>
                </div>
                <div className="checkout-step-title">Payment method</div>
              </div>
              <div className={`checkout-step ${step >= 3 ? 'active-step' : ''}`}>
                <div className="checkout-step-progress">
                  <div/>
                </div>
                <div className="checkout-step-circle" onClick={() => step >= 3 && pushStep(3)}>
                  <div/>
                </div>
                <div className="checkout-step-title">Delivery address</div>
              </div>
              <div className={`checkout-step ${step >= 4 ? 'active-step' : ''}`}>
                <div className="checkout-step-progress">
                  <div/>
                </div>
                <div className="checkout-step-circle" onClick={() => step >= 4 && pushStep(4)}>
                  <div/>
                </div>
                <div className="checkout-step-title">Confirmation</div>
              </div>
            </div>
            <div className="checkout-next-step">
              {step <= MAX_checkoutSteps &&
                <Button type="button" onClick={() => pushStep()} title="Next" />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default withRouter(Checkout);
