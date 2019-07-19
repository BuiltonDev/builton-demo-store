import React, {useEffect, useState} from 'react';
import './index.scss';
import useReactRouter from "use-react-router";
import {useDispatch, useGlobal} from "reactn";
import Button from "../Button";

const MAX_checkoutSteps = 3;

const CheckoutNavigation = (
  {
    onStep
  }
) => {
  const { match, history } = useReactRouter();
  const [step, setStep] = useState(0);
  const [isNextStep, setIsNextStep] = useState(false);
  const updateCheckoutStep = useDispatch('updateCheckoutStep');
  const [checkout] = useGlobal('checkout');

  useEffect(() => {
    if (checkout) {
      const stepsVals = [...Object.values(checkout)];
      if (match.params.step) {
        let length = 0;
        for (let i = 0; i < stepsVals.length; i += 1) {
          if (match.params.step === stepsVals[i].title) {
            if (isNextStep) {
              length = 1;
            } else {
              length = i;
            }
            onStep(i);
            setStep(i);
            break;
          }
        }

        animateSteps(length);

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

  const pushStep = async (stepNumb) => {
    const checkoutStepsCopy = {...checkout};
    checkoutStepsCopy[step].complete = true;
    await updateCheckoutStep(checkoutStepsCopy);

    setIsNextStep(true);
    setTimeout(() => history.push(`/checkout/${checkout[typeof stepNumb !== 'undefined' ? stepNumb : step + 1].title}`));
  };


  const animateSteps = (length) => {
    const elements = document.getElementsByClassName("checkout-steps-container");
    if (elements && elements[0] && elements[0].children) {
      const childrenElements = elements[0].children;
      let defaultTransitionDelay = 0;
      for (let i = 0; i < childrenElements.length; i += 1) {
        if (i < length + 1) {
          if (length === 1) {
            defaultTransitionDelay = 350;
          } else {
            defaultTransitionDelay += 350;
          }
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
  };

  return (
    <>
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
      {step <= MAX_checkoutSteps &&
        <div className="checkout-next-step">
          <Button type="button" onClick={() => pushStep()} title="Next" />
        </div>
      }
    </>

  )
}

export default CheckoutNavigation;
