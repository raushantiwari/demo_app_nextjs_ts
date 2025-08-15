export function formatQueryForDebug(query: string, params: unknown[]): string {
  return query.replace(/\$(\d+)/g, (_, idx) => {
    const val = params[idx - 1];
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'string') {
      // Escape single quotes in string
      return `'${val.replace(/'/g, "''")}'`;
    }
    if (val instanceof Date) {
      return `'${val.toISOString()}'`;
    }
    return val.toString();
  });
}
