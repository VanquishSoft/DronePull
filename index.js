const fs = require('fs').promises;

const usbDetect = require('usb-detection');
const drivelist = require('drivelist');
var font = require('oled-font-5x7');
var i2c = require('i2c-bus'),
  i2cBus = i2c.openSync(1),
  oled = require('oled-i2c-bus');

var opts = {
    width: 128,
    height: 32,
    address: 0x3C
};

var oled = new oled(i2cBus, opts);
oled.turnOnDisplay();
oled.clearDisplay();
let usbPath = "";

usbDetect.startMonitoring();

// Detect insert
usbDetect.on('add', () => {
    const poll = setInterval(() => {
        drivelist.list().then((drives) => {
            drives.forEach((drive) => {
                if (drive.isUSB && usbPath == "") {
                    const usbPath = drive.mountpoints[0].path;
                    oled.setCursor(1, 1);
                    oled.writeString(font, 1, 'Device Connected', 1, true);
                    pullData();
                }
            })
        })
    }, 2000)
});

const clearData = async () =>
{
    for(var dir of fs.readdir('./data'))
    {
        console.log(dir);
    }
}

const pullData = async () =>
{
    var dir = fs.readdir(usbPath)

    console.log(dir);
    
}

const main = async () =>
{

}

main();