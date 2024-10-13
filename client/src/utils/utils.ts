export function getAverage(data: number[]): number | string {
  return data.length ? (data.reduce((sum, value) => sum + value, 0) / data.length).toFixed(2) : "N/A"
}
