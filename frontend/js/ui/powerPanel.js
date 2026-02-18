
export const POWER_TREE = {
    meteor: {
        name: 'Météore',
        type: 'negative',
        cost: 10,
        description: 'Tue ~30% des humains',
        unlocked: false,
        parent: null
    },
    plague: {
        name: 'Peste',
        type: 'negative',
        cost: 15,
        description: 'Taux de mortalité 15%',
        unlocked: false,
        parent: null
    },
    blessing: {
        name: 'Bénédiction',
        type: 'positive',
        cost: 20,
        description: 'Restaure faim +20 pour tous',
        unlocked: false,
        parent: null
    },
    fertility: {
        name: 'Fertilité',
        type: 'positive',
        cost: 30,
        description: 'Boost reproduction x3',
        unlocked: false,
        parent: 'blessing'
    },
    plague2: {
        name: 'Mort Noire',
        type: 'negative',
        cost: 40,
        description: 'Mortalité 40% (grave)',
        unlocked: false,
        parent: 'plague'
    }
};

export class PowerPanel {
    constructor(kingdom) {
        this.kingdom = kingdom;
        this.powerPoints = 0;
        this.modal = null;
        this.tree = { ...POWER_TREE };
    }

    unlockPower(powerKey) {
        const power = this.tree[powerKey];
        if (!power) return false;
        if (power.unlocked) return false;
        if (power.cost > this.powerPoints) return false;
        if (power.parent && !this.tree[power.parent].unlocked) return false;

        power.unlocked = true;
        this.powerPoints -= power.cost;
        return true;
    }

    addPoints(amount) {
        this.powerPoints += amount;
        if (window._powerPanel) window._powerPanel.updateStatsDisplay();
    }

    getUnlockedPowers() {
        return Object.entries(this.tree)
            .filter(([_, p]) => p.unlocked)
            .map(([key, _]) => key);
    }

    updateStatsDisplay() {
        if (this.modal) {
            const title = this.modal.querySelector('h2');
            if (title) title.textContent = `Arbre de Pouvoir - Points: ${this.powerPoints}`;
        }
    }

    isPowerUnlocked(powerKey) {
        return this.tree[powerKey]?.unlocked || false;
    }

    openTreeModal() {
        if (this.modal) this.modal.remove();

        this.modal = document.createElement('div');
        this.modal.id = 'powerTreeModal';
        this.modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            max-height: 500px;
            background: #1a1a1a;
            border: 3px solid gold;
            border-radius: 10px;
            padding: 20px;
            color: white;
            font-family: Arial;
            z-index: 9999;
            overflow-y: auto;
        `;

        const title = document.createElement('h2');
        title.textContent = `Arbre de Pouvoir - Points: ${this.powerPoints}`;
        title.style.color = 'gold';
        this.modal.appendChild(title);

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';

        // Positive Powers
        const posTitle = document.createElement('h3');
        posTitle.textContent = 'Pouvoirs Positifs';
        posTitle.style.color = 'lightgreen';
        container.appendChild(posTitle);

        const posPowers = Object.entries(this.tree).filter(([_, p]) => p.type === 'positive');
        for (const [key, power] of posPowers) {
            const btn = this.createPowerButton(key, power);
            container.appendChild(btn);
        }

        // Negative Powers
        const negTitle = document.createElement('h3');
        negTitle.textContent = 'Pouvoirs Négatifs';
        negTitle.style.color = 'lightcoral';
        container.appendChild(negTitle);

        const negPowers = Object.entries(this.tree).filter(([_, p]) => p.type === 'negative');
        for (const [key, power] of negPowers) {
            const btn = this.createPowerButton(key, power);
            container.appendChild(btn);
        }

        this.modal.appendChild(container);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Fermer';
        closeBtn.style.cssText = `
            margin-top: 15px;
            padding: 10px 20px;
            background: #444;
            color: white;
            border: 1px solid gold;
            cursor: pointer;
            border-radius: 5px;
        `;
        closeBtn.addEventListener('click', () => this.modal.remove());
        this.modal.appendChild(closeBtn);

        document.body.appendChild(this.modal);
    }

    createPowerButton(key, power) {
        const btn = document.createElement('button');
        const status = power.unlocked ? '✓' : power.cost > this.powerPoints ? '✗' : '?';
        btn.textContent = `${status} ${power.name} - Coût: ${power.cost}`;
        btn.style.cssText = `
            padding: 10px;
            background: ${power.unlocked ? '#2d5016' : power.cost <= this.powerPoints ? '#404040' : '#2a2a2a'};
            color: ${power.unlocked ? 'lightgreen' : power.type === 'positive' ? 'lightgreen' : 'lightcoral'};
            border: 1px solid ${power.unlocked ? 'green' : power.type === 'negative' ? 'red' : 'gold'};
            cursor: ${!power.unlocked && power.cost <= this.powerPoints && (!power.parent || this.tree[power.parent].unlocked) ? 'pointer' : 'not-allowed'};
            border-radius: 5px;
            font-size: 14px;
            text-align: left;
        `;

        const descDiv = document.createElement('div');
        descDiv.style.cssText = 'font-size: 12px; opacity: 0.8; margin-top: 3px;';
        descDiv.textContent = power.description;
        btn.appendChild(descDiv);

        if (!power.unlocked && power.cost <= this.powerPoints && (!power.parent || this.tree[power.parent].unlocked)) {
            btn.addEventListener('click', () => {
                if (this.unlockPower(key)) {
                    window._powerPanel.openTreeModal(); 
                }
            });
        }

        return btn;
    }
}
