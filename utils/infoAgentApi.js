import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const fetchAndStoreInfoAgentToken = async () => {
  try {
    console.log("1111");
    const response = await axios.post(
      'https://api.dev.infoagent.com.au/auth/v1/token/oauth',
      {
        grant_type: 'client_credentials',
        client_id: 'EJjmNQ74TRRreofsBM9V',
        client_secret: '549c979e-9ce4-4b4b-bc37-7ee3daf4a584',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log("RES 1", response.data);

    const { access_token } = response.data;
    await AsyncStorage.setItem('InfoAgentToken', access_token);
    console.log('Token stored successfully.');
  } catch (error) {
    if (error.response) {
      // The server responded with a status other than 200 range
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      // No response received
      console.error('No response received:', error.request);
    } else {
      // Error setting up the request
      console.error('Error:', error.message);
    }
  }
};

export const fetchVehicleReport = async (vin) => {
  console.log("2222");
  const url =
    'https://api.dev.infoagent.com.au/ivds/v1/au/vehicle-report/enhanced-basic';

  try {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('InfoAgentToken');
    if (!token) {
      console.error('No InfoAgent token found in AsyncStorage.');
      return;
    }

    const data = {
      vin: vin,
    };
    console.log("VIN", data)
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log("RES2", response.data)

    // Save the response to AsyncStorage
    await AsyncStorage.setItem('vehicleReport', JSON.stringify(response.data));
    console.log('Response saved to AsyncStorage:', response.data);
  } catch (error) {
    console.error(
      'Error fetching vehicle report:',
      error.response?.data || error.message,
    );
  }
};

export const getVehicleBasicInfo = async () => {
  console.log("3333")
  try {
    const jsonValue = await AsyncStorage.getItem('vehicleReport');
    console.log("Vehile Report", jsonValue)
    if (jsonValue !== null) {
      const report = JSON.parse(jsonValue);
      console.log("REPORT", report)
      const details = report?.result?.vehicle?.details;
      const identification = report?.result?.vehicle?.identification;

      if (details && identification) {
        const { year, make, model, buildDate, compliancePlate } = details;

        const { plate } = identification;

        return {
          year,
          make,
          model,
          buildDate,
          compliancePlate,
          plate,
        };
      } else {
        console.warn('Vehicle details or identification not found in report.');
        return null;
      }
    } else {
      console.warn('No vehicle report found in AsyncStorage.');
      return null;
    }
  } catch (error) {
    console.error('Failed to get vehicle info:', error);
    return null;
  }
};

export const getVehicleAdditionalInfo = async () => {
  console.log("4444")
  try {
    const jsonValue = await AsyncStorage.getItem('vehicleReport');
    console.log("Vehicle REport", jsonValue);
    if (jsonValue !== null) {
      const report = JSON.parse(jsonValue);
      console.log("report", report)
      const details = report?.result?.vehicle?.details;

      if (details) {
        const { fuelType, driveType, transmissionType, bodyType, colour } =
          details;

        return {
          fuelType,
          driveType,
          transmissionType,
          bodyType,
          colour,
        };
      } else {
        console.warn('Vehicle details missing in report.');
        return null;
      }
    } else {
      console.warn('No vehicle report found in AsyncStorage.');
      return null;
    }
  } catch (error) {
    console.error('Failed to get additional vehicle info:', error);
    return null;
  }
};