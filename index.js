const fs = require('fs').promises;
var rpio = require('rpio');
const usbDetect = require('usb-detection');
const drivelist = require('drivelist');
var font = require('oled-font-5x7');
const { validateHeaderName } = require('http');
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

let menuIndex = 0;
let menuOptions = ["Grab Files From Drone", "Dump Drone Files To USB", "Clear Files From drone"];

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

rpio.open(11, rpio.INPUT, rpio.PULL_UP);
rpio.open(13, rpio.INPUT, rpio.PULL_UP);

function pollcb(pin)
{
    /*
        * Wait for a small period of time to avoid rapid changes which
        * can't all be caught with the 1ms polling frequency.  If the
        * pin is no longer down after the wait then ignore it.
        */
    rpio.msleep(200);

    if (rpio.read(pin))
    {
        return;
    }
    
    if(pin == 11)
    {
        menuIndex++;
        LoadMenu();
    }
    if(pin == 13)
    {
        validate();
    }

}

rpio.poll(11, pollcb, rpio.POLL_LOW);
rpio.poll(13, pollcb, rpio.POLL_LOW);
const LoadMenu = () =>
{
    if(usbPath == "")
    {
        return;
    }

    if(menuIndex >= menuOptions.length)
    {
        menuIndex = 0;
    }
    var option = menuOptions[menuIndex]
    oled.clearDisplay();
    oled.setCursor(1, 1);
    oled.writeString(font, 1, option, 1, true);
}
let isValidating = false;
const validate = () =>
{
    if(!isValidating)
    {
        oled.clearDisplay();
        oled.setCursor(1, 1);
        oled.writeString(font, 2, `"${menuOptions[menuIndex]}" OK?`, 1, true);
        isValidating = true;
    }
    else
    {
        isValidating = false;
        switch (menuIndex) {
            case 0:
                pullData()
                break;
        
            default:
                break;
        }
    }
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
    setTimeout(() => {
        LoadMenu();
    },2000)
    
}

const main = async () =>
{

}

main();