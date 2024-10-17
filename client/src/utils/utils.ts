/**
 * Calculates the average value from an array of data objects.
 *
 * @param {DataType[]} data - An array of data objects, each containing a numeric property 'value'.
 * @returns {number | string} - The average value as a string with two decimal places, or 'N/A' if the input array is empty.
 */
export function getAverage(data: DataType[]): number | string {
  if (data.length === 0) {
    return 'N/A'
  }

  const sum = data.reduce((acc, item) => acc + item.value, 0) // Assuming DataType has a numeric property 'value'
  const average = sum / data.length

  return average.toFixed(2)
}
