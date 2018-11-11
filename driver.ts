/**
 * Driver program. Simply run this with an input folder containing the input files.
 * By default, the results will be printed to standard output. To have them persist in
 * output files, uncomment the last line of the program.
 * @author Virat Singh, svirat@gmail.com
 */

import { Parser } from "./Parser";

//the input folder containing input files
const inputFolder: string = "./input"; 

const parser = new Parser();
//read the input files
const inputFiles = parser.readFiles(inputFolder);
//compute the purchase information
const purchases = parser.constructPurchase(inputFiles);

//print the receipt
parser.printReceipt(purchases);

//uncomment the following line to write the outputs to files
//parser.writeAndStoreReceipt(purchases, "./output");