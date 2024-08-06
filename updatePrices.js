const axios = require('axios');
const fs = require('fs');

const components = [
  { name: "10µF Capacitor", designator: "C1, C2", quantity: 2, productCode: "C141190" },
  { name: "10µF Capacitor", designator: "C3, C4", quantity: 2, productCode: "C600021" },
  { name: "33µF Capacitor", designator: "C5", quantity: 1, productCode: "C128461" },
  { name: "2.2µF Capacitor", designator: "C6, C7", quantity: 2, productCode: "C86054" },
  { name: "22µF Capacitor", designator: "U4", quantity: 1, productCode: "C2167828" },
  { name: "3.3nF Capacitor", designator: "C8", quantity: 1, productCode: "C85963" },
  { name: "1µF Capacitor", designator: "C9", quantity: 1, productCode: "C597116" },
  { name: "22µH Inductor", designator: "D1", quantity: 1, productCode: "C3224283" },
  { name: "LED", designator: "LED1", quantity: 1, productCode: "C965798" },
  { name: "2N2222A", designator: "Q1, Q2", quantity: 2, productCode: "C358533" },
  { name: "2kΩ Resistor", designator: "R1", quantity: 1, productCode: "C114572" },
  { name: "100kΩ Resistor", designator: "R2, R3", quantity: 2, productCode: "C173137" },
  { name: "470Ω Resistor", designator: "R4", quantity: 1, productCode: "C844786" },
  { name: "10kΩ Resistor", designator: "R5", quantity: 1, productCode: "C60490" },
  { name: "3.32MΩ Resistor", designator: "R6", quantity: 1, productCode: "C477691" },
  { name: "866kΩ Resistor", designator: "R7", quantity: 1, productCode: "C137931" },
  { name: "IRF4905", designator: "U1", quantity: 1, productCode: "C533263" },
  { name: "MCP73831T-2ACI/OT", designator: "U2", quantity: 1, productCode: "C424093" },
  { name: "680kΩ Resistor", designator: "U3", quantity: 1, productCode: "C2896880" },
  { name: "MAX17502FATB+T", designator: "U5", quantity: 1, productCode: "C559500" },
  { name: "5A Schottky Diode", designator: "-", quantity: 2, product_code: "C7503125" }
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
  let content = '## Electrical components needed\n\n';
  content += '| Name | Designator | Quantity | Manufacturer Part | Supplier | Supplier Part | Price per Unit (USD) | Price per Specified Quantity (USD) | Total Price (Min Order Amount) (USD) |\n';
  content += '| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';

  let totalSpecifiedQuantityPrice = 0;
  let totalMinOrderAmountPrice = 0;

  for (const component of components) {
    const { unitPrice, totalPrice, minTotalPrice } = await calculatePrices(component);
    totalSpecifiedQuantityPrice += parseFloat(totalPrice);
    totalMinOrderAmountPrice += parseFloat(minTotalPrice);
    content += `| ${component.name} | ${component.designator} | ${component.quantity} | ${component.productModel} | LCSC | ${component.productCode} | ${unitPrice} | ${totalPrice} | ${minTotalPrice} |\n`;
  }

  content += `\n**Total Price per Specified Quantity: $${totalSpecifiedQuantityPrice.toFixed(3)}**\n`;
  content += `**Total Price (Min Order Amount): $${totalMinOrderAmountPrice.toFixed(3)}**\n`;

  fs.writeFileSync('README.md', content);
}

updateMarkdownFile();
