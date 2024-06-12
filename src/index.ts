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
    if (isLastDateEarlierThanFirstDate(startDate, endDate)) {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }
    printAllDates(startDate, endDate);
    showCalendar();
}

// convert a String (MMDD) to a js Date object
function convertToDate(dateString: string): Date {
    const month = parseInt(dateString.substring(0, 2)) - 1;
    const day = parseInt(dateString.substring(2, 4));
    return new Date(YEAR, month, day);
}

function printAllDates(startDate: Date, endDate: Date) {
    console.log("Year", startDate.getFullYear());
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

export function isLastDateEarlierThanFirstDate(startDate: Date, endDate: Date){
    if (endDate.getTime() < startDate.getTime()) return true;
    else return false;
}

function showCalendar(){
    // TODO: implement properly display month
    const cmd = `cal -d ${YEAR}-01`;
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