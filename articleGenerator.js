const puppy = require("puppeteer");
const prompt = require("prompt-sync")();
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
// const selenium = require("selenium-webdriver");
// const ch = require("chromedriver");



async function main() {
    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false,
    });


    let keywords = prompt("Enter Perfect keywords for your article:");
    let tabs = await browser.pages();
    let tab = tabs[0];

    await tab._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: 'E:\\22_Sokle\\PEP_Coding\\Projects\\articalGenerator'
    });


    ///DownLoad article from articleGenerator 
    ///this is free to generator article upto 3 and can download the file

    await tab.goto("https://articlegenerator.org/");
    await tab.type("#keyword", keywords);
    await tab.select("select#mode", "public");
    await tab.select("select#lang", "us");
    await tab.select("select#rewrite", "original");
    await tab.select("select#numbers", "3");
    await tab.click("#submit");
    await tab.waitForSelector(".normal-button.larg.thm-btn");
    let downloadFile = await tab.$$('div[align="center"] a');

    let name = await tab.evaluate(function (ele) {
        return ele.getAttribute("href").split('/')[1];
    }, downloadFile[0]);
    await tab.evaluate(function (ele) {
        return ele.click();
    }, downloadFile[0]);

    await tab.waitForTimeout(10000);


    ///////////////format file///Name Also/////////////

    formateFileData("E:\\22_Sokle\\PEP_Coding\\Projects\\articalGenerator\\", name, keywords);

    // let file = fs.readFileSync("E:\\22_Sokle\\PEP_Coding\\Projects\\articalGenerator\\" + name, "utf-8");
    // // console.log(file);
    // return file;


    /// upload file in mega.nz this is free for 50 gb data......

    let id = "12sandeepsokle@gmail.com";
    let pass = "12Sandeep@Sokle";

    await tab.goto("https://mega.nz/login");
    await tab.waitForSelector(".common-dialog-button.positive.right.accept-cookies");
    await tab.click(".common-dialog-button.positive.right.accept-cookies");
    await tab.waitForSelector("#login-name2");
    await tab.type("#login-name2", id);
    // await tab.waitForSelector("#login-password2");
    await tab.type("#login-password2", pass);
    await tab.click("#login-check2")
    await tab.click(".big-red-button.height-48.login-button.button.right");
    await tab.waitForSelector(".nw-fm-tree-folder", { visible: true });
    await tab.click(".nw-fm-tree-folder");

    ///////////////////////////////////////////////
    // Upload File

    await tab.waitForSelector('#fileselect1');
    await tab.waitForTimeout(1000);
    const inputUploadHandle = await tab.$('#fileselect1');
    let fileToUpload = "E:\\22_Sokle\\PEP_Coding\\Projects\\articalGenerator\\" + keywords + ".txt";

    // Sets the value of the file input to fileToUpload
    inputUploadHandle.uploadFile(fileToUpload);


    ///complete upload file.
    ////////////////////////////////////////

    return keywords;
}

function formateFileData(fileAddress, fileName, newFileName) {
    let data = fs.readFileSync(fileAddress + fileName, "utf-8").split("\n");
    let ansData = "";
    let lineNo = 0;
    let i = 0;
    while (true) {
        if (lineNo >= data.length && i >= data.length)
            break;
        if (data[i] != undefined) {
            if (lineNo % 2 == 0) {
                ansData += (lineNo/2 + 1) + ". ";
                
            }
            ansData += " " + data[i];
            lineNo++;
        }
        if (lineNo % 2 == 0)
            ansData += "\n";
        i++;

    }


    // console.log(ansData);
    fs.writeFileSync(fileAddress + newFileName + ".txt", ansData);
}



main().then(function (ele) {
    console.log(ele + ".txt File Download and Upload Successfully:");
});