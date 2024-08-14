function median(values) {
    values.sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];
    else
        return (values[half - 1] + values[half]) / 2.0;
};

function calculateStandardDeviation(array, avg) {
    const variance = array.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / array.length;
    return Math.sqrt(variance);
};

function percentile(values, percentile) {
    values.sort((a, b) => a - b);
    const index = Math.ceil(percentile / 100.0 * values.length) - 1;
    return values[index];
};

function calculateSkewness(array, avg, stdDev) {
    const n = array.length;
    return (n * array.reduce((sum, val) => sum + Math.pow((val - avg) / stdDev, 3), 0)) / ((n - 1) * (n - 2));
};

function calculateKurtosis(array, avg, stdDev) {
    const n = array.length;
    return ((n * (n + 1) * array.reduce((sum, val) => sum + Math.pow((val - avg) / stdDev, 4), 0)) / ((n - 1) * (n - 2) * (n - 3))) -
           (3 * Math.pow(n - 1, 2) / ((n - 2) * (n - 3)));
};

function detectOutliers(array, q1, q3) {
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return array.filter(value => value < lowerBound || value > upperBound);
};

function calculateCorrelation(xArray, yArray) {
    const n = xArray.length;
    const avgX = xArray.reduce((sum, x) => sum + x, 0) / n;
    const avgY = yArray.reduce((sum, y) => sum + y, 0) / n;

    const numerator = xArray.reduce((sum, x, i) => sum + (x - avgX) * (yArray[i] - avgY), 0);
    const denominatorX = Math.sqrt(xArray.reduce((sum, x) => sum + Math.pow(x - avgX, 2), 0));
    const denominatorY = Math.sqrt(yArray.reduce((sum, y) => sum + Math.pow(y - avgY, 2), 0));

    return numerator / (denominatorX * denominatorY);
};

function calculateStats(unfilteredArray) {
    console.log(unfilteredArray)
    const array = unfilteredArray.filter(value => value);
    if (array.length === 0) return null;
    const badValue = unfilteredArray.length - array.length;
    const total = array.reduce((acc, val) => acc + val, 0);
    const min = Math.min(...array);
    const max = Math.max(...array);
    const avg = total / array.length;
    const med = median(array);
    const stdDev = calculateStandardDeviation(array, avg);
    const q1 = percentile(array, 25);
    const q3 = percentile(array, 75);
    const qArr = [
        percentile(array, 5),   // die => 2 
        percentile(array, 20),  // die => 3
        percentile(array, 35),  // die => 4
        percentile(array, 50),  // die => 5
        percentile(array, 65),  // die => 6
        percentile(array, 80),  // die => 7
        percentile(array, 95),  // die => 8
    ];
    const skewness = calculateSkewness(array, avg, stdDev);
    const kurtosis = calculateKurtosis(array, avg, stdDev);
    const outliers = detectOutliers(array, q1, q3);

    return {
        total,
        min,
        max,
        avg,
        median: med,
        standardDeviation: stdDev,
        percentile25: q1,
        percentile75: q3,
        qArr: qArr,
        skewness,
        //kurtosis,
        //outliers,
        badValue
    };
};

module.exports = calculateStats;