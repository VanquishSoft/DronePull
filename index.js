const fs = require('fs').promises;

const usbDetect = require('usb-detection');
const drivelist = require('drivelist');
var i2c = require('i2c-bus'),
  i2cBus = i2c.openSync(1),
  oled = require('oled-i2c-bus');

var opts = {
    width: 128,
    height: 32,
    address: 0x3D
};

var oled = new oled(i2cBus, opts);
oled.turnOnDisplay();
let usbPath = "";

usbDetect.startMonitoring();

// Detect insert
usbDetect.on('add', () => {
    drivelist.list().then((drives) => {
        drives.forEach((drive) => {
            if (drive.isUSB) {
                usbPath = drive.mountpoints[0].path;
                oled.fillRect(1, 1, 10, 20, 1);
            }
        })
    })
});

const main = async () =>
{
    const ls = await fs.readdir("/");
    console.log(ls);
}

main();