const mllib = {

    createNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min)
    },

    createFloat(min, max){
        return Math.random() * (max - min) + min
    },

    createColor(sat, light){
        return `hsl(${this.createNumber(0, 360)},${sat}%,${light}%)`
    },

    randomString(length){
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },

    createArray(anzahl, min, max){
        const data = [];
        while(anzahl--){
            data.push(this.createNumber(min, max));
        }
        return data;
    },

    round(num, x) {
        return +(Math.round(num + "e+" + x)  + "e-" + x);
    },

    fib(max){
        let fib = [0, 1]; 
        for (let i = 2; i < max; i++) {
            fib.push(fib[i - 2] + fib[i - 1]);
        }
        return fib;
    }
}

export {mllib};