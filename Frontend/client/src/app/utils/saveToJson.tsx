let apiLog: Record<string, Record<string, any[]>> = {};

export const saveToJson = (
  api: string,
  endpoint: string,
  iterations: number,
  numOfReq: number,
  newData: any
) => {
  if (!apiLog[api]) {
    apiLog[api] = {};
  }

  if (!apiLog[api][endpoint]) {
    apiLog[api][endpoint] = [];
  }

  // Skapa en kopia av newData och bearbeta datan för att begränsa decimaler
  const processedData = { ...newData };

  if (processedData.sizeInBytes && Array.isArray(processedData.sizeInBytes)) {
    processedData.sizeInBytes = processedData.sizeInBytes.map(
      (size: any) => parseFloat(size).toFixed(3) // Begränsar till 3 decimaler
    );
  }

  if (processedData.responseTime && Array.isArray(processedData.responseTime)) {
    processedData.responseTime = processedData.responseTime.map(
      (time: any) => parseFloat(time).toFixed(3) // Begränsar till 3 decimaler
    );
  }

  // Lägg till en ny entry med iterations och numOfReq tillsammans med den bearbetade datan
  apiLog[api][endpoint].push({
    iterations,
    numOfReq,
    data: processedData,
  });

  const jsonString = JSON.stringify(apiLog, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "API_DATA.json";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
