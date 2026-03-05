const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

/**
 * E2E Simulation: DashFood -> Logistics Engine
 * This script simulates a DashFood order moving to "READY" status
 * and verifies that the Logistics Engine receives the delivery request.
 */
async function simulateE2E() {
    console.log('🚀 Starting DashFood -> Logistics Engine E2E Simulation');
    
    // Mocking the data that would normally come from Supabase
    const mockOrder = {
        id: 'FOOD-' + Math.random().toString(36).substring(7).toUpperCase(),
        customer_name: 'Simulation User',
        total_amount: 45.50,
        status: 'ready',
        stores: {
            name: 'Simulated Burger Joint',
            address: '123 Test Ave, Harare',
            location_lat: -17.82,
            location_lng: 31.05
        },
        metadata: {
            delivery_address: '456 Delivery Lane, Harare'
        }
    };

    console.log(`\n1. Simulating Order ${mockOrder.id} ready in DashFood...`);
    
    try {
        const logisticsEngineService = require('../src/services/common/logisticsEngineService');
        
        console.log('2. Calling LogisticsEngineService.requestDelivery()...');
        const result = await logisticsEngineService.requestDelivery(mockOrder);
        
        console.log('\n✅ SIMULATION SUCCESSFUL!');
        console.log('-----------------------------------');
        console.log(`Order Reference: ${mockOrder.id}`);
        console.log(`Logistics Delivery ID: ${result.order_id || result.id}`);
        console.log(`Tracking URL: ${result.tracking_url}`);
        console.log('-----------------------------------');
        console.log('Rider dispatch is now successfully handled by the central engine.');

    } catch (error) {
        console.error('\n❌ SIMULATION FAILED');
        if (error.response) {
            console.error('Error Details:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
        process.exit(1);
    }
}

simulateE2E();
