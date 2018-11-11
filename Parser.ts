/**
 * Parser class is used to read the input text files, parse through the information
 * to create the purchase objects, compute tax and cost information from this data,
 * and then print this information to standard output and write it to output files.
 * @author Virat Singh, svirat@gmail.com
 */

import { Purchase } from "./Purchase";
declare var require: any

export class Parser {

  //file reader
  private fs = require('fs');

  /**
   * Parses the input files from the input folder and stores the data for object creation
   * @param inputFolder the folder with the input file data
   * @returns parsed input purchase data of each purchase in each basket, so
   *          parsedFiles[i][j] indicates the jth purchase in the ith basket
   * @throws Error if input folder does not exist in current directory
   */
  public readFiles(inputFolder: string): string[][] {

    //get the names of all the input files, if folder exists
    try {
      var allInputFiles: string[] = this.fs.readdirSync(inputFolder);
    }
    catch(e) {
      throw Error("Input folder does not exist: " + e);
    }

    //the buffer holding the purchase information in text form
    var parsedFiles: string[][] = [];

    //read every input file and store the raw text into the buffer
    for(let i in allInputFiles) {
      var rawText: string = this.fs.readFileSync(inputFolder + "\\" + allInputFiles[i], 'utf8');
      var textByLine: string[] = rawText.split("\n");
      parsedFiles[i] = textByLine;
    }

    return parsedFiles;
  }

  /**
   * Creates the purchase objects used to calculate tax and create receipts.
   * 
   * The purchase is constructed on these assumptions:
   * [5]        [imported]?       [bags of candy]            [at] [10.99]
   * Quantity   Imported or not   Name determines if taxed         Price
   * 
   * @param parsedFiles nested array with purchase information for each basket
   * @returns nested array with purchase objects for each basket
   */
  public constructPurchase(parsedFiles: string[][]): Purchase[][] {

    //the buffer holding the purchased objects
    var purchases: Purchase[][] = [];
    //read the parsed information for all the files (baskets)
    for(let i in parsedFiles) {

      //keep track of the purchases for this particular basket
      var currentFilePurchases: Purchase[] = [];
      //read every purchase information in the basket
      for(let j in parsedFiles[i]) {

        //parse through the text and read in purchase attributes
        var purchaseInfo: string[] = parsedFiles[i][j].split(" ");
        var quantity: number = this.parseQuantity(purchaseInfo);
        var imported: boolean = this.parseIfImported(purchaseInfo);
        var name: string = this.parseName(purchaseInfo, imported);
        var taxFree: boolean = this.parseIfTaxFree(purchaseInfo);
        var price: number = this.parsePrice(purchaseInfo);

        //construct the purchase object and store it in the buffer
        var purchase: Purchase = new Purchase(name, quantity, price, taxFree, imported);
        purchase.computeOverallSalesTax();
        currentFilePurchases.push(purchase);
        
      }

      purchases.push(currentFilePurchases);
    }

    return purchases;
  }

  /**
   * Reads the purchase object and constructs purchase sentences to add to the receipt.
   * Also adds up the taxes and total price of every basket for the receipt
   * @param purchases every product purchased in the basket, and its attributes
   * @returns text of the purchase, including sales tax and total price
   */
  private receiptStringBuilder(purchases: Purchase[]): string {

    //the details to be added to the receipt of a basket
    var receiptDetails: string = "";
    //the sales tax computed for this receipt
    var salesTax: number = 0;
    //the price of all the purchases in this receipt
    var purchasePrice: number = 0;

    //go over all the purchases in the receipt
    for(let i in purchases) {

      //start constructing the receipt text to print out
      //adding the quantity to the output string
      receiptDetails += String(purchases[i].getQuantity()) + " ";

      if(purchases[i].getImported()) {
        receiptDetails += "imported ";
      }

      //adding the name of the purchase to the output string
      receiptDetails += String(purchases[i].getName()) + ": ";

      //adding the price to the output string
      receiptDetails += this.receiptFriendlyNumbers(purchases[i].getPrice() + purchases[i].getSalesTax()) + "\n";

      //compute the sales tax and total price while reading the purchases in this basket
      salesTax += purchases[i].getQuantity() * purchases[i].getSalesTax();
      purchasePrice += (purchases[i].getQuantity() * purchases[i].getPrice());

    }

    //add the sales tax and total price (in receipt-friendly way)
    receiptDetails += "Sales Taxes: " + this.receiptFriendlyNumbers(salesTax) + "\n";
    receiptDetails += "Total: " + this.receiptFriendlyNumbers(purchasePrice + salesTax);
    
    return receiptDetails;
  }

  /**
   * Prints the receipt to standard output
   * @param purchases every product purchased in the basket, and its attributes
   */
  public printReceipt(purchases: Purchase[][]): void {

    for(let i in purchases) {

      //get the text for the receipt and simply print this out
      var receiptDetails: string = this.receiptStringBuilder(purchases[i]);

      console.log("Output " + i + ": ");
      console.log(receiptDetails);
      console.log("");
      
    }
  }

  /**
   * Helper function to print the prices in the receipts as intended (commas and 
   * two decimal points only)
   * @param num number to print in receipt (ex: 10000.450)
   * @returns receipt-friendly version of number (ex: 10,000.45)
   */
  private receiptFriendlyNumbers(num: number): String {

    //get the decimal places
    var textNumber: string = String(num.toFixed(2));
    var decimalPoints: string = textNumber.slice(textNumber.length - 2);

    //get the integer value and add commas
    var commaNumber: string = Math.floor(num).toLocaleString();
    return commaNumber + "." + decimalPoints;
  }

  /**
   * Reads the quantity of the product purchased
   * @param info the text with purchase information
   * @returns quantity of the product purchased
   * @throws Range Error if the quantity is negative or not an integer
   *         Type Error is the quantity is non a number
   */
  private parseQuantity(info: string[]): number {

    //we assume the first element will mention the quantity of products
    var quantity: number = Number(info[0]);

    //check if quantity is in proper range
    if(isNaN(quantity)) {
      throw TypeError("Non-numeral quantity detected: " + info[0]);
    }
    if(quantity < 0) {
      throw RangeError("Negative quantity detected: " + quantity);
    }
    if(Math.floor(quantity) != quantity) {
      throw RangeError("Non-integer quantity detected: " + quantity);
    }

    return quantity;
  }

  /**
   * Reads whether the product purchased was imported
   * @param info the text with purchase information
   * @returns whether the product purchased was imported
   */
  private parseIfImported(info: string[]): boolean {

    //we assume an imported purchase will be declared as such after the quantity
    return info[1].toLowerCase() == "imported";
  }

  /**
   * Reads the name of the product purchased
   * @param info the text with purchase information
   * @param imported whether the product was imported
   * @returns name of the product purchased
   */
  private parseName(info: string[], imported: boolean): string {

    //we assume the name of the item is always after the quantity and import elements
    if(imported) {
      return info.slice(2, info.length - 2).join(" ");
    }

    return info.slice(1, info.length - 2).join(" ");
  }

  /**
   * Reads whether the purchase was tax-free or not
   * @param info the text with purchase information
   * @returns whether the purchase was tax-free
   */
  private parseIfTaxFree(info: string[]): boolean {

    //we assume these keyword purchases are tax-free (not exhaustive)
    const EXEMPT_KEYWORDS: string[] = ["skittles", "popcorn", "coffee", "snickers", "chocolate", "M&Ms", "gimmy bears"];

    //checking to see if the purchase is tax-free
    let intersection = info.filter(x => EXEMPT_KEYWORDS.indexOf(x.toLowerCase()) > -1);

    return intersection.length != 0;
  }

  /**
   * Reads the price of the purchase from the text in the file
   * @param info the text with purchase information
   * @return price of the purchase
   * @throws Range Error if price is negative
   *         Type Error if price is not a number
   */
  private parsePrice(info: string[]): number {

    //we assume the price is always the last element of the array
    var price: number = Number(info[info.length - 1].replace(",", ""));

    //check if price is valid
    if(isNaN(price)) {
      throw TypeError("Non-numeral price detected: " + info[info.length - 1]);
    }
    if(price < 0) {
      throw RangeError("Invalid price detected: " + price);
    }

    return price;
  }

  /**
   * Creates a new file with the receipt information. Currently unused.
   * @param purchases every product purchased in the basket, and its attributes
   * @param outputFolder the folder to write the outputs to. Creates it if non-existent
   * @throws Error in case of file writing error
   */
  public writeAndStoreReceipt(purchases: Purchase[][], outputFolder: string): void {

    //create the output folder if it does not exist
    if (!this.fs.existsSync(outputFolder)){
      this.fs.mkdirSync(outputFolder);
    }

    //write receipt of each basket in its own output file
    for(let i in purchases) {

      var receiptDetails: string = this.receiptStringBuilder(purchases[i]);
      this.fs.writeFile(outputFolder + "/output" + i, receiptDetails, function(err) {
  
        if(err) {
            throw Error("Unable to write to output files: " + err);
        }
      
      }); 
    }
  }

}
