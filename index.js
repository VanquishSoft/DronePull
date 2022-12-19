const fs = require('fs').promises;
var gpio = require('rpi-gpio');
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
                    usbPath = drive.mountpoints[0].path;
                    
                    LoadMenu();
                }
            })
        })
    }, 2000)
});

gpio.setup(11, gpio.DIR_IN, readInput);

function readInput(err) {
    if (err) throw err;
    gpio.read(11, function(err, value) {
        if (err) throw err;
        console.log('The value is ' + value);
    });
}
const LoadMenu = () =>
{

}
const clearData = async () =>
{
    for(var dir of fs.readdir('./data'))
    {
        console.log(dir);
    }
}

const pullData = async (path) =>
{
    oled.clearDisplay();
    oled.setCursor(1, 1);
    oled.writeString(font, 2, 'Pulling Data', 1, true);
    await fs.cp(path,"./data",{recursive:true});
    oled.clearDisplay();
    oled.setCursor(1, 1);
    oled.writeString(font, 2, 'Done Pulling', 1, true);
    
}

const main = async () =>
{

}

main();