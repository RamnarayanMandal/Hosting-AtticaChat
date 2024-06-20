import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
const GPSTracker = ({ managerId }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState("");
  const [gpsLatitude, setGpsLatitude] = useState(null);
  const [gpsLongitude, setGpsLongitude] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);

  useEffect(() => {
    const geo = navigator.geolocation;

    const userCoords = (position) => {
      let userLatitude = position.coords.latitude;
      let userLongitude = position.coords.longitude;
      setLatitude(userLatitude);
      setLongitude(userLongitude);
    };

    const userGPSCoords = (position) => {
      let userGLatitude = position.coords.latitude;
      let userGLongitude = position.coords.longitude;
      setGpsLatitude(userGLatitude);
      setGpsLongitude(userGLongitude);
    };

    geo.getCurrentPosition(userCoords);
    const watchId = geo.watchPosition(userGPSCoords);

    return () => {
      geo.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      const getUserAddress = async (latitude, longitude) => {
        try {
          const url = `https://api.opencagedata.com/geocode/v1/json?key=b5ddfdc0bf0c428e8530c8aeae8ec37e&q=${latitude}+${longitude}&pretty=1&no_annotations=1`;
          const response = await fetch(url);
          const data = await response.json();
          console.log("opencage", data)
          if (data.results && data.results.length > 0) {
            setAddress(data.results[0].formatted);
          } else {
            setAddress("Address not available");
          }
          const {lat , lng} = data.results[0].geometry;
          const currentLocation = { lat, lng, address:data.results[0].formatted };
          console.log("lhhhhhhhhhh    ",lat,lng)
          axios
          .post(`${BASE_URL}/api/location`, {
            managerId,
            longitude : lng,
            latitude : lat,
            address,
          })
          .then((response) => {
            console.log("Location saved:", response.data);
            setPrevLocation(currentLocation);
          })
          .catch((error) => {
            console.error("Error saving location:", error);
          });
        } catch (error) {
          console.error("Error fetching user address:", error);
          setAddress("Address not available");
        }
      };

      getUserAddress(latitude, longitude);
    }
  }, [latitude, longitude]);


  return null;
};

export default GPSTracker;
