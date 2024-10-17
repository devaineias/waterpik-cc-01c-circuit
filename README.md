## Introduction

The Waterpik Complete Care 9.0 (CC-01W) is a water flosser with a separate sonic toothbrush. While it does an excellent job at flossing your teeth, it doesn't last long which forces you to toss money into the drain. From the device's reviews, we can list the different type of failures as follows:
- Motor failure (Toothbrush can charge but flosser doesn't work)
- Circuit failure (Motor doesn't turn, toothbrush doesn't charge - might show that its trying to charge but it doesn't)

There haven't been any mentions of the mechanical parts failing, which is a good sign.

#### How does the Waterpik's circuit work?
The device works strictly with North America's 120V AC. It does not have a adapter to convert and step down the voltage to usable and safe levels. Rather the circuit inside the device converts the 120V AC to DC with a full bridge rectifier that uses 8 instead of the usual 4 diodes and a capacitor. Then, the circuit does 3 things:
1. Turns the motor on and off
2. Steps down the voltage
3. Wirelessly charges the toothbrush (when toothbrush is plugged in)

The motor that Waterpik has chosen is the Johnson DF315XLG, which works with 120V DC and only has a lifespan of 150 hours as stated in the [documentation](https://www.effebibo.it/wp-content/uploads/2019/03/Series_High%20Voltage%20DC%20Motors_Metric.pdf) which explains the motor failures stated on the reviews. Also, the device sets the water pressure mechanically instead of reducing motor speed with PWM, which contributes to motor wear. 

For the toothbrush to charge, the circuit first steps down the voltage with a buck converter and then the wireless charger IC. The wireless charger sends small pulses, which when the toothbrush is plugged in, it picks them up, the circuit detects it and starts the charging process.

#### Where it can fail
1. Motor dying (note the 2A fuse)
3. Circuit shorting out

As said previously, the motor has a short lifespan of 150 hours. This, combined with the fact that it always runs at 100% independently of the water pressure setting selected and the device not having any water protection contribute to the device failing prematurely.

## Solution

To make the device last way longer and actually safe, we can use either a 12V or a 24V DC motor, depending on the availability of motors in the dimensions and speed needed. Along with a new motor, we will also need to design a new circuit and add silicone around the device's housing.
Luckily for you, I already designed the circuit.

#### How the new circuit works
As a power source, I chose an old adapter that outputs 12V DC and can do 4.16A. You should choose your adapter based on the motor you selected. The circuit can take 12 to 24V DC and the traces (assuming the board's copper weight is 1 oz/sq ft and traces are located on the outer layers) can handle 4.8A combined (4.16A for motor, ~0.6A for charger circuit). The circuit can be divided into 3 parts:

1. Soft power latching
2. Buck converter
3. Toothbrush charger

The soft power latching circuit will be used to turn the motor on and off with a button press (the button on the left side of the device). To achieve this, we will be using two 2N2222A transistors and a IRF4905 MOSFET to drive the motor., along with a few resistors and a capacitor.

For the buck converter, we will use the MAX17502 buck converter IC to step down the 12/24V input down to a fixed 5V1A output.

For the battery charger, we ditch wireless charging and instead use the MCP73831 Li-Ion/Li-Po which the output current can be adjusted with a resistor, from 15mA to 500mA. It also has 4 voltage options depending on the chip model chosen:
1. 4.20V
2. 4.35V
3. 4.40V
4. 4.50V

<!-- START COMPONENTS SECTION -->
## Electrical components needed

| Name | Designator | Quantity | Manufacturer Part | Supplier | Supplier Part | Price per Unit (USD) | Price per Specified Quantity (USD) | Total Price (Min Order Amount) (USD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 10µF Capacitor | C1, C2 | 2 | C1206C106K4RACAUTO | LCSC | C141190 | 0.141 | 0.282 | 0.7050 |
| 10µF Capacitor | C3, C4 | 2 | C1206C106K8RAC7800 | LCSC | C600021 | 0.1231 | 0.2462 | 0.6155 |
| 33µF Capacitor | C5 | 1 | EEEFK1K330P | LCSC | C128461 | 0.3213 | 0.3213 | 1.6065 |
| 2.2µF Capacitor | C6, C7 | 2 | GRM32ER72A225KA35L | LCSC | C86054 | 0.1386 | 0.2772 | 0.6930 |
| 22µF Capacitor | U4 | 1 | GRM32ER71E226ME15K | LCSC | C2167828 | 0.3395 | 0.3395 | 1.6975 |
| 3.3nF Capacitor | C8 | 1 | GRM155R71H332KA01D | LCSC | C85963 | 0.0029 | 0.0029 | 0.2900 |
| 1µF Capacitor | C9 | 1 | 06033C105KAT2A | LCSC | C597116 | 0.0528 | 0.0528 | 0.5280 |
| 22µH Inductor | D1 | 1 | SRR1260A-220M | LCSC | C3224283 | 1.258 | 1.258 | 1.2580 |
| LED | LED1 | 1 | XL-1608SURC-04 | LCSC | C965798 | 0.0046 | 0.0046 | 0.4600 |
| 2N2222A | Q1, Q2 | 2 | 2N2222A | LCSC | C358533 | 0.0232 | 0.0464 | 0.4640 |
| 2kΩ Resistor | R1 | 1 | RC0805FR-072KL | LCSC | C114572 | 0.0021 | 0.0021 | 0.2100 |
| 100kΩ Resistor | R2, R3 | 2 | MFR50SFTE52-100K | LCSC | C173137 | 0.0196 | 0.0392 | 0.9800 |
| 470Ω Resistor | R4 | 1 | CRCW0603470RFKEA | LCSC | C844786 | 0.0071 | 0.0071 | 0.7100 |
| 10kΩ Resistor | R5 | 1 | RC0402FR-0710KL | LCSC | C60490 | 0.0005 | 0.0005 | 0.0500 |
| 3.32MΩ Resistor | R6 | 1 | RC0402FR-073M32L | LCSC | C477691 | 0.0008 | 0.0008 | 0.0800 |
| 866kΩ Resistor | R7 | 1 | RC0402FR-07866KL | LCSC | C137931 | 0.0004 | 0.0004 | 0.0400 |
| IRF4905 | U1 | 1 | AUIRF4905 | LCSC | C533263 | 8.2195 | 8.2195 | 8.2195 |
| MCP73831T-2ACI/OT | U2 | 1 | MCP73831T-2ACI/OT | LCSC | C424093 | 0.7623 | 0.7623 | 0.7623 |
| 680kΩ Resistor | U3 | 1 | CR1/4W-680K±5%-RT52 | LCSC | C2896880 | 0.004 | 0.004 | 0.2000 |
| MAX17502FATB+T | U5 | 1 | MAX17502FATB+T | LCSC | C559500 | 1.7307 | 1.7307 | 1.7307 |
| 5A Schottky Diode | - | 2 | XL-1608SURC-04 | LCSC | C7503125 | 0.0846 | 0.1692 | 0.4230 |

Total Price per Specified Quantity: $13.77

Total Price (Min Order Amount): $21.72

<!-- END COMPONENTS SECTION -->

# Project Status
Currently awaiting materials and tools needed

# Project ETA 
Early September 2024
