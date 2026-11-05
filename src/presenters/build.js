export function buildTable(columns, rows, resource) {
  return {
    columns: columns.map((column) => ({
      label: column.label,
      align: column.align || ''
    })),
    rows: rows.map((row) => ({
      id: row.id,
      href: `/${resource}/${row.id}`,
      cells: columns.map((column) => ({
        ...column.cell(row),
        align: column.align || ''
      }))
    }))
  };
}

export function buildList(entity, rows, query) {
  return {
    searchHint: entity.list.searchHint,
    query,
    tableData: buildTable(entity.list.columns, rows, entity.key)
  };
}

export function buildDetail(entity, row) {
  return {
    label: entity.label,
    accent: entity.accent,
    title: entity.detail.title(row),
    subtitle: entity.detail.subtitle(row),
    avatar: entity.detail.avatar(row),
    badge: entity.detail.badge(row),
    metrics: entity.detail.metrics.map((metric) => ({
      label: metric.label,
      hint: metric.hint ? metric.hint(row) : '',
      cell: metric.cell(row)
    })),
    fields: entity.detail.fields.map((field) => ({
      label: field.label,
      wide: Boolean(field.wide),
      cell: field.cell(row)
    })),
    relations: (entity.detail.relations || []).map((relation) => ({
      title: relation.title,
      empty: relation.empty || 'Пов’язаних записів немає.',
      table: buildTable(relation.columns, relation.items(row) || [], relation.resource)
    }))
  };
}
