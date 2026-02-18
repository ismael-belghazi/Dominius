export class Building {
    constructor(x, y, type = 'farm') {
        this.x = x;
        this.y = y;
        this.type = type; 
        this.size = 20;
        this.built = true;
        this.pointsGenerated = 0;
        this.food = 0; 
        this.population = []; 

        
        const buildingTypes = {
            farm: { name: 'Ferme', color: '#F1C40F', pointsPerFrame: 0.05, foodProduction: 0.5 },
            house: { name: 'Maison', color: '#8B4513', pointsPerFrame: 0.02, capacity: 5 },
            market: { name: 'Marché', color: '#E74C3C', pointsPerFrame: 0.08, capacity: 10 }
        };

        this.config = buildingTypes[type] || buildingTypes.farm;
        this.name = this.config.name;
        this.color = this.config.color;
        this.pointsPerFrame = this.config.pointsPerFrame;
        this.foodProduction = this.config.foodProduction || 0;
        this.capacity = this.config.capacity || 0;
    }

    generatePoints() {
        return this.pointsPerFrame;
    }

    
    produceFood() {
        if (this.type === 'farm' && this.population.length > 0) {
            this.food += this.foodProduction * this.population.length;
        }
    }

    
    getFood(amount) {
        const available = Math.min(amount, this.food);
        this.food -= available;
        return available;
    }

    
    isHumanInside(human) {
        const dist = Math.hypot(human.x - this.x, human.y - this.y);
        return dist < this.size + 5;
    }
}
