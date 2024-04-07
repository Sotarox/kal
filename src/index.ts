#! /usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();
program
    .version("1.0.0")
    .description("Prints all dates between specified first & last date.")
    .argument("<first date>", "The beggining of the date. Format is MMDD")
    .argument("<last date>", "The end of the date. Format is MMDD")
    .action((argFirst: string, argSecond: string) => {
        mainProcess(argFirst, argSecond)
    })
    .parse(process.argv);

function mainProcess(argFirst: string, argSecond: string) {
    const startDate = convertToDate(argFirst);
    const endDate = convertToDate(argSecond);
    if (isLastDateEarlierThanFirstDate(startDate, endDate)) endDate.setFullYear(endDate.getFullYear() + 1);
    printAllDates(startDate, endDate);
}

// convert a String (MMDD) to a js Date object
function convertToDate(dateString: string): Date {
    const today = new Date();
    const currentYear = today.getFullYear();
    const month = parseInt(dateString.substring(0, 2)) - 1;
    const day = parseInt(dateString.substring(2, 4));
    return new Date(currentYear, month, day);
}

function printAllDates(startDate: Date, endDate: Date) {
    const tempDate = startDate;
    while (tempDate.getTime() <= endDate.getTime()) {
        console.log(formatDate(tempDate));
        tempDate.setDate(tempDate.getDate() + 1);
    }
}

function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const dayOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()];
    return `${day} (${dayOfWeek})`;
}

function isLastDateEarlierThanFirstDate(startDate: Date, endDate: Date){
    if (endDate.getTime() < startDate.getTime()) return true;
    else return false;
}