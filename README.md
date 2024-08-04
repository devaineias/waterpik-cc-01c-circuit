## Introduction

The Waterpik Complete Care 9.0 (CC-01W) is a water flosser with a separate sonic toothbrush. While it does an excellent job at flossing your teeth, it doesn't last long which forces you to toss money into the drain. From the device's reviews, we can list the different type of failures as follows:
- Motor failure (Toothbrush can charge but flosser doesn't work)
- Circuit failure (Motor doesn't turn, toothbrush doesn't charge - might show that its trying to charge but it doesn't)

There haven't been any mentions of the mechanical parts failing, which is a good sign.

#### How does the Waterpik's circuit work?
The device works strictly with North America's 120V AC. It does not have a adapter to convert and step down the voltage to usable and safe levels. Rather the circuit inside the device converts the 120V AC to DC with a full bridge rectifier that uses 8 instead of the usual 4 diodes and a capacitor. Then, the circuit has 3 jobs to do:
1. Turn the motor on and off
2. Step down the voltage
3. Wirelessly charge the toothbrush

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
As a power source, I chose a old adapter that outputs 12V DC and can do 4.16A. You should choose your adapter based on the motor you selected. The circuit can take 12 to 24V DC and the traces (assuming the board's copper weight is 1 oz/sq ft and traces are located on the outer layers) can handle 4.8A combined (4.16A for motor, ~0.6A for charger circuit). The circuit can be divided into 3 parts:

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

The toothbrush as stated on Waterpik's website, uses 3 Ni-Cd batteries connected in series with a total voltage output of 3.6V and total capacity of 680mAh. We will be replacing those with a single 18500 Li-Ion battery (18650 doesn't fit), which has an output voltage of 3.7V-4.2V, and depending on which battery you choose, it will usually have a slightly higher capacity. A BMS should be added to the battery for protection. Now to actually charge the battery we will make 2 small holes on the bottom cap of the toothbrush and insert 2 galvanized nails (to prevent rust) with the pointy sides up. Then we solder 2 wires on each nail and connect them to the battery terminals, bypassing the toothbrush's wireless charging circuit. To help with preventing connecting the toothbrush to the charger in reverse, we add 2 magnets with opposing poles on each side. Then we verify the connections and that the toothbrush is working and finally we cover the bottom cap with silicone or glue for a waterproof fit and let it dry. 

--

### Electrical components needed

| ID  | Name              | Designator | Quantity | Manufacturer Part     | Supplier | Price (USD) |
| --- | ----------------- | ---------- | -------- | --------------------- | -------- | ----------- |
| 2   | 10µF Capacitor    | C1, C2     | 2        | C1206C106K4RACAUTO    | LCSC     | 0.141       |
| 3   | 10µF Capacitor    | C3, C4     | 2        | C1206C106K8RAC7800    | LCSC     | 0.122       |
| 4   | 33µF Capacitor    | C5         | 1        | EEEFK1K330P           | LCSC     | 0.316       |
| 5   | 2.2µF Capacitor   | C6, C7     | 2        | GRM32ER72A225KA35L    | LCSC     | 0.131       |
| 6   | 22µF Capacitor    | U4         | 1        | GRM32ER71E226ME15L    | LCSC     | -           |
| 7   | 3.3nF Capacitor   | C8         | 1        | GRM155R71H332KA01D    | LCSC     | 0.003       |
| 8   | 1µF Capacitor     | C9         | 1        | 06033C105KAT2A        | LCSC     | 0.052       |
| 9   | 22µH Inductor     | D1         | 1        | SRR1260A-220M         | LCSC     | 0.567       |
| 10  | LED               | LED1       | 1        | 19-217/R6C-AL1M2VY/6T | LCSC     | 0.0154      |
| 11  | 2N2222A           | Q1, Q2     | 2        | 2N2222A               | LCSC     | 0.023       |
| 12  | 2kΩ Resistor      | R1         | 1        | RC0805FR-072KL        | LCSC     | 0.002       |
| 13  | 100kΩ Resistor    | R2, R3     | 2        | MFR50SFTE52-100K      | LCSC     | 0.019       |
| 14  | 470Ω Resistor     | R4         | 1        | CRCW0603470RFKEA      | LCSC     | 0.006       |
| 15  | 10kΩ Resistor     | R5         | 1        | RC0402FR-0710KL       | LCSC     | 0.001       |
| 16  | 3.32MΩ Resistor   | R6         | 1        | RC0402FR-073M32L      | LCSC     | 0.001       |
| 17  | 866kΩ Resistor    | R7         | 1        | RC0402FR-07866KL      | LCSC     | -           |
| 19  | IRF4905           | U1         | 1        | IRF4905               | LCSC     | -           |
| 20  | MCP73831T-2ACI/OT | U2         | 1        | MCP73831T-2ACI/OT     | LCSC     | 0.691       |
| 21  | 680kΩ Resistor    | U3         | 1        | CR1/4W-680K±5%-RT52   | LCSC     | 0.004       |
| 22  | MAX17502FATB+T    | U5         | 1        | MAX17502FATB+T        | LCSC     | 1.111       |

