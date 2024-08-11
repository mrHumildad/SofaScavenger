function convertToNumber(str) {
    // Remove any commas from the string
    str = str.replace(",", "");
  
    // Check if the string ends with "k" or "M"
    const lastChar = str.charAt(str.length - 1);
    let number;
  
    if (lastChar === "k") {
      // Convert the string to a number and multiply by 1000
      number = parseFloat(str.substring(0, str.length - 1)) * 1000;
    } else if (lastChar === "M") {
      // Convert the string to a number and multiply by 1,000,000
      number = parseFloat(str.substring(0, str.length - 1)) * 1000000;
    } else {
      // If the string doesn't end with "k" or "M", assume it's a plain number
      number = parseFloat(str);
    }
  
    return number;
  }
  
  function formatNumber(number) {
    // Check if the number is greater than or equal to 1 million
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      // Check if the number is greater than or equal to 1 thousand
      return (number / 1000).toFixed(1) + "k";
    } else {
      // If the number is less than 1 thousand, return it as is
      return number.toString();
    };
  };
  
  function calculateAge(birthdate) {
    // If birthdate is a timestamp in seconds, convert it to milliseconds
    if (typeof birthdate === 'number' && birthdate < 10000000000) {
        birthdate *= 1000;  // Convert seconds to milliseconds
    }

    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

  module.exports = {
    convertToNumber,
    formatNumber,
    calculateAge
  };
  

  // Examples of how to use the functions
  /* const num1 = convertToNumber("436k");
  const num2 = convertToNumber("3.6M");
  const formattedNum1 = formatNumber(num1);
  const formattedNum2 = formatNumber(num2);
  
  console.log(num1); // Output: 436000
  console.log(num2); // Output: 3600000
  console.log(formattedNum1); // Output: 436.0k
  console.log(formattedNum2); // Output: 3.6M */
  