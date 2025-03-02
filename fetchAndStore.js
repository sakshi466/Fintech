import { Alert } from "react-native";
import { set, ref } from "firebase/database"; 
import { realtimeDB } from "./firebase"; 

const storeDataInFirebase = async (mutualFundData) => {
  try {
    // Filter out invalid data with undefined values
    const filteredData = mutualFundData.filter(fund => {
      return fund.schemeCode && fund.schemeName && fund.nav && fund.date; 
    });

    // Store the filtered data in Firebase
    await set(ref(realtimeDB, "mutualFunds"), filteredData);
    console.log("Data successfully written to Firebase!");
  } catch (error) {
    console.error("Error storing data in Firebase:", error);
  }
};

// Function to fetch and store mutual funds
export async function fetchAndStoreMutualFunds() {
  try {
    const response = await fetch("http://localhost:5000/fetch-mutual-funds"); 
    if (!response.ok) {
      throw new Error("Failed to fetch mutual fund data");
    }
    const data = await response.text(); 
    console.log("Fetched Mutual Fund Data:", data);

    // Parse the fetched data into an object
    const mutualFundData = parseMutualFundData(data); 
    
    // Log the data to check its integrity
    console.log("Parsed Mutual Fund Data:", mutualFundData);

    // Now store the data in Firebase
    await storeDataInFirebase(mutualFundData);
  } catch (error) {
    console.error("Error fetching or storing mutual fund data:", error);
    Alert.alert("Error", "Could not fetch mutual fund data. Please try again later.");
  }
}

// A helper function to parse the fetched data (modify according to your data format)
const parseMutualFundData = (data) => {
  // Assuming the data is a string with semicolons separating the fields
  const parsedData = data.split("\n").map(line => {
    const [schemeCode, isinDivPayout, isinGrowth, schemeName, nav, date] = line.split(";");
    return { schemeCode, isinDivPayout, isinGrowth, schemeName, nav, date };
  });
  return parsedData;
};
