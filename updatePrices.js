const axios = require('axios');
const fs = require('fs');

const components = [
  { name: "10µF Capacitor", designator: "C1, C2", quantity: 2, productCode: "C141190", productModel: "C1206C106K4RACAUTO" },
  { name: "10µF Capacitor", designator: "C3, C4", quantity: 2, productCode: "C600021", productModel: "C1206C106K8RAC7800" },
  { name: "33µF Capacitor", designator: "C5", quantity: 1, productCode: "C128461", productModel: "EEEFK1K330P" },
  { name: "2.2µF Capacitor", designator: "C6, C7", quantity: 2, productCode: "C86054", productModel: "GRM32ER72A225KA35L" },
  { name: "22µF Capacitor", designator: "U4", quantity: 1, productCode: "C2167828", productModel: "GRM32ER71E226ME15K" },
  { name: "3.3nF Capacitor", designator: "C8", quantity: 1, productCode: "C85963", productModel: "GRM155R71H332KA01D" },
  { name: "1µF Capacitor", designator: "C9", quantity: 1, productCode: "C597116", productModel: "06033C105KAT2A" },
  { name: "22µH Inductor", designator: "D1", quantity: 1, productCode: "C3224283", productModel: "SRR1260A-220M" },
  { name: "LED", designator: "LED1", quantity: 1, productCode: "C965798", productModel: "XL-1608SURC-04" },
  { name: "2N2222A", designator: "Q1, Q2", quantity: 2, productCode: "C358533", productModel: "2N2222A" },
  { name: "2kΩ Resistor", designator: "R1", quantity: 1, productCode: "C114572", productModel: "RC0805FR-072KL" },
  { name: "100kΩ Resistor", designator: "R2, R3", quantity: 2, productCode: "C173137", productModel: "MFR50SFTE52-100K" },
  { name: "470Ω Resistor", designator: "R4", quantity: 1, productCode: "C844786", productModel: "CRCW0603470RFKEA" },
  { name: "10kΩ Resistor", designator: "R5", quantity: 1, productCode: "C60490", productModel: "RC0402FR-0710KL" },
  { name: "3.32MΩ Resistor", designator: "R6", quantity: 1, productCode: "C477691", productModel: "RC0402FR-073M32L" },
  { name: "866kΩ Resistor", designator: "R7", quantity: 1, productCode: "C137931", productModel: "RC0402FR-07866KL" },
  { name: "IRF4905", designator: "U1", quantity: 1, productCode: "C533263", productModel: "AUIRF4905" },
  { name: "MCP73831T-2ACI/OT", designator: "U2", quantity: 1, productCode: "C424093", productModel: "MCP73831T-2ACI/OT" },
  { name: "680kΩ Resistor", designator: "U3", quantity: 1, productCode: "C2896880", productModel: "CR1/4W-680K±5%-RT52" },
  { name: "MAX17502FATB+T", designator: "U5", quantity: 1, productCode: "C559500", productModel: "MAX17502FATB+T" },
  { name: "5A Schottky Diode", designator: "-", quantity: 2, productCode: "C7503125", productModel: "XL-1608SURC-04" }
];

async function fetchComponentData(productCode) {
  const url = `https://wmsc.lcsc.com/ftps/wm/product/detail?productCode=${productCode}`;
  try {
    const response = await axios.get(url);
    return response.data.result;
  } catch (error) {
    console.error(`Failed to fetch data for ${productCode}:`, error);
    return null;
  }
}

async function calculatePrices(component) {
  const data = await fetchComponentData(component.productCode);
  if (!data) return { unitPrice: 'N/A', totalPrice: 'N/A', minTotalPrice: 'N/A' };

  const priceList = data.productPriceList;
  const minBuyNumber = data.minBuyNumber;
  let unitPrice = priceList[0]?.usdPrice || 0;
  for (const priceEntry of priceList) {
    if (component.quantity >= priceEntry.ladder) {
      unitPrice = priceEntry.usdPrice;
    }
  }

  const totalPrice = (unitPrice * component.quantity).toFixed(3);
  const minTotalPrice = (unitPrice * Math.max(component.quantity, minBuyNumber)).toFixed(3);

  return { unitPrice, totalPrice, minTotalPrice };
}

async function updateMarkdownFile() {
  let existingContent = fs.readFileSync('README.md', 'utf8');
  let updatedContent = existingContent.split('\n## Electrical components needed\n')[0];

  updatedContent += '## Electrical components needed\n\n';
  updatedContent += '| Name | Designator | Quantity | Manufacturer Part | Supplier | Supplier Part | Price per Unit (USD) | Price per Specified Quantity (USD) | Total Price (Min Order Amount) (USD) |\n';
  updatedContent += '| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';

  let totalSpecifiedQuantityPrice = 0;
  let totalMinOrderAmountPrice = 0;

  for (const component of components) {
    const { unitPrice, totalPrice, minTotalPrice } = await calculatePrices(component);
    totalSpecifiedQuantityPrice += parseFloat(totalPrice);
    totalMinOrderAmountPrice += parseFloat(minTotalPrice);
    updatedContent += `| ${component.name} | ${component.designator} | ${component.quantity} | ${component.productModel} | LCSC | ${component.productCode} | ${unitPrice} | ${totalPrice} | ${minTotalPrice} |\n`;
  }

  updatedContent += `\n**Total Price per Specified Quantity: $${totalSpecifiedQuantityPrice.toFixed(3)}**\n`;
  updatedContent += `**Total Price (Min Order Amount): $${totalMinOrderAmountPrice.toFixed(3)}**\n`;

  fs.writeFileSync('README.md', updatedContent);
}

updateMarkdownFile();
