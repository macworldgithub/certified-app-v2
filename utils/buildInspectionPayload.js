// buildInspectionPayload.js

export const buildInspectionPayload = (data) => {
  return {
    vin: data.vin, // VIN / Chassis Number
    year: data.year,
    make: data.make,
    model: data.model,
    registrationPlate: data.registrationPlate,
    registrationExpiry: data.registrationExpiry,
    buildDate: data.buildDate,
    complianceDate: data.complianceDate,

    // Images object
    images: {
      front: data.images.front,
      rear: data.images.rear,
      left: data.images.left,
      right: data.images.right,
    },

    // Step 2 fields
    odometer: data.odometer,
    fuelType: data.fuelType,
    driveTrain: data.driveTrain,
    transmission: data.transmission,
    bodyType: data.bodyType,

    // Step 3 fields
    color: data.color,
    frontWheelDiameter: data.frontWheelDiameter,
    rearWheelDiameter: data.rearWheelDiameter,
    keysPresent: data.keysPresent,

    // Step 4 fields
    serviceBookPresent: data.serviceBookPresent,
    serviceHistoryPresent: data.serviceHistoryPresent,

    // Step 5 fields
    tyreConditionFrontLeft: data.tyreConditionFrontLeft,
    tyreConditionFrontRight: data.tyreConditionFrontRight,
    tyreConditionRearRight: data.tyreConditionRearRight,
    tyreConditionRearLeft: data.tyreConditionRearLeft,

    // Step 6 fields
    damagePresent: data.damagePresent,
    roadTest: data.roadTest,
    roadTestComments: data.roadTestComments,
    generalComments: data.generalComments,
  };
};
