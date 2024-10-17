export function getAverage(data: DataType[]): number | string {
  if (data.length === 0) {
    return 'N/A';
  }

  const sum = data.reduce((acc, item) => acc + item.value, 0); // Assuming DataType has a numeric property 'value'
  const average = sum / data.length;

  return average.toFixed(2);
}

export function parseVariant(data: string): { type: string; value: number } {
  const regex = /Variant\((Scalar<(\w+)>), value: (.+)\)/
  const match = data.match(regex)

  if (match) {
    const type = match[2] // Verinin tipi: Int32, Float, vs.
    let value: number // Declare value as a number

    // Tipine göre değeri dönüştür
    if (type === 'Int32') {
      value = parseInt(match[3], 10)
    } else if (type === 'Float') {
      value = parseFloat(match[3])
    } else {
      throw new Error('Unsupported type')
    }

    return {
      type: `Scalar<${type}>`,
      value: value,
    }
  } else {
    throw new Error('Invalid format')
  }
}
