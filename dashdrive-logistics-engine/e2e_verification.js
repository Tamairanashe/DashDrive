"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function verifyVerticalFlows() {
    return __awaiter(this, void 0, void 0, function () {
        var merchantId, foodStore, foodProduct, stats, updatedStore, martStore, martProduct, shopStore, shopProduct, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('--- Phase 5 E2E Verification Start ---');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 16, 17, 19]);
                    merchantId = '5f165d31-d2ae-4aa9-9d18-233e18a3cad5';
                    // 1. Food Vertical Verification
                    console.log('\n[Food Vertical] Testing Store creation with ratings and prep time...');
                    return [4 /*yield*/, prisma.store.create({
                            data: {
                                merchantId: merchantId,
                                name: 'Test Gourmet Restaurant',
                                address: '123 Gourmet Way',
                                city: 'Harare',
                                currency: 'USD',
                                timezone: 'Africa/Harare',
                                estimatedPrepTime: 25,
                                cuisineTypes: ['Italian', 'Fine Dining'],
                            }
                        })];
                case 2:
                    foodStore = _a.sent();
                    console.log("\u2705 Food Store created: ".concat(foodStore.id));
                    console.log('[Food Vertical] Testing Product creation with food attributes...');
                    return [4 /*yield*/, prisma.product.create({
                            data: {
                                merchantId: merchantId,
                                name: 'Truffle Pasta',
                                basePrice: 18.50,
                                storeId: foodStore.id,
                                isHalal: true,
                                isVegetarian: true,
                            }
                        })];
                case 3:
                    foodProduct = _a.sent();
                    console.log("\u2705 Food Product created: ".concat(foodProduct.id));
                    console.log('[Review System] Testing automated rating aggregation...');
                    return [4 /*yield*/, prisma.review.create({
                            data: {
                                storeId: foodStore.id,
                                rating: 5,
                                comment: 'Amazing experience!'
                            }
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.review.create({
                            data: {
                                storeId: foodStore.id,
                                rating: 4,
                                comment: 'Good food, slightly late.'
                            }
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.review.aggregate({
                            where: { storeId: foodStore.id },
                            _avg: { rating: true },
                            _count: { id: true },
                        })];
                case 6:
                    stats = _a.sent();
                    return [4 /*yield*/, prisma.store.update({
                            where: { id: foodStore.id },
                            data: {
                                rating: stats._avg.rating || 0,
                                reviewCount: stats._count.id,
                            }
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.store.findUnique({ where: { id: foodStore.id } })];
                case 8:
                    updatedStore = _a.sent();
                    console.log("\u2705 Aggregated Rating: ".concat(updatedStore === null || updatedStore === void 0 ? void 0 : updatedStore.rating, ", Review Count: ").concat(updatedStore === null || updatedStore === void 0 ? void 0 : updatedStore.reviewCount));
                    // 2. Mart Vertical Verification
                    console.log('\n[Mart Vertical] Testing Product creation with barcode and weight...');
                    return [4 /*yield*/, prisma.store.create({
                            data: {
                                merchantId: merchantId,
                                name: 'Test Mart Express',
                                address: '456 Mart St',
                                city: 'Harare',
                                currency: 'USD',
                                timezone: 'Africa/Harare',
                            }
                        })];
                case 9:
                    martStore = _a.sent();
                    return [4 /*yield*/, prisma.product.create({
                            data: {
                                merchantId: merchantId,
                                name: 'Laundry Detergent',
                                basePrice: 12.00,
                                storeId: martStore.id,
                                barcode: 'MART-SKU-999',
                                weightUnit: '2kg',
                            }
                        })];
                case 10:
                    martProduct = _a.sent();
                    console.log("\u2705 Mart Product created with Barcode: ".concat(martProduct.barcode, ", Weight: ").concat(martProduct.weightUnit));
                    // 3. Shopping Vertical Verification
                    console.log('\n[Shopping Vertical] Testing Product creation with generic attributes...');
                    return [4 /*yield*/, prisma.store.create({
                            data: {
                                merchantId: merchantId,
                                name: 'Test Fashion Shop',
                                address: '789 Fashion Ave',
                                city: 'Harare',
                                currency: 'USD',
                                timezone: 'Africa/Harare',
                            }
                        })];
                case 11:
                    shopStore = _a.sent();
                    return [4 /*yield*/, prisma.product.create({
                            data: {
                                merchantId: merchantId,
                                name: 'Summer T-Shirt',
                                basePrice: 25.00,
                                storeId: shopStore.id,
                                attributes: {
                                    color: 'Sky Blue',
                                    size: ['S', 'M', 'L'],
                                    material: 'Cotton'
                                }
                            }
                        })];
                case 12:
                    shopProduct = _a.sent();
                    console.log("\u2705 Shopping Product created with Attributes: ".concat(JSON.stringify(shopProduct.attributes)));
                    // Cleanup
                    console.log('\n--- Cleanup ---');
                    return [4 /*yield*/, prisma.review.deleteMany({ where: { storeId: foodStore.id } })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, prisma.product.deleteMany({ where: { id: { in: [foodProduct.id, martProduct.id, shopProduct.id] } } })];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, prisma.store.deleteMany({ where: { id: { in: [foodStore.id, martStore.id, shopStore.id] } } })];
                case 15:
                    _a.sent();
                    console.log('✅ Cleanup complete.');
                    console.log('\n--- Phase 5 E2E Verification SUCCESS ---');
                    return [3 /*break*/, 19];
                case 16:
                    error_1 = _a.sent();
                    console.error('\n❌ Verification FAILED:', error_1);
                    return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, prisma.$disconnect()];
                case 18:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 19: return [2 /*return*/];
            }
        });
    });
}
verifyVerticalFlows();
