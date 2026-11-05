import { ROLES } from '../roles.js';

const publicResources = new Set(['freelancers', 'projects', 'categories']);

export function courierCity(courier) {
  return courier?.zone?.split('·')[0].trim() || '';
}

export function courierMatches(courier, delivery) {
  const city = courierCity(courier);
  if (!city) return false;
  return [delivery.city, delivery.order?.customer?.city, delivery.order?.freelancer?.city]
    .filter(Boolean)
    .includes(city);
}

export function canViewList(role, resource) {
  if (role === ROLES.ADMIN) return true;
  if (publicResources.has(resource)) return true;
  if (role === ROLES.GUEST) return false;
  if (role === ROLES.COURIER) return resource === 'deliveries';
  return resource === 'orders' || resource === 'deliveries';
}

export function scopeWhere(role, resource, user) {
  if (role === ROLES.ADMIN || publicResources.has(resource)) return {};
  if (!user) return null;

  if (resource === 'orders') {
    if (role === ROLES.CLIENT) return user.customer ? { customerId: user.customer.id } : null;
    if (role === ROLES.FREELANCER) {
      if (!user.freelancer) return null;
      return {
        OR: [
          { freelancerId: user.freelancer.id },
          { status: { code: 'open' } }
        ]
      };
    }
  }

  if (resource === 'deliveries') {
    if (role === ROLES.CLIENT) {
      return user.customer ? { order: { customerId: user.customer.id } } : null;
    }
    if (role === ROLES.FREELANCER) {
      return user.freelancer ? { order: { freelancerId: user.freelancer.id } } : null;
    }
    if (role === ROLES.COURIER) {
      if (!user.courier) return null;
      const city = courierCity(user.courier);
      return {
        OR: [
          { courierId: user.courier.id },
          {
            courierId: null,
            status: 'offered',
            OR: [
              { city },
              { order: { customer: { city } } },
              { order: { freelancer: { city } } }
            ]
          }
        ]
      };
    }
  }

  if (resource === 'couriers' && role === ROLES.COURIER) {
    return user.courier ? { id: user.courier.id } : null;
  }

  return null;
}

export function canViewRecord(role, resource, record, user) {
  if (role === ROLES.ADMIN) return true;
  if (publicResources.has(resource)) return true;
  if (!user) return false;

  if (resource === 'customers') {
    return role === ROLES.CLIENT && user.customer?.id === record.id;
  }

  if (resource === 'orders') {
    if (role === ROLES.CLIENT) return user.customer?.id === record.customerId;
    if (role === ROLES.FREELANCER) {
      return user.freelancer?.id === record.freelancerId || record.status?.code === 'open';
    }
  }

  if (resource === 'deliveries') {
    if (role === ROLES.CLIENT) return user.customer?.id === record.order?.customerId;
    if (role === ROLES.FREELANCER) return user.freelancer?.id === record.order?.freelancerId;
    if (role === ROLES.COURIER) {
      return (
        user.courier?.id === record.courierId ||
        (record.courierId === null &&
          record.status === 'offered' &&
          courierMatches(user.courier, record))
      );
    }
  }

  if (resource === 'couriers') {
    return role === ROLES.COURIER && user.courier?.id === record.id;
  }

  return false;
}

export function canManage(role) {
  return role === ROLES.ADMIN;
}

export function canCompleteDelivery(role, delivery, user) {
  return (
    role === ROLES.COURIER &&
    delivery.status !== 'delivered' &&
    user?.courier?.id === delivery.courierId
  );
}
