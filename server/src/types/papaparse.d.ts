declare module 'papaparse' {
  export function parse<T = any>(csv: string, config?: any): { data: T[]; errors: any[] };
}
