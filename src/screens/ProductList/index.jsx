import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import useReactRouter from 'use-react-router';
import builton from "../../utils/builton";
import notify from '../../utils/toast';
import Header from "../../components/Header";

const ProductList = () => {
  const { history, match } = useReactRouter();

  useEffect(() => {
    if (match.params.category) {
      fetchProducts();
    }
  }, [match]);

  const fetchProducts = async () => {
    try {
      const products = await builton.products.get({
        urlParams: {
          tags: match.params.category
        }
      });
    } catch(err) {
      notify('Failed to fetch products', {
        type: 'error'
      })
    }
  };

  return(
    <div className="main-container">
      <Header />
      <div className="wrapper">
      </div>
    </div>
  )
};

export default withRouter(ProductList);
