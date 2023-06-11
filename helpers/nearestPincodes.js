const locatinCollection = [
    {
      _id: "64699cb8ce862d570a5e449c",
      pincode: null,
      latitude: 9.8991117,
      longitude: 77.0173667
    },
    // Add more objects to the collection...
  ];
  
  function getPincodesWithinRange(inputPincode) {
    const R = 6371; // Earth's radius in kilometers
    const result = [];
  
    const inputLocation = locatinCollection.find(obj => obj.pincode === inputPincode);
  
    if (!inputLocation) {
      console.log(`Pincode ${inputPincode} not found.`);
      return result;
    }
  
    locatinCollection.forEach(location => {
      if (location.pincode && location.pincode !== inputPincode) {
        const lat1 = inputLocation.latitude;
        const lon1 = inputLocation.longitude;
        const lat2 = location.latitude;
        const lon2 = location.longitude;
  
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
  
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
  
        if (distance <= 30) {
          result.push(location.pincode);
        }
      }
    });
  
    return result;
  }
  
  function toRad(value) {
    return value * Math.PI / 180;
  }
  
  const inputPincode = "12345"; // Replace with your desired pincode
  const pincodesWithinRange = getPincodesWithinRange(inputPincode);
  console.log(pincodesWithinRange);
  