/**
 * Testing suite for the Parser class. All currently used and non-trivia public 
 * methods have multiple unit tests assessing their correctness.
 * @author Virat Singh, svirat@gmail.com
 */

import { Parser } from "../Parser";
import { Purchase } from "../Purchase";
import { expect } from 'chai';
import 'mocha';

const parser: Parser = new Parser();

describe('Reading input files', () => {

    it('should throw error as input folder does not exist', () => {
        const inputFolder: string = "./ThisFolderDoesNotExist";
        expect(function() { parser.readFiles(inputFolder) } ).throw(Error);
    });

    it('should do nothing as input files are empty', () => {
        const inputFolder: string = "./test/EmptyReadingTest";
        const result: string[][] = parser.readFiles(inputFolder);
        expect(result.length).to.equal(1);
        expect(result[0][0]).to.equal(' ');
    });
    
    it('should read valid input files', () => {
        const inputFolder: string = "./test/ValidReadingTest";
        const parsedValidFileData: string[][] = parser.readFiles(inputFolder);
        const result: string = parsedValidFileData.toString().replace(",", " ");
        expect(result).to.equal("1 16lb bag of Skittles at 16.00\r 1 Walkman at 99.99");
    });
});

describe("Creating Purchases", () => {
  
    it('should create a valid empty purchase', () => {
        const emptyParsed: string[][] = [];
        const emptyPurchase: Purchase[][] = parser.constructPurchase(emptyParsed);
        expect(emptyPurchase.length).to.equal(0);
    });

    it('should create a valid tax free purchase', () => {
       const taxFreeSentenceParsed: string[][] = [ [ "5 bags of skittles at 10.00" ] ]; 
       const purchases: Purchase[][] = parser.constructPurchase(taxFreeSentenceParsed);
       
       expect(purchases.length).to.equal(1);
       var taxFreePurchase: Purchase = purchases[0][0];
       expect(taxFreePurchase.getSalesTax()).to.equal(0);
       expect(taxFreePurchase.getName()).to.equal("bags of skittles");
       expect(taxFreePurchase.getPrice()).to.equal(10);
       expect(taxFreePurchase.getQuantity()).to.equal(5);       
       expect(taxFreePurchase.getTaxFree()).to.equal(true);
       expect(taxFreePurchase.getImported()).to.equal(false);
    
    });

    it('should create a valid imported purchase', () => {
        const importSentenceParsed: string[][] = [ [ "5 imported bags of skittles at 10.00" ] ]; 
        const purchases: Purchase[][] = parser.constructPurchase(importSentenceParsed);
        
        expect(purchases.length).to.equal(1);
        var importedPurchase: Purchase = purchases[0][0];
        expect(importedPurchase.getSalesTax()).to.equal(0.5);
        expect(importedPurchase.getName()).to.equal("bags of skittles");
        expect(importedPurchase.getPrice()).to.equal(10);
        expect(importedPurchase.getQuantity()).to.equal(5);       
        expect(importedPurchase.getTaxFree()).to.equal(true);
        expect(importedPurchase.getImported()).to.equal(true);
    });

    it('should create a valid taxed purchase', () => {
        const taxedSentenceParsed: string[][] = [ [ "5 trucks of ice cream at 100.00" ] ]; 
        const purchases: Purchase[][] = parser.constructPurchase(taxedSentenceParsed);
        
        expect(purchases.length).to.equal(1);
        var taxedPurchase: Purchase = purchases[0][0];
        expect(taxedPurchase.getSalesTax()).to.equal(10);
        expect(taxedPurchase.getName()).to.equal("trucks of ice cream");
        expect(taxedPurchase.getPrice()).to.equal(100);
        expect(taxedPurchase.getQuantity()).to.equal(5);       
        expect(taxedPurchase.getTaxFree()).to.equal(false);
        expect(taxedPurchase.getImported()).to.equal(false);
    });

    it('should create a valid imported taxed purchase', () => {
        const importAndTaxedSentenceParsed: string[][] = [ [ "5 imported trucks of ice cream at 100" ] ]; 
        const purchases: Purchase[][] = parser.constructPurchase(importAndTaxedSentenceParsed);
        
        expect(purchases.length).to.equal(1);
        var importedAndTaxedpurchase: Purchase = purchases[0][0];
        expect(importedAndTaxedpurchase.getSalesTax()).to.equal(15);
        expect(importedAndTaxedpurchase.getName()).to.equal("trucks of ice cream");
        expect(importedAndTaxedpurchase.getQuantity()).to.equal(5);       
        expect(importedAndTaxedpurchase.getPrice()).to.equal(100);
        expect(importedAndTaxedpurchase.getTaxFree()).to.equal(false);
        expect(importedAndTaxedpurchase.getImported()).to.equal(true);
    });

    it('should not create an invalid negative price purchase', () => {
        const negativePriceSentenceParsed: string[][] = [ [ "5 loans at -100" ] ]; 
        expect(function() { parser.constructPurchase(negativePriceSentenceParsed) } ).throw(RangeError);
    });

    it('should not create an invalid non-numeric price purchase', () => {
        const nonNumericPriceSentenceParsed: string[][] = [ [ "5 loans at Hundred" ] ]; 
        expect(function() { parser.constructPurchase(nonNumericPriceSentenceParsed) } ).throw(TypeError);
    });

    it('should not create an invalid negative quantity purchase', () => {
        const negativeQuantitySentenceParsed: string[][] = [ [ "-5 phones at 5000.00" ] ]; 
        expect(function() { parser.constructPurchase(negativeQuantitySentenceParsed) } ).throw(RangeError);
    });

    it('should not create an invalid non-numeric quantity purchase', () => {
        const nonNumericQuantitySentenceparsed: string[][] = [ [ "Five phones at 5000.00" ] ]; 
        expect(function() { parser.constructPurchase(nonNumericQuantitySentenceparsed) } ).throw(TypeError);
    });

});

