/**
 * Trust & Safety Verification Simulation
 * This script tests:
 * 1. Cancellation fee logic for users.
 * 2. Reliability score impact for drivers.
 * 3. Fraud detection (Velocity check).
 */

class MockTrustSimulation {
    private driverScore = 1.0;
    private cancellationCount = 0;
    private totalTrips = 10;

    simulateDriverCancel(status: string) {
        console.log(`\n🚨 Driver cancelled during: ${status}`);
        const penalty = status === 'en_route' ? 0.1 : 0.05;
        this.driverScore = Math.max(0, this.driverScore - penalty);
        this.cancellationCount++;
        console.log(`📉 Driver Score: ${this.driverScore.toFixed(2)} (-${penalty})`);
    }

    simulateUserCancel(status: string) {
        console.log(`\n👤 User cancelled during: ${status}`);
        let fee = 0;
        switch (status) {
            case 'driver_selected': fee = 0.5; break;
            case 'driver_arriving': fee = 2.0; break;
            case 'driver_arrived': fee = 5.0; break;
        }
        console.log(`💰 Cancellation Fee: $${fee.toFixed(2)}`);
        console.log(`💸 Driver Compensation: $${(fee * 0.75).toFixed(2)}`);
    }

    testFraudDetection(speedKmH: number) {
        console.log(`\n🛰️ Checking Velocity: ${speedKmH} km/h`);
        if (speedKmH > 180) {
            console.log("🚩 ALERT: Potential GPS Spoofing / High Speed Anomaly detected!");
        } else {
            console.log("✅ Velocity normal.");
        }
    }
}

const sim = new MockTrustSimulation();
sim.simulateDriverCancel('en_route');
sim.simulateUserCancel('driver_arrived');
sim.testFraudDetection(220);
sim.testFraudDetection(60);
