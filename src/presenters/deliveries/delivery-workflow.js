import { courierMatches } from '../../auth/policy/index.js';
import { ROLES } from '../../auth/roles.js';

export function buildDeliveryWorkflow(role, user, delivery) {
  const isClientOwner =
    role === ROLES.CLIENT && user?.customer?.id === delivery.order.customerId;
  const isCourier = role === ROLES.COURIER && user?.courier?.id === delivery.courierId;
  const canAccept =
    role === ROLES.COURIER &&
    delivery.status === 'offered' &&
    !delivery.courierId &&
    courierMatches(user?.courier, delivery);
  const deliveryReview =
    delivery.reviews.find((review) => review.authorId === user?.id) || null;

  return {
    isClientOwner,
    isCourier,
    canAccept,
    canComplete: isCourier && delivery.status !== 'delivered',
    canUpdateStatus: isClientOwner && Boolean(delivery.courierId) && delivery.status !== 'delivered',
    canReview: isClientOwner && delivery.status === 'delivered' && !deliveryReview,
    deliveryReview,
    reviews: delivery.reviews
  };
}
