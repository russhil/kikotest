
import { useState } from "react";
import axios from "axios";

const useDownloadShipmentDetails = () => {
  const [loading, setLoading] = useState(false);

  const downloadShipmentDetails = async (providerId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_ONDC_APP_KIKO_API_V2}/b2blogistic/downloadTripDetails`,
        { providerId }
      );

      const fileUrl = response?.data?.data?.Location;
      if (fileUrl) {
        window.open(fileUrl, "_blank");
        return true; // success
      } else {
        return false; // no data
      }
    } catch (error) {
      console.error("Error downloading shipment details:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { downloadShipmentDetails, loading };
};



export default useDownloadShipmentDetails;
