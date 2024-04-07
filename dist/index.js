#! /usr/bin/env node
"use strict";
const { Command } = require("commander"); // add this line
const fs = require("fs");
const path = require("path");
const program = new Command();
program
    .version("1.0.0")
    .description("An example CLI for managing a directory")
    .argument("<first>", "The beggining of the date. Format is DDMM")
    .argument("<second>", "The end of the date. Format is DDMM")
    // .action((argFirst: string, argSecond: string) => {
    //     console.log("1st:", argFirst);
    //     console.log("2nd:", argSecond);
    // })
    .action((argFirst, argSecond) => {
    getCalenderLines(argFirst, argSecond);
})
    .parse(process.argv);
function getCalenderLines(argFirst, argSecond) {
    const startDate = convertToDate(argFirst);
    const endDate = convertToDate(argSecond);
    printAllDates(startDate, endDate);
}
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const dayOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()];
    return `${day} (${dayOfWeek})`;
}
// convert a String (MMDD) to a js Date object
function convertToDate(dateString) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const month = parseInt(dateString.substring(0, 2)) - 1;
    const day = parseInt(dateString.substring(2, 4));
    return new Date(currentYear, month, day);
}
function printAllDates(startDate, endDate) {
    const tempDate = startDate;
    while (tempDate.getTime() <= endDate.getTime()) {
        console.log(formatDate(tempDate));
        tempDate.setDate(tempDate.getDate() + 1);
    }
}
//# sourceMappingURL=index.js.map