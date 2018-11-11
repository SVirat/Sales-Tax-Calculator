/**
 * The Purchase class defines a purchase in the shopping basket. It includes the number
 * of the products purchased, the product name, the price per one product, whether the
 * product was tax-free or imported, and finally the resultant tax on the sale of the product.
 * @author Virat Singh, svirat@gmail.com
 */
export class Purchase {

    //the name of the product purchased
    private name: string;
    //the number of same products purchased
    private quantity: number;
    //the price of each purchase
    private price: number;
    //whether or not the purchase is tax-free
    private taxFree: boolean;
    //whether of not the product purchased was imported
    private imported: boolean;
    //the sales tax calculated on the purchase, initially zero
    private salesTax: number = 0;

    /**
     * Constructs the purchase of the product
     * @param name the name of the product purchased
     * @param quantity the number of same products purchased
     * @param price the price of each purchase
     * @param taxFree whether or not the purchase is tax-free
     * @param imported the sales tax calculated on the purchase, initially zero
     */
    constructor(name: string, quantity: number, price: number, taxFree: boolean, imported: boolean) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.taxFree = taxFree;
        this.imported = imported;
    }

    /**
     * Simple getter for product purchase name
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Simple getter for quantity of same products purchased
     */
    public getQuantity(): number {
        return this.quantity;
    }

    /**
     * Simple getter for purchase price per same product
     */
    public getPrice(): number {
        return this.price;
    }

    /**
     * Simple getter for whether purchase is tax-free
     */
    public getTaxFree(): boolean {
        return this.taxFree;
    }

    /**
     * Simple getter for whether purchase was imported
     */
    public getImported(): boolean {
        return this.imported;
    }

    /**
     * Simple getter for sales tax on the purchase
     */
    public getSalesTax(): number {
        return this.salesTax;
    }

    /**
     * Computes overall sales tax, which is sum of basic sales tax and import tax
     * @return overall sales tax on the purchase
     */
    public computeOverallSalesTax(): number {
        this.salesTax += this.computeBasicSalesTax();
        this.salesTax += this.computeImportTax();
        return this.salesTax;
    }

    /**
     * Computes basic sales tax on the purchase, if it is not tax-free
     * @return basic sales tax on the purchase, rounded up
     */
    private computeBasicSalesTax(): number {
        if(!this.taxFree) {
            const BASIC_SALES_TAX: number = 0.1;
            return this.roundTax(this.price * BASIC_SALES_TAX); 
        }
        return 0;
    }

    /**
     * Computes import tax on the purchase, if it was imported
     * @return import tax on the purchase, rounded up
     */
    private computeImportTax(): number { 
        if(this.imported) {
            const IMPORT_TAX: number = 0.05;
            return this.roundTax(this.price * IMPORT_TAX);
        }
        return 0;
    }

    /**
     * Rounds up the tax to a nearest constant multiple
     * @param tax tax to round up
     * @return rounded up tax
     * @throws Range Error if tax to round is negative
     */
    private roundTax(tax: number): number {
        //if tax is zero, it is already a multiple of any other constant
        if(tax < 0) {
            throw RangeError("Negative tax is not valid: " + tax);
        }
        const ROUND_UP_CONSTANT: number =  1 / 0.05;
        tax = (Math.ceil(tax * ROUND_UP_CONSTANT) / ROUND_UP_CONSTANT);
        return tax;
    }

    /**
     * Helper printer used to check properties of a purchase.
     */
    public print(): void {
        console.log("Printing out purchase...");
        console.log("Name: " + this.name);
        console.log("Price: " + this.price);
        console.log("Quantity: " + this.quantity);
        console.log("Tax Free: " + this.taxFree);
        console.log("Imported: " + this.imported);
        console.log("Sales Tax: " + this.computeOverallSalesTax());
        console.log("");
    }

}
