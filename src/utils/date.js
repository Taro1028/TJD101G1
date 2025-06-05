export function getDatesInRange(startStr, endStr) {
    const start = new Date(startStr)
    const end = new Date(endStr)
    const dateArray = []

    while (start <= end) {
        dateArray.push(start.toISOString().split('T')[0])
        start.setDate(start.getDate() + 1)
    }

    return dateArray
}