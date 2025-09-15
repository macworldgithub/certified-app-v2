export const buildInspectionPayload = (inspectionData) => {
  return {
    inspectionDetail: {
      vin: inspectionData.vin,
      make: inspectionData.make,
      carModel: inspectionData.model, // ✅ model → carModel
      year: inspectionData.year,
    },
    engineVerify: {
      engineNumber: inspectionData.engineNumber,
      mileAge: inspectionData.mileage, // ✅ mileage → mileAge
    },
    images: {
      front: inspectionData.images.front || null,
      rear: inspectionData.images.rear || null,
      left: inspectionData.images.left || null,
      right: inspectionData.images.right || null,
    },
    bodyChecklist: inspectionData.body,
    electricalChecklist: inspectionData.electrical,
    engineFluidsChecklist: inspectionData.fluids,
    operationalChecklist: inspectionData.operational,
    rating: null,
    email: "", // optional
  };
};
