#! /usr/bin/env node

import { Command } from 'commander';
import { exec } from 'child_process';

const program = new Command();
program
    .version("1.0.0")
    .description("Prints all dates between specified first & last date.")
    .argument("<first date>", "The beggining of the date. Format is MMDD")
    .argument("<last date>", "The end of the date. Format is MMDD")
    .option('-y, --year <year>', 'specify a year to the beginning of the date')
    .parse(process.argv);

const options = program.opts();
let YEAR:number;
if (options.year) YEAR = parseInt(options.year);
else {
    const today = new Date();
    YEAR = today.getFullYear();
} 
const args:string[] = program.args;
if (args.length != 2) {
    console.error("two arguments must be given; beginning of the date (MMDD) & end of the date (MMDD)")
    process.exit(1);
} else {
    mainProcess(args[0], args[1]);
}

function mainProcess(argFirst: string, argSecond: string) {
    const startDate = convertToDate(argFirst);
    const endDate = convertToDate(argSecond);
    // Normally the same year is set to both start- and endDate. 
    // This makes problem for the calcuration over the year, e.g. Dec 30 to Jan 08.
    // In that case, endDate increments year by the following lines. 
    if (isLastDateEarlierThanFirstDate(startDate, endDate)) {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }
    printAllDates(startDate, endDate);
    showCalendar(startDate, endDate);
}

// convert a String (MMDD) to a js Date object
function convertToDate(dateString: string): Date {
    const month = parseInt(dateString.substring(0, 2)) - 1;
    const day = parseInt(dateString.substring(2, 4));
    return new Date(YEAR, month, day);
}

function printAllDates(startDate: Date, endDate: Date) {
    console.log("Year", startDate.getFullYear());
    const tempDate = new Date(startDate.getTime());
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

export function isLastDateEarlierThanFirstDate(startDate: Date, endDate: Date){
    if (endDate.getTime() < startDate.getTime()) return true;
    else return false;
}

function showCalendar(startDate: Date, endDate: Date){
    console.log(""); // line feed
    // cal command interpret 1 = Jan, whereas getMonth returns 0 for Jan. So increment is necessary. 
    const startMonth = startDate.getMonth() +1;
    const endMonth = endDate.getMonth() +1;
    if (startMonth <= endMonth){
        let tempMonth = startMonth;
        while (tempMonth <= endMonth){
            callCal(startDate.getFullYear(), tempMonth);
            tempMonth++;
        }
    } else {
        let tempMonth = startMonth;
        while (tempMonth <= 12){
            callCal(startDate.getFullYear(), tempMonth);
            tempMonth++;
        }
        tempMonth = 1;
        while (tempMonth <= endMonth){
            callCal(endDate.getFullYear(), tempMonth);
            tempMonth++;
        }
    }
}

function callCal(year: number, month: number){
    const cmd = `cal -d ${year}-${month}`;
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Std Error: ${stderr}`);
          return;
        }
        console.log(`${stdout}`);
      });
}