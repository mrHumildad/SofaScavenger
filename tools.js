const calculateStats = require('./statsLIB')

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

const initArrays = {
  teamFollowers: [],
  stadium: [],
  plValue : [],
  plAge: [],
  plATT: [],
  plTEC: [],
  plTAC: [],
  plDEF: [],
  plCRE: [],
  plTOT: [],
  plRating: [],
  plNumber: 0,
  noATTR: [],
  noRating: [] 
};

const getReport = (rawData, isTeam) => {
  const baseReport = {
    playerValue: calculateStats(rawData.plValue),
    playerAge: calculateStats(rawData.plAge),
    playerATT: calculateStats(rawData.plATT),
    playerTEC: calculateStats(rawData.plTEC),
    playerTAC: calculateStats(rawData.plTAC),
    playerDEF: calculateStats(rawData.plDEF),
    playerCRE: calculateStats(rawData.plCRE),
    playerTOT: calculateStats(rawData.plTOT),
    playerRating: calculateStats(rawData.plRating),
    playerNumber: rawData.plNumber,
    noATTR: rawData.noATTR.length,
    noRating: rawData.noRating.length
  };

  /* if (!isTeam) {
    return {
      ...baseReport,
      teamFollowers: calculateStats(rawData.teamFollowers),
      stadiumCapacity: calculateStats(rawData.stadium)
    }; */
  /* } else {
    } */
 return baseReport;
};

  module.exports = {
    convertToNumber,
    formatNumber,
    calculateAge,
    getReport,
    initArrays
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
  