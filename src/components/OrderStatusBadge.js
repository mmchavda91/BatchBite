import React from 'react';
import { getStatusLabel, getStatusClass } from '../utils/helpers';

const OrderStatusBadge = ({ status }) => {
  return (
    <span className={getStatusClass(status)}>
      {getStatusLabel(status)}
    </span>
  );
};

export default OrderStatusBadge;
