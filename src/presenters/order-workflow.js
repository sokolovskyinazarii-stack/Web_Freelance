import { ROLES } from '../auth/roles.js';

const labels = {
  pending: 'Очікує',
  accepted: 'Прийнято',
  rejected: 'Відхилено'
};

function tone(status) {
  if (status === 'accepted') return '#4ade80';
  if (status === 'pending') return '#fbbf24';
  return '#98a1b1';
}

export function buildOrderWorkflow(role, user, order) {
  const isAdmin = role === ROLES.ADMIN;
  const isClientOwner = role === ROLES.CLIENT && user?.customer?.id === order.customerId;
  const isAssignedFreelancer =
    role === ROLES.FREELANCER && user?.freelancer?.id === order.freelancerId;
  const myApplication =
    role === ROLES.FREELANCER
      ? order.applications.find((app) => app.freelancerId === user.freelancer?.id) || null
      : null;
  const statusCode = order.status?.code;
  const orderReview = order.reviews.find((review) => review.authorId === user?.id) || null;
  const canPublish = isAdmin && statusCode === 'moderation';
  const canAcceptWork = isClientOwner && statusCode === 'review';
  const canRequestDelivery =
    isClientOwner &&
    order.deliveryNeeded &&
    !order.delivery &&
    ['in_progress', 'review', 'completed'].includes(statusCode);

  return {
    statusCode,
    isAdmin,
    isClientOwner,
    isAssignedFreelancer,
    myApplication: myApplication
      ? {
        ...myApplication,
        statusLabel: labels[myApplication.status] || myApplication.status,
        statusTone: tone(myApplication.status)
      }
      : null,
    applications: order.applications.map((app) => ({
      ...app,
      statusLabel: labels[app.status] || app.status,
      statusTone: tone(app.status)
    })),
    showApplications: isClientOwner || isAdmin,
    canPublish,
    canReject: canPublish,
    canApply: role === ROLES.FREELANCER && statusCode === 'open' && !myApplication,
    canCancelFreelancer:
      isClientOwner &&
      Boolean(order.freelancerId) &&
      ['in_progress', 'review'].includes(statusCode),
    canAcceptWork,
    canReturnWork: canAcceptWork,
    canRequestDelivery,
    canReviewOrder: isClientOwner && statusCode === 'completed' && !orderReview,
    canCancelOrder: isClientOwner && ['moderation', 'open'].includes(statusCode),
    canEditRequest: isClientOwner && statusCode === 'cancelled',
    rejectionReason: order.rejectionReason || null,
    orderReview,
    reviews: order.reviews,
    customerCity: order.customer?.city || '',
    deliveryId: order.delivery?.id || null
  };
}
