export default function(val, oldMin, oldMax, newMin, newMax) {
    //low2 + (value - low1) * (high2 - low2) / (high1 - low1)
    return newMin + (val - oldMin) * (newMax - newMin) / (oldMax - oldMin);
}
