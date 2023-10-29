export class Sort {
	numberData = [];
	stringData = [];
	constructor(data, isNAN) {
		if (isNAN) {
			this.stringData = data;
		} else {
			this.numberData = data;
		}
	}
	alphabetically() {
		const arr = this.stringData;
		return arr.sort();
	}
	smallToBig = () => {
		const arr = this.numberData;
		return arr.sort((a, b) => a - b);
	};
	bigToSmall = () => {
		const arr = this.numberData;
		return arr.sort((a, b) => b - a);
	};
	wordsByLetters = () => {
		const arr = this.stringData;
		return arr.sort((a, b) => a.length - b.length);
	};
	uniqueWords = () => {
		let arr;
		if (this.stringData.length === 0) {
			arr = this.numberData;
		} else {
			arr = this.stringData;
		}
		const set = new Set(arr);
		return [...set];
	};
}
