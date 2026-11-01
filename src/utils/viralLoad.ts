export const getViralLoadStatus = (viralLoad: number) => {
  if (viralLoad <= 0) {
    return {
      status: "Not recorded",
      message: "Your viral load has not been recorded yet. Please update your health record.",
      progress: "0%",
    };
  }

  if (viralLoad < 50) {
    return {
      status: "Undetectable",
      message: "Great job — your viral load is very low, which helps protect you and your baby.",
      progress: "95%",
    };
  }

  if (viralLoad < 1000) {
    return {
      status: "Low",
      message: "Your viral load is low, but continue your medication, attend regular checkups, and request for follow up Viral Load tests.",
      progress: "70%",
    };
  }

  if (viralLoad < 10000) {
    return {
      status: "Moderate",
      message: "Your viral load is higher than expected. Please speak with your healthcare provider immediately.",
      progress: "45%",
    };
  }

  return {
    status: "High",
    message: "WARNING! Your viral load is high. Please contact your doctor or clinic immediately.",
    progress: "20%",
  };
};