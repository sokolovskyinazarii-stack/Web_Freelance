export function orderTitle(row) {
  return row.title || row.project?.title || row.orderNumber;
}

export function orderCategory(row) {
  return row.category || row.project?.category || null;
}

export function orderCategoryName(row) {
  return orderCategory(row)?.name || 'Без категорії';
}

export function orderDeadline(row) {
  return row.deadline || row.project?.deadline || null;
}

export function orderBudget(row) {
  return row.project?.budget ?? row.amount;
}
