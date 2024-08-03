function findClosestDate(targetDate, dataset) {
  const dates = Object.keys(dataset);
  let closestDate = null;
  let closestDifference = Infinity;

  for (let date of dates) {
    const difference = Math.abs(new Date(date) - new Date(targetDate));

    if (difference < closestDifference) {
      closestDifference = difference;
      closestDate = date;
    }
  }

  return closestDate;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

module.exports = {
  findClosestDate,
  formatDate,
};
