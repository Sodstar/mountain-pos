export function generateColumnDefinitions<T extends object>(headerTranslations?: Record<keyof T, string>) {
  return function(obj: T) {
    return Object.keys(obj).map(key => ({
      header: headerTranslations?.[key as keyof T] || key,
      accessor: key as keyof T
    }));
  };
}