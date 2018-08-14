# NodeLEDStrip

This is a project I have wanted to do for awhile now. It incorporates all of what I have learned over the past few years, as well as forcing me to dive into a lot of new stuff.  I currently have 217 Individually Addressable RGB LEDS on a WS2812B model strip. I had to solder together multiple runs. The entire strip is housed in a aluminum Trim with a diffuser facing 45 degrees out. This runs the length of my large Archway between my dinning and living room. The entire thing is controlled by a raspberry pi utilizing the PWM chip. The strips and the Pi are powered by a 40A 5V switching power supply. The pi is running the code in this repository.

I have currently only installed and wired up one side of the arch, but I intend to do both sides.

* [Youtube Playlist](https://www.youtube.com/watch?v=LEyLriReHHk&list=PLUW9Uv_SIhkn0fOyYsdwr3gnks06696BE)
* [Project Progress Part 1](https://www.youtube.com/watch?v=LEyLriReHHk) - Just testing strip and Pi GPIO
* [Project Progress Part 2](https://www.youtube.com/watch?v=v1P74RwA05s) - Testing trim mount and look
* [Project Progress Part 3]() - COMING - This will be the app showcase

## Materials

```
Raspberry Pi:
Pi powered by 5V and needs about 2.5 Amps.
I am currently using the Pi 2 Model B
https://www.amazon.com/Raspberry-Pi-Model-Desktop-Linux/dp/B00T2U7R7I/ref=sr_1_3?ie=UTF8&qid=1534259904&sr=8-3&keywords=raspberry+pi+2+model+b&dpID=4133JwedpXL&preST=_SX300_QL70_&dpSrc=srch
```
```
Power:
200 Watt, 40 Amp, 5 Voltage
With the strips and the Pi, I need roughly 28.5 amps total.
https://www.amazon.com/gp/product/B075V6YBBT/ref=oh_aui_detailpage_o07_s00?ie=UTF8&psc=1
```
```
Strips:
Strip is 30 LEDS/Meter and 0.06 amps per LED
With Both sides of the Arch total length would be 14.5 meters.
Sold in 5M reals
https://www.amazon.com/gp/product/B00ZHB9M6A/ref=oh_aui_detailpage_o03_s01?ie=UTF8&psc=1
```
```
Trim:
Sold in 1M strips, pack of 5.
https://www.amazon.com/gp/product/B019CVJD8C/ref=oh_aui_detailpage_o03_s00?ie=UTF8&psc=1
```
```
Miscellaneous Parts:
3 Prong outlet cable for Power supply.
Spliced micro USB cable to power Pi off of Power Supply.
various length cables for connecting PI GPIO pins and data lines of PI an power for LEDS.
Trim I ordered came with some cable, which was nice.
Screws and wall anchors to mount trim.
```

## Tools

```
Soldering Iron and de-soldering tool
Used to connect the LED strips together.
```
```
Hammer and Power Drill
Used for installing trim.
```
```
Electric Saw
Used for cutting trim to length.
```

## Built With

* [Raspbian pi OS](https://www.raspberrypi.org/downloads/raspbian/) - Linux OS for Raspberry Pi
* [NodeJS](https://nodejs.org) - Server Javascript Backend, powered by Chrome V8 Engine
* [VueJS](https://vuejs.org/) - Used for Virtual Dom rendering, client responsiveness
* [Framework7](https://framework7.io/) - CSS framework, Designed for mobile webapp

## Authors

* **Dustin Welborn** - [GitHub](https://github.com/Dakine135) - [Youtube](https://www.youtube.com/channel/UCDjcmcvaXppX6DxXJUbJFSQ)

## Acknowledgments

* Just a shout-out to my wife who has been very supportive of my crazy projects.
