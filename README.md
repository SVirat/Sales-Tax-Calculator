# Sales-Tax-Calculator
Calculates the sales tax and total price of purchases.

## Rules
1. Basic sales tax is applicable at a rate of 10% on all goods, except candy, popcorn and coffee, which are exempt.
2. Import duty is an additional sales tax applicable on all imported goods at a rate of 5%, with no exemptions.
3. When items are purchased a receipt is produced which lists the name of all the items and their price (including tax), finishing with the total cost of the items, and the total amounts of sales taxes paid.
4. Sales tax is rounded up to the nearest multiple of $0.05. This rounding is done by item, by type of tax (basic sales and import duty).

## Examples

**Inputs:** 

*Shopping Basket 1:*
```
1 16lb bag of Skittles at 16.00
1 Walkman at 99.99
1 bag of microwave Popcorn at 0.99
```

*Shopping Basket 2:*
```
1 imported bag of Vanilla-Hazelnut Coffee at 11.00
1 Imported Vespa at 15,001.25
```

*Shopping Basket 3:*
```
1 imported crate of Almond Snickers at 75.99
1 Discman at 55.00
1 Imported Bottle of Wine at 10.00
1 300# bag of Fair-Trade Coffee at 997.99
```

**Outputs**

*Output 1:*
```
1 16lb bag of Skittles: 16.00
1 Walkman: 109.99
1 bag of microwave Popcorn: 0.99
Sales Taxes: 10.00
Total: 126.98
```

*Output 2:*
```
1 imported bag of Vanilla-Hazelnut Coffee: 11.55
1 Imported Vespa: 17,251.50
Sales Taxes: 2,250.80
Total: 17,263.05
```

*Output 3:*
```
1 imported crate of Almond Snickers: 79.79
1 Discman: 60.50
1 imported bottle of Wine: 11.50
1 300# Bag of Fair-Trade Coffee: 997.99
Sales Taxes: 10.80
Total: 1,149.78
```

## Assumptions
1. We assume that all purchase information will be structures as in the examples: starting with the quantity, then stating if it was imported or not, then the name of the item, then finally the price at the end (without any currency symbols).
2. To determine which item is tax-free, we have a hard-coded array detailing which products should not be taxed. This works well with elements such as "popcorn", but is not exhaustive for elements such as "candy" and "coffee". This is because they can also be names "Skittles" and "Snickers", or "Mocha" and "Cappuccino". This is done mostly for simplicity, as it would be difficult to classify these different brands to a candy or coffee without the sure of some natural language processing model. I initially considered checking if a purchase had "bag(s)" or "crate(s)" of an item, but this is a flimsy solution, as although it works for the examples above, it is easily broken. For example, "1 bag of iPhones" would be considered tax-free with this method. So, I decided against this.
3. We will always print out the prices and taxes up to exactly two decimal places, even if it's a whole number (for example, 20 will be 20.00). In the original requirements, there were many inconsistencies in this formatting, as sometimes this receipt-friendly number was printed (16.00) while other times it was printed as a regular number (60.5). For this implementation, for consistency, all printed numbers are in the receipt-friendly format.
4. The price at the end of the purchase is for one quantity of that item. For example, "5 bags of candy at 8" implies one bag of candy is 8 (and so 5 boxes would be 40).

## Implementation
The input files are read by the Parser program, which then breaks the input files into purchase information for each basket. This information is further parsed to construct actual Purchase objects for each purchase. Tax information is the computed on the objects. The objects are then again parsed into text, to be written to standard output or written to an output file.

For example, the input file:

```
2 imported boxes of iPhones at 800
1 bag of chocolate at 5
```

Will be broken down as:

```
[
  ["2", "imported", "boxes", "of", "iPhones", "at", "800"],
  ["1", "bag", "of", "chocolate", "at", "5"]
]
```

This is created into objects and tax is computed:

```
[
 Purchase: {
  quantity: 2,
  imported: true,
  name: "boxes of iPhones",
  tax-free: false,
  price: 800,
  salesTax: 120
 },
 Purchase: {
  quantity: 1,
  imported: false,
  name: "bag of chocolates",
  tax-free: true,
  price: 5,
  salesTax: 0
 }
]
```

This is rebuilt into text:

```
2 imported boxes of iPhones at 920.00
1 bag of chocolate at 5.00
Sales Taxes: 240.00
Total: 1,845.00
```

This is because tax of one box of iPhones is 120, so price on the receipt is 800 + 120 = 920. As there are 2 boxes, overall sales tax becomes 240. Sales tax of bag of chocolate is 0, so that does not contribute to the tax. So,

Sales Taxes = (2 * 120.00) + (1 * 0) = 240.00,

Total = (2 * 920.00) + (1 * 5.00) = 1845.00

## Running the Implementation
1. Download the files in this repository and look at the input files (in the input folder).
2. You will need `chai` and `mocha` for unit testing, and types/nodes for parsing. When you download `package.json` and `tsconfig.json`, do this:

```
$ npm install @types/node --save-dev
$ npm install chai mocha ts-node @types/chai @types/mocha --save-dev
```

3. Transpile the files. The JavaScript files will be created in the `dist` folder. Run the `driver.js` program to see the outputs for the mentioned input files.

```
$ tsc
$ node dist/driver.js
```

4. There are 18 unit tests testing all of the currently used public methods. You can check the test suites by running the following:

```
$ npm run test
```

## Further Questions
For further clarifications, please reach out to Virat Singh, svirat@gmail.com.
