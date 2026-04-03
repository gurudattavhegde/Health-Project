// health tracker functionality

class HealthTracker {
    constructor() {
        this.records = [];
    }

    addRecord(date, weight, calories) {
        const record = { date, weight, calories };
        this.records.push(record);
    }

    getRecords() {
        return this.records;
    }

    calculateAverageWeight() {
        const totalWeight = this.records.reduce((sum, record) => sum + record.weight, 0);
        return totalWeight / this.records.length;
    }

    calculateAverageCalories() {
        const totalCalories = this.records.reduce((sum, record) => sum + record.calories, 0);
        return totalCalories / this.records.length;
    }
}

// Example usage
const tracker = new HealthTracker();
tracker.addRecord('2026-04-01', 70, 2000);
tracker.addRecord('2026-04-02', 71, 2100);
console.log(tracker.getRecords());
console.log('Average Weight:', tracker.calculateAverageWeight());
console.log('Average Calories:', tracker.calculateAverageCalories());
