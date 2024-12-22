//(c) 2023 j hudson
/*
MIT License

Copyright (c) 2023, 2024 J Hudson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {cornus} from "./cornus.js"

function main()
{
    let t = new cornus.Tree("A");
    let b = t.root.addChild("B\nfoo\nbar" );
    let c = t.root.addChild("...C...");
    t.root.addChild("C.5");
    c.addChild("blarg");
    c.addChild("boom");
    let d = t.root.addChild("D");
    let e = b.addChild("E");
    let f = b.addChild("F");
    let g = d.addChild("G\ntrumpets...............\ntubas.............\nand trombones");
    let h = d.addChild("H");
    let i = f.addChild("Once");
    let j = f.addChild("Upon");
    let k = f.addChild("a Time...");
    f.addChild("Hansel");
    f.addChild("Gretal");
    f.addChild("K4");
    f.addChild("K5");
    f.addChild("K6");
    f.addChild("K7");
    f.addChild("K8");
    let l = g.addChild("L");
    let m = g.addChild("M");
    let n = g.addChild("N");
    let o = h.addChild("O");

    let jpg = document.createElement("img");
    jpg.onload = () => {
        o.addChild(jpg);
        let div = document.getElementById("testdiv1");
        t.renderHTML(div);
    };

    //a rainbow gradient jpeg image
    jpg.src=(
`data:image/jpeg;base64,
/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDACweISchHCwnJCcyLyw1Qm9IQj09QohhZlBvoY2ppp6N
m5ixx//Ysbzxv5ib3v/g8f//////rNX/////////////2wBDAS8yMkI6QoJISIL/t5u3////////
////////////////////////////////////////////////////////////wAARCACgAKADASIA
AhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAgMEAQAF/8QAHhAAAwEBAQEBAQEBAAAAAAAAAAEC
AxESITEyQUL/xAAZAQACAwEAAAAAAAAAAAAAAAADBAABAgX/xAAdEQADAQEBAQEBAQAAAAAAAAAA
AQIDETEhQRIT/9oADAMBAAIRAxEAPwCY445LoA6pwcx0KIHxBh1wxVcAnMdOYycxqlIC7F60FTmG
sw+pAujHWwD0N8o7iB9GeicZh6h8R3lAejfROMr/AFNeYFZhqjek60EWhPWYmsy5ymLrM0rDToef
cC2uF1wT3AaaGJvok41rhgQIcNiAYnpTnBinwxVcNiCiIOzgY/iF6ropdnfEC6BqgHRSQpegToF0
A6AdhFPRd6NjPRnoS7M9hFkzPWP9G+if2arI8mTrKFQSonVhqgbjhatooVBp9J1QyaBtDEaG3HRG
kFKfQbnqLT4NxZ5+kCWuF2kE2kh5obiujM5Kc5F5yUwuIFbAaUF+ICmbTFUzCQjpZlMXVHVQm6Dx
HRVt0zasXVgVYqrOhngbmBjsH2K62dxjSxQVZjfYSsRxnfUR4ot5lU2MmyNWMmxbTAFUFs0MlkkW
PihDTPgL7JTLGJ9J5Y2WLNDWdg6STaSWv6ifSTUsezoLND38QGaCpmX6C0YumKph2xNs3KOfo+sX
dCLoO2T3R08My4kGqMSOldGyjoeDcR0FSF5DUhqTLoaWYnyY5H+QXJP6I8yepMT4x1SKpGvRe44N
iiiKIofGUZsS3zE7ksljZZPDHSzl2uGIfGPlgaI2Wba+AvGP5s6Pwygp/kGifpnViqEaMdQjQPmv
oi/SfRk9fWO0E/8AR2cV8GIQcobKFyOkJQ/mhkT0dOZmaKojoCq4buuE7zE3HD0LjiJtEVNdKm+k
VIVSKLQmg8smiE/jHZsTX6MzK1XUc/RFebHyT5lEHG1X0W/R0hv+RcDf8FmO5Myf5Bo2Pwyifpeq
E0I0KKEaIPm/oi/STQT/ANFGiJ6+M7OL+DEMZI6REsbLCUP5srzZVF8IIrg6dAFT03c9K7vqJtGY
9BN30qZ4VMcAtiaDpiqYeUTRi6/RmYv9Y7NFaviOfoyjMogRmh8nG1f0W/RsDf8ABchv+RZjuSBz
YVITmx7+oj9C6IRaE2iikKpG5Zz9FxklonuSy5EXJ08NC4onl8GyxdSYmdD0bi+FCoNUTqgvRlyN
LQd6BdC/Rjon8kegVUKpnVRiXWa8F7vpsLrKM0BElESJb6Cd0MhDpQEobKOXb6YhdYco238NlAaM
F6x/NCM6KYfUQ50U50btDGkjaQqkP/UBSMJiOkE1SJuSqkLqQ8XwVacsjqBVQWVAuoOhnubmyTjR
3WPcA+BpbIKtBXWd9Y3wEoI9kW9BSgZMDJgZMC2m4KrBiB8SdMjJQhpp0F9o2UNlGShiXBZsazgx
/ET6UM0om0o1KHs5J4rhTnZGNiw9LozU9PQzsY/qI4soixep4KXB1SA5H/GC5KTFLzJ3IDgocguQ
irgu82iZwZ4KPJnkItWZ4xHg1QO8m+SPVk4xSgNSGpCUg3fS1DYKkZMmqQ0uA2xiMzEuA3XEdd8E
aWWl0biDNLJtKN0sS30PMjcTw45PhxwQINix8WRhzfDDnpip6ehOg1UmQToOnQC4F6zKuJguRc6B
rQxxoA8zvJnkP0juonWYeQHk3yF1HekTrK/yMUm8MegFaE42EWYx0kLrQXWgmtDSgNOYy7J7sG7F
t9DTIxMcNb6YccECH//Z`);

}

main();
