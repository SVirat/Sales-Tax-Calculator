/**
 * Testing suite for the Purchase class. All currently used and non-trivia public 
 * methods have multiple unit tests assessing their correctness.
 * @author Virat Singh, svirat@gmail.com
 */

import { Purchase } from "../Purchase";
import { expect } from 'chai';
import 'mocha';

describe('Computing overall sales tax', () => {

    it('should compute no overall tax', () => {
        let taxFreePurchase: Purchase = new Purchase("Tax Free Purchase", 1, 10, true, false);
        const result: number = taxFreePurchase.computeOverallSalesTax();
        expect(result).to.equal(0);
    });

    it('should compute basic sales tax only', () => {
        let basicTaxedPurchase: Purchase = new Purchase("Basic Taxed Purchase", 1, 10, false, false);
        const result: number = basicTaxedPurchase.computeOverallSalesTax();
        expect(result).to.equal(1);
    });

    it('should compute import tax only', () => {
        let importedPurchase: Purchase = new Purchase("Import Taxed Purchase", 1, 10, true, true);
        const result: number = importedPurchase.computeOverallSalesTax();
        expect(result).to.equal(0.5);
    });

    it('should compute both basic sales tax and import tax', () => {
        let importedAndTaxedPurchase: Purchase = new Purchase("Full Taxed Purchase", 1, 10, false, true);
        const result: number = importedAndTaxedPurchase.computeOverallSalesTax();
        expect(result).to.equal(1.5);
    });

    it('should compute no tax because of free item', () => {
        let freePurchase: Purchase = new Purchase("Free Purchase But Taxed", 1, 0, false, true);
        const result: number = freePurchase.computeOverallSalesTax();
        expect(result).to.equal(0);
    });
    
    it('should throw error on negative price purchase', () => {
        let negativePricePurchase: Purchase = new Purchase("Negative Price Purchase", 1, -10, false, true);
        expect(function() { negativePricePurchase.computeOverallSalesTax() } ).throw(RangeError);
    });

  });