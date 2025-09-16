export const buildInspectionPayload = (data) => {
  return {
    vin: data.vin,
    make: data.make,
    carModel: data.carModel,
    year: data.year,
    engineNumber: data.engineNumber,
    mileAge: data.mileAge,
    frontImage: data.frontImage,
    rearImage: data.rearImage,
    leftImage: data.leftImage,
    rightImage: data.rightImage,
    bodyChecklist: data.bodyChecklist,
    electricalChecklist: data.electricalChecklist,
    engineFluidsChecklist: data.engineFluidsChecklist,
    operationalChecklist: data.operationalChecklist,
  };
};
